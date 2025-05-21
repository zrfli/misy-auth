"use server";

import { db } from "@/db";
import { twoFactorAuthentication } from "@/db/schema";
import { auth, unstable_update } from "@/auth";
import verifyTwoFactor from "@/lib/twoFaAuth";
import { twoFaAuthSchema } from "@/lib/zod";
import * as Sentry from "@sentry/nextjs";

interface ResponseProps {
    success: boolean;
    message?: string;
}

interface TwoFaProps {
    secretKey?: string;
    pin?: string;
} 

export async function verifyTwoAuth({ secretKey, pin }: TwoFaProps): Promise<ResponseProps> {
    const session = await auth();
    if (!session) return { success: false, message: "session" };

    if (!secretKey || !pin) return { success: false, message: "secretKey and pin are required" };

    const twoFaValidation = twoFaAuthSchema.safeParse({ secretKey, pin });

    if (!twoFaValidation.success) return { success: false, message: twoFaValidation.error.errors[0].message };

    const verifyToken = verifyTwoFactor({ pinCode: twoFaValidation.data.pin, secretKey: twoFaValidation.data.secretKey });

    if (!verifyToken.success) return { success: false, message: "secretKey not verified!" };
    
    try {
        const twoFactorAuth = await db.insert(twoFactorAuthentication).values({ 
            userId: session?.user?.id,
            secretKey: twoFaValidation.data.secretKey,
            service: 'GOOGLE'
        });

        if (!twoFactorAuth) return { success: false, message: "query execution error" };
        
        try {
            const update = await unstable_update({
                user: {
                    twoFactor: { secretKey: twoFaValidation.data.secretKey }
                }
            });

            console.table(update?.user);
        } catch (error) {
            Sentry.captureException(error);
            console.error("Güncelleme hatası:", error);
        }
        
        return { success: true };
    } catch (error) {
        Sentry.captureException(error);
        return { success: false, message: "An error occurred while resetting password" };
    }
}