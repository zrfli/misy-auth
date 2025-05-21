"use client"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { toast } from "sonner"
import { useState } from "react"
import { twoFactorCode } from "@/lib/zod"
import { signIn } from "next-auth/react"
import { useRouter } from 'next/navigation';
import { useTranslations } from "next-intl"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { useIsDesktop } from "@/hooks/useIsMobileOrTablet"

interface Props {
  username: string
  password: string
}

export default function OTPForm({ username, password }: Props) {
  const [pin, setPin] = useState("");
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const t = useTranslations("2fa");

  const handleSubmit = async () => {
    const validation = twoFactorCode.safeParse(pin);

    if (!validation.success) {
      toast("Event has been created", { description: validation.error.errors[0].message });
      return;
    }
    
    const result = await signIn("credentials", { 
      username: username, 
      password: password, 
      twoFactorCode: pin.toString(),
      redirect: false
    });
    
    if (result?.error) toast("Güvenlik Doğrulaması", { description: "" });
    if (result?.url) router.push("/dashboard");
  }

  return (
    <Sheet defaultOpen={true}>
      <SheetContent side={isDesktop ? "right" : "bottom"} className="h-auto w-full bg-white dark:bg-neutral-900 shadow-lg">
        <SheetHeader>
          <SheetTitle>{t("2faAuthTitle")}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col items-center justify-center mb-10 gap-2">
          <label htmlFor="secretKey" className="block mb-1 text-sm font-medium text-black text-center">{t('2faSecretKey')}</label>
          <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={pin} onChange={(pin) => setPin(pin)}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button
                className="text-white bg-black hover:bg-black/80 dark:hover:bg-neutral-800/80 dark:bg-neutral-800 font-medium rounded-lg text-xs w-full px-5 py-2.5 text-center cursor-pointer"
                onClick={handleSubmit}
            >
                Onayla
            </button>
            <SheetFooter>
              <button className="text-black bg-neutral-50 hover:bg-neutral-100 border border-neutral-300 font-medium rounded-lg text-xs w-full px-5 py-2.5 text-center cursor-pointer">
                Kapat
              </button>
            </SheetFooter>
          </div>
        </div>
      </SheetContent>
    </Sheet>    
  );
}