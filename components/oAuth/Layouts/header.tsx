"use client"

import { Logo } from "@/components/Logo";
import AvatarCardSkeleton from "@/components/Skeleton/avatar";
//import { fetchAvatar } from "@/services/api";
import Image from "next/image";
import { useEffect } from "react";
//import { toast } from "sonner";

interface AvatarData {
    avatar?: string;
}

export default function OAuthHeader({ authToken }: { authToken: string }) {
    //const [data, setData] = useState<AvatarData | null>(null);
    
    useEffect(() => {
        if(authToken) {
            /*fetchAvatar(authToken)
                .then((response) => { if(response.data) { setData({ avatar: response.data }) } })
                .catch(() => { toast("Avatar yüklenemedi!", { description: "Bir hata oluştu, lütfen tekrar deneyin." }); });*/
        }
    }, [authToken]);
    
    return (
        <header className="sticky top-0 z-50 w-full border-b border-neutral-300 dark:border-neutral-600 bg-white dark:bg-black">
            <nav className="px-4 lg:px-6 py-2.5">
                <div className="flex justify-between items-center">
                    <Logo LogoClass="h-auto w-40 dark:invert" />
                    <AvatarCardSkeleton className="rounded-full w-10 h-10" />
                </div>
            </nav>
        </header>
    );
}
