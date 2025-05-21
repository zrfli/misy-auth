"use client"

import { useState } from "react";
import { FaUserLock } from "react-icons/fa6";
import dynamic from 'next/dynamic';
import { AuthProviders } from "@/components/Auth/AuthForm/Service-Auth";
import { Logo } from "@/components/Logo";
import ButtonBar from "@/components/Skeleton/button-bar";

const LoginWithCredentials = dynamic(() => import('@/components/Auth/AuthForm/Credentials'), { 
    ssr: false,
    loading: () => <ButtonBar count={2} />                      
});

export default function Auth() {
    const [credentials, setCredentials] = useState(false);
    
    return (
        <div className="flex justify-center items-center py-20">
            <div className="relative p-4 w-full">
                <div className="flex flex-col items-center">
                    <Logo LogoClass="w-40 mb-8" />
                    <p className="text-xl font-semibold text-neutral-900 text-center mt-2 mb-4">Bilgi Yönetim Sistemi</p>
                    <div className="w-full max-w-80 space-y-6">
                        {credentials ? (
                            <LoginWithCredentials />
                        ) : (
                            <>
                                <AuthProviders />
                                <span className="block w-full bg-neutral-300 h-[1px]"></span>
                                <button 
                                    type="button" 
                                    onClick={() => setCredentials(true)}
                                    className="flex items-center justify-center space-x-2 p-3 border w-full text-base font-medium text-black rounded-lg bg-white hover:bg-neutral-50 group shadow cursor-pointer">
                                    <FaUserLock width={20} height={20} />
                                    <span className="whitespace-nowrap">Kullanıcı Adı ile Giriş</span>
                                </button>
                            </>
                        )}

                        {credentials && (
                            <div className="flex mt-4 justify-center">
                                <span onClick={() => setCredentials(false)} className="text-sm font-medium text-blue-500 hover:underline cursor-pointer">Geri dön</span>
                            </div>              
                        )}
                    </div>
                </div>
            </div>
            {/*<div className="flex flex-wrap items-center md:justify-between absolute bottom-0 w-full justify-center p-6 text-black text-xs font-medium">
                <div className="space-x-4">
                    <Link href="/privacy-policy" prefetch={false} target="_blank" className="hover:text-blue-500 transition-colors">Privacy Policy</Link>
                    <Link href="/terms" prefetch={false} target="_blank" className="hover:text-blue-500 transition-colors">Terms & Conditions</Link>
                    <Link href="https://instagram.com/eraycloud" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">Instagram</Link>
                </div>
                <span className="md:mt-0 mt-3">© 2025 Eray. All rights reserved.</span>
            </div>*/}
        </div>
    );
}