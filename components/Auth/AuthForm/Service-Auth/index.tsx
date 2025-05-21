import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import Image from "next/image";
import { useState } from "react";
import ButtonBar from "@/components/Skeleton/button-bar";

const providers = [
  {
    id: "edevlet",
    text: "e-Devlet ile Giriş",
    icon: <Image src="/e-devlet-icon.svg" width={20} height={20} alt="e-Devlet" loading="lazy" unoptimized />
  },
  {
    id: "google",
    text: "Google ile Giriş",
    icon: <FaGoogle size={20} />
  },
];

export const AuthProviders = () => {
  const [loading, setLoading] = useState(false);

  return (
    <ul className="flex flex-col gap-2">
      {loading ? (
        <ButtonBar count={2} />
      ) : providers.length > 0 ? (
        providers.map((provider) => (
          <li key={provider.id}>
            <button
              type="button"
              className="flex items-center justify-center p-3 border border-neutral-800 space-x-2 w-full text-base font-medium text-neutral-50 rounded-lg bg-black hover:bg-neutral-800 group shadow cursor-pointer"
              onClick={() => { signIn(provider.id); setLoading(true); }
            }>
              {provider.icon}
              <span className="whitespace-nowrap">{provider.text}</span>
            </button>
          </li>
        ))
      ) : (
        <div>Sağlayıcı bulunamadı</div>
      )}
    </ul>
  );
};