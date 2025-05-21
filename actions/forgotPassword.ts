"use server";

import { sendMail } from "@/lib/nodemailer";
import { redis } from "@/lib/redis";
import { forgotPasswordTeamplate } from "@/utils/emailTeamplate";
import crypto from "crypto";
import { auth } from "@/auth";
import { usernameSchema } from "@/lib/zod";
import { CACHE } from "@/utils/cacheConfig";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import * as Sentry from "@sentry/nextjs";

interface Props {
    username: string;
}

interface ResponseProps {
    success: boolean;
    message?: string;
}

interface CacheProps {
    userId: string;
    token: string;
}

async function cachePasswordToken({ userId, token }: CacheProps): Promise<boolean> {
    try {
        await redis.select(CACHE.passwordReset.REDIS_DB_KEY);

        const pipeline = redis.pipeline();
        
        pipeline.set(CACHE.passwordReset.KEY_PREFIX + CACHE.symbol + token, userId, 'EX', CACHE.passwordReset.EXPIRATION_TIME);

        const data = await pipeline.exec();

        return !!data;
    } catch (error) {
        Sentry.captureException(error);
        return false;
    }
}

export async function forgotPassword({ username }: Props): Promise<ResponseProps> {
    const session = await auth();
    if (session) return { success: false, message: "session" };

    const validation = usernameSchema.safeParse(username);
    if (!validation.success) return { success: false, message: validation.error.errors[0].message };

    let email, userId: string;

    try {
        const userCheck = await db.select({ id: user.id, email: user.email }).from(user).where(eq(user.username, String(validation.data)));
      
        if (userCheck.length === 0) return { success: false, message: "User not found" };

        userId = userCheck[0].id;
        email = userCheck[0].email;
    } catch (error) {
        Sentry.captureException(error);
        return { success: false, message: "An error occurred while resetting password" };
    }

    const token = crypto.randomBytes(32).toString("hex");

    const response = await sendMail({
        email,
        subject: "Şifre Yenileme",
        html: forgotPasswordTeamplate(token),
    });

    if (!response?.messageId) return { success: false, message: "Failed to send email" };

    const cacheSuccess = await cachePasswordToken({ userId, token });
    if (!cacheSuccess) return { success: false, message: "Failed to cache the token" };

    return { success: true };
}