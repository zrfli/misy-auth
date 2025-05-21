"use client";

import { signIn } from "next-auth/react";
import { useRef, useState } from "react";
import { signInSchema } from "@/lib/zod";
//import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import dynamic from "next/dynamic";
import ButtonBar from "@/components/Skeleton/button-bar";
import ForgotPassword from "@/components/Auth/Panel/Forgot-Password";
import HCaptcha from '@hcaptcha/react-hcaptcha';

const OTPForm = dynamic(() => import("./Two-Factor-Sheet"), { ssr: false })

export default function LoginWithCredentials() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [twoFactor, setTwoFactor] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null)
    const captchaRef = useRef<HCaptcha>(null);
    //const router = useRouter();

    const handleVerificationSuccess = (token: string) => { setCaptchaToken(token); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!captchaToken) { toast("Captcha Verification", { description: "Please verify a captcha" }); return; }

        setIsLoading(true);

        const validation = signInSchema.safeParse({ username, password });
        
        if (!validation.success) {
            toast("Oturum açılamadı", { description: validation.error.errors[0].message });
            setIsLoading(false);
            return;
        }

        const result = await signIn("credentials", {
            username: validation.data.username,
            password: validation.data.password,
            redirect: false, 
        });

        if (result?.error) {
            switch (result?.code) {
                case "Invalid Credentials":
                    toast("Oturum açılamadı", { description: "Kullanıcı adı veya şifre hatalı" });
                    break;
                case "Two Factor Required":
                    setTwoFactor(true);
                    break;
                default:
                    toast("Oturum açılamadı", { description: "Giriş yapılırken bir hata oluştu" });
            }
        }
    
        //if (result?.url) router.push('https://misy.online/cat');
         
        setIsLoading(false);
        setCaptchaToken(null);
        
        captchaRef.current?.resetCaptcha();
    };

    return (
        <>
            {twoFactor && <OTPForm username={username} password={password} />}
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                <input 
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    name="username" 
                    type="text" 
                    required
                    className="p-3 border w-full text-base font-medium text-black rounded-lg hover:bg-neutral-50 shadow" 
                    placeholder="Kullanıcı Adı"
                    aria-label="Kullanıcı Adı"
                />
                <input 
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    name="password" 
                    type="password"
                    required
                    className="p-3 border w-full text-base font-medium text-black rounded-lg hover:bg-neutral-50 shadow" 
                    placeholder="********"
                    aria-label="Şifre"
                />
                {isLoading ? (
                    <ButtonBar />
                ) : (
                    <>
                        <HCaptcha sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_KEY!} ref={captchaRef} onVerify={handleVerificationSuccess} />
                        <button 
                            type="submit" 
                            className="flex items-center justify-center p-3 border border-neutral-800 w-full text-base font-medium text-white rounded-lg bg-black hover:bg-neutral-800 shadow cursor-pointer"
                            aria-label="Giriş yap"
                        >
                            <span>Giriş yap</span>
                        </button>
                        <span className="block w-full bg-neutral-300 h-[1px]"></span>
                        <ForgotPassword />
                    </>
                )}
            </form>
        </>
    );
}