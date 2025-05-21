"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 

export default function AuthError() {
    const [isClient, setIsClient] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return; 

        const timer = setTimeout(() => {
        router.push('/');
        }, 8000);

        return () => clearTimeout(timer);
    }, [isClient, router]);

    if (!isClient) {
        return null;
    }

    return (
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 pt-20">
            <div className="mx-auto max-w-screen-sm text-center">
                <h1 className="mb-4 text-7xl tracking-tight font-extrabold text-neutral-600">Session Error</h1>
                <p className="mt-2 text-sm text-gray-500">Bu hata, oturum doğrulama işlemi sırasında meydana geldi. Lütfen giriş bilgilerinizi kontrol edin.</p>
                <p className="mt-6 text-sm text-neutral-500">
                    Yönlendiriliyorsunuz... Eğer yönlendirme olmazsa, 
                    <span onClick={() => router.push('/')} className="text-blue-500 hover:text-blue-700"> buraya tıklayın</span>.
                </p>
            </div>   
        </div>
    );
}