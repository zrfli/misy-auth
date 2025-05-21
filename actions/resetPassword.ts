"use server";

import { auth } from "@/auth";
import { redis } from "@/lib/redis";
import { sha256TokenSchema, passwordSchema } from "@/lib/zod";
import { hashPassword } from "@/utils/hash";
import { CACHE } from "@/utils/cacheConfig";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as Sentry from "@sentry/nextjs";

interface ResponseProps {
    success: boolean;
    message?: string;
}

interface ResetPasswordProps {
    token?: string;
    password?: string;
} 

async function getPasswordResetToken(token: string): Promise<string | null> {
    if (!token) return null;

    try {
        const cachedData = await redis.get(CACHE.passwordReset.KEY_PREFIX + CACHE.symbol + token);
        return cachedData ?? null;
    } catch(error) {
        Sentry.captureException(error);
        return null;
    }
}

export async function resetPassword({ token, password }: ResetPasswordProps): Promise<ResponseProps> {
    const session = await auth();
    if (session) return { success: false, message: "session" };

    if (!token || !password) return { success: false, message: "Token and password are required" };

    const tokenValidation = sha256TokenSchema.safeParse(token);
    if (!tokenValidation.success) return { success: false, message: tokenValidation.error.errors[0].message };

    const passwordValidation = passwordSchema.safeParse(password);
    if (!passwordValidation.success) return { success: false, message: passwordValidation.error.errors[0].message };

    const cachedUserId = await getPasswordResetToken(token);
    
    if (!cachedUserId) return { success: false, message: "Token is missing or expired" };

    try {
        const hashedPassword = hashPassword(passwordValidation.data);

        const updatedUser = await db.update(user).set({ password: hashedPassword }).where(eq(user.id, cachedUserId))

        if (!updatedUser) return { success: false, message: "password not updated!" };

        await redis.del(CACHE.passwordReset.KEY_PREFIX + CACHE.symbol + token);
        return { success: true };
    } catch (error) {
        Sentry.captureException(error);
        return { success: false, message: "An error occurred while resetting password" };
    }
}