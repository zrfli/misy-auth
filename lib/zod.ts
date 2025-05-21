import { object, string } from "zod";
import { isValidPhoneNumber } from 'libphonenumber-js';

export const phoneNumberSchema = object({ 
  number: string().refine(isValidPhoneNumber, { message: "Invalid phone number" }) 
});

export const signInSchema = object({
  username: string()
    .min(1, "Kullanıcı adı boş bırakılamaz")
    .min(3, "Kullanıcı adı en az 3 karakter olmalıdır")
    .max(32, "Kullanıcı adı en fazla 32 karakter olmalıdır"),
  password: string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .max(32, "Şifre en fazla 32 karakter olmalıdır"),
  twoFactorCode: string().optional()
});

export const userInformationSchema = object({
  email: string().email("Geçerli bir e-posta adresi giriniz"),
  address: string()
    .min(5, "Adres en az 5 karakter olmalıdır")
    .max(100, "Adres en fazla 100 karakter olmalıdır")
});

export const twoFaAuthSchema = object({
  secretKey: string()
    .min(5, "secretKey en az 5 karakter olmalıdır")
    .max(50, "secretKey en fazla 50 karakter olmalıdır"),
  pin: string()
    .length(6, "pin 6 karakter olmalıdır")
});

export const twoFactorCode = string()
  .min(6, "Your one-time password must be 6 characters.")

export const passwordSchema = string()
  .min(6, "Şifre en az 6 karakter olmalıdır")
  .max(32, "Şifre en fazla 32 karakter olmalıdır");

export const usernameSchema = string()
  .min(3, "Kullanıcı adı en az 3 karakter olmalıdır")
  .max(32, "Kullanıcı adı en fazla 32 karakter olmalıdır");

export const sha256TokenSchema = string()
  .length(64, "Token 64 karakter olmalıdır")
  .regex(/^[a-f0-9]+$/, "Geçersiz Token formatı");