import * as OTPAuth from "otpauth";

interface Props {
    pinCode: string;
    secretKey?: string;
}

export default function verifyTwoFactor({ pinCode, secretKey }: Props) {
    const pin = pinCode || '';
    const secret = secretKey || '';

    const totp = new OTPAuth.TOTP({ secret: secret });

    const delta = totp.validate({ token: pin, window: 1 });

    if (delta !== null) return { success: true };

    return { success: false };
}

export function createTwoFactor() {
    const secret = new OTPAuth.Secret({ size: 20 });

    const totp = new OTPAuth.TOTP({
        issuer: "Misy",
        //label: ,
        secret: secret,
        algorithm: 'SHA1', 
        digits: 6,           
        period: 30
    });

    return { secretKey: secret.base32, otpauthUrl: totp.toString() };
}