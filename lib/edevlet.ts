import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

export interface EDevletProfile {
  kullaniciBilgileri: {
    kimlikNo: string;
    ad: string;
    soyad: string;
  };
  sonucKodu: string;
  sonucAciklamasi: string;
}

export default function EDevlet<P extends EDevletProfile>(options: OAuthUserConfig<P>): OAuthConfig<P> {
    return {
        id: "edevlet",
        name: "e-Devlet",
        type: "oauth",
        authorization: {
            url: "https://giris.turkiye.gov.tr/OAuth2AuthorizationServer/AuthorizationController",
            params: { response_type: "code" },
        },
        token: "https://giris.turkiye.gov.tr/OAuth2AuthorizationServer/AccessTokenController",
        userinfo: {
            url: "https://giris.turkiye.gov.tr/OAuth2AuthorizationServer/AuthenticationController",
            async request({ tokens }: { tokens: { access_token: string } }) {
                const response = await fetch(
                    `https://giris.turkiye.gov.tr/OAuth2AuthorizationServer/AuthenticationController?accessToken=${tokens.access_token}&resourceId=1&kapsam=Ad-Soyad&clientId=${options.clientId}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                    }
                );

                const data = await response.json();
                if (data.sonucKodu !== "EDV09.000") throw new Error(data.sonucAciklamasi);

                return {
                    id: data.kullaniciBilgileri.kimlikNo,
                    name: data.kullaniciBilgileri.ad,
                    surname: data.kullaniciBilgileri.soyad,
                };
            },
        },
        profile(profile) {
            return {
                id: profile.kullaniciBilgileri.kimlikNo,
                name: profile.kullaniciBilgileri.ad,
                surname: profile.kullaniciBilgileri.soyad,
                avatar: '', 
                role: '', 
            };
        },
        style: {
            bg: "#003366",  
            text: "#fff",
        },
        checks: ["state"], 
        clientId: options.clientId,
        clientSecret: options.clientSecret,
    };
}