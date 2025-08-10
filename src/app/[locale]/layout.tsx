import type { Metadata } from "next";
import { Cairo, Amiri_Quran } from "next/font/google";
import "../globals.css";

import { NextIntlClientProvider } from "next-intl";

import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/header/Navbar";
import NextTopLoader from "nextjs-toploader";

import StoreProvider from "@/lib/store/StoreProvider";

import PlayerWrapper from "@/components/audio/PlayerWrapper";
import { Toaster } from "@/components/ui/sonner";
// const notoNaskh = Noto_Naskh_Arabic({
//   subsets: ["arabic"],
//   weight: ["400", "500", "600", "700"], // Choose the weights you need
//   variable: "--font-noto-naskh", // The CSS variable we'll use in Tailwind
// });
const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"], // Choose the weights you need
  variable: "--font-cairo", // The CSS variable we'll use in Tailwind
});

const amiri = Amiri_Quran({
  subsets: ["arabic"],
  weight: ["400"], // Choose the weights you need
  variable: "--font-amiri", // The CSS variable we'll use in Tailwind
});

export const metadata: Metadata = {
  title: "Sakinah Streams",
  description:
    "Immerse yourself in the Holy Quran. Sakinah Streams offers beautiful, high-quality recitations to bring peace and tranquility (Sakinah - سكينة) to your day. Listen anytime, anywhere.",
};

export default async function RootLayout({
  children,
  modal,
  params,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{ locale: "en" | "ar" }>;
}>) {
  const { locale } = await params;

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body
        className={`${cairo.variable} ${amiri.variable}  dark:bg-background bg-gray-100`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader color="#7c3aed" showSpinner={false} />
          <StoreProvider>
            <NextIntlClientProvider locale={locale}>
              <Navbar />
              {children}
              {modal}
              <PlayerWrapper />
            </NextIntlClientProvider>
          </StoreProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
