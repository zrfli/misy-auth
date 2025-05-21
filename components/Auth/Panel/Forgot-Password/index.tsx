"use client";

import { forgotPassword } from "@/actions/forgotPassword";
import { useEffect, useState } from "react";
import { usernameSchema } from "@/lib/zod";
import Image from "next/image";
import { ASSETS } from "@/utils/bucketContent";
import { TbLockPassword } from "react-icons/tb";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ButtonBar from "@/components/Skeleton/button-bar";

export default function ForgotPassword() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 2000);
      
      return () => clearTimeout(timer); 
    }
  }, [message]);

  const handleSubmit = async () => {
    setMessage("");
    setLoading(true);

    const validatedFields = usernameSchema.safeParse(username);

    if (!validatedFields.success) {
      setMessage(validatedFields.error.errors[0].message);
      setLoading(false);
      return;
    }

    const result = await forgotPassword({ username });

    if (result?.success) {
      setSuccess(true);
      setUsername("");
    } else {
      setMessage(result?.message || "Bir hata oluştu!");
    }
    
    setLoading(false);
  };

  return (
    <Dialog onOpenChange={(isOpen) => { if (!isOpen) setSuccess(false); setUsername(""); setMessage(""); }} >
      <DialogTrigger asChild>
        <button 
          type="button" 
          className="flex items-center justify-center space-x-2 p-3 border w-full text-base font-medium text-black rounded-lg bg-white hover:bg-neutral-50 group shadow cursor-pointer">
          <TbLockPassword width={20} height={20} />
          <span className="whitespace-nowrap">Parolanızı mı unuttunuz?</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm md:min-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="text-xl">Parolanızı mı unuttunuz?</DialogTitle>
          <DialogDescription className="text-sm text-black font-medium">Kullanıcı adını gir ve hesabına yeniden girebilmen için sana bir bağlantı gönderelim.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center">
          <div className="w-auto mt-4 max-w-md">
            {message && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">{message}</div>
            )}

            {success ? (
              <div className="flex flex-col items-center justify-center text-center">
                <Image src={ASSETS.icons.forgotPasswordSuccess} width={96} height={96} alt="Başarı" unoptimized />
                <p className="text-2xl font-semibold mt-2">Başarılı!</p>
                <p className="text-sm">Şifre sıfırlama bağlantınız e-posta adresinize gönderildi.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  name="username"
                  type="text"
                  required
                  className="p-3 border space-x-2 w-full text-base font-medium text-black rounded-lg hover:bg-neutral-50 shadow"
                  placeholder="Kullanıcı Adı"
                />
                {loading ? (
                  <ButtonBar />
                ) : (
                  <button
                    type="button"
                    disabled={loading}
                    className="flex items-center justify-center cursor-pointer p-3 border border-neutral-800 space-x-2 w-full text-base font-medium text-white rounded-lg bg-black hover:bg-neutral-800 group shadow"
                    onClick={handleSubmit}
                  >
                    Bağlantı Gönder
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}