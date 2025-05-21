"use client"

import { resetPassword } from "@/actions/resetPassword";
import { passwordSchema } from "@/lib/zod";
import { useEffect, useState } from "react";

interface Props {
    token: string;
}

export default function ResetPassword({ token }: Props) {
    const [message, setMessage] = useState<string>('');
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [rePassword, setRePassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const clearMessageAfterDelay = (setter: (value: string) => void) => {
        setTimeout(() => setter(''), 2000);
    };

    useEffect(() => {
        if (message) clearMessageAfterDelay(setMessage);
        if (passwordMessage) clearMessageAfterDelay(setPasswordMessage);
    }, [message, passwordMessage]);

    const handleSubmit = async () => {
        setMessage("");
        setPasswordMessage("");
        setLoading(true);

        if (password !== rePassword) {
            setPasswordMessage("Şifreler eşleşmiyor!");
            setLoading(false);
            return;
        }

        const validatedPassword = passwordSchema.safeParse(password);

        if (!validatedPassword.success) {
            setPasswordMessage(validatedPassword.error.errors[0].message);
            setLoading(false);
            return;
        }
        
        const result = await resetPassword({ token, password });

        if (result?.success) {
            setSuccess(true);
        } else {
            setMessage(result?.message || "Bir hata oluştu!");
        }

        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center">
            <div className="w-auto mt-4 max-w-md">
                {message && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">{message}</div>
                )}

                {success ? (
                    <div className="flex flex-col items-center justify-center mt-4">
                        <p className="text-2xl font-semibold mt-2">Başarılı!</p>
                        <p className="text-sm">Şifre başarılı bir şekilde sıfırlandı.</p>
                    </div>
                ) : (
                    <div className="space-y-4 text-center mt-4">
                        <p className="text-3xl font-semibold mt-2">Şifre Sıfırlama</p>
                        {passwordMessage && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">{passwordMessage}</div>
                        )}
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            name="password"
                            type="password"
                            required
                            className="p-3 border w-full text-base font-medium text-black rounded-lg hover:bg-neutral-50 shadow"
                            placeholder="Yeni Şifre"
                        />

                        <input
                            onChange={(e) => setRePassword(e.target.value)}
                            value={rePassword}
                            name="rePassword"
                            type="password"
                            required
                            className="p-3 border w-full text-base font-medium text-black rounded-lg hover:bg-neutral-50 shadow"
                            placeholder="Şifreyi Tekrar Girin"
                        />

                        <button
                            type="button"
                            disabled={loading}
                            className={`flex items-center justify-center p-3 border border-neutral-800 w-full text-base font-medium text-white rounded-lg bg-black shadow 
                                ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-800"}`}
                            onClick={handleSubmit}
                        >
                            {loading ? "İşlem yapılıyor..." : "Şifreyi Yenile"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}