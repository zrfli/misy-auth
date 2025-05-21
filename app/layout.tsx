import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import "@/styles/globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Misy - Bilgi Yönetim Sistemi",
  description: "Development by Misy",
  keywords: 'misy',
  authors: [{ name: 'Eray', url: 'https://eray.dev' }],
};

export const viewport: Viewport = {
  maximumScale: 1,
  userScalable: false
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const locale = await getLocale();

  return (
    <html lang={locale} translate="no" suppressHydrationWarning>
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
          <Toaster />
      </body>
    </html>
  );
}