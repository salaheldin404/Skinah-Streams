import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
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

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-tajawal",
});

// const amiri = Amiri_Quran({
//   subsets: ["arabic"],
//   weight: ["400"], // Choose the weights you need
//   variable: "--font-amiri", // The CSS variable we'll use in Tailwind
// });

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "en" | "ar" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = "https://skinah-streams.vercel.app";

  const commonMetadata: Metadata = {
    metadataBase: new URL(baseUrl),
    authors: [{ name: "Salah Eldin" }],
    publisher: "Salah Eldin",

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
      },
    },
    verification: {
      google: process.env.GOOGLE_VERIFICATION_CODE,
    },
  };

  if (locale === "ar") {
    return {
      ...commonMetadata,
      title: {
        default: "Sakinah Streams | تلاوات قرآنية خاشعة",
        template: "%s | Sakinah Streams",
      },
      description:
        "استمع لتلاوات القرآن الكريم بجودة عالية تبعث السكينة والطمأنينة في قلبك. يمكنك الاستماع في أي وقت ومن أي مكان.",
      keywords: [
        "قرآن",
        "تلاوات قرآنية",
        "سكينة",
        "طمأنينة",
        "استماع للقرآن",
        "تلاوة عالية الجودة",
        "القرآن الكريم",
        "تلاوة",
        "قراءة القرآن",
        "استماع قرآن",
      ].join(", "),
      alternates: {
        canonical: `${baseUrl}/${locale}`,
        languages: {
          en: `${baseUrl}/en`,
          ar: `${baseUrl}/ar`,
        },
      },
      openGraph: {
        type: "website",
        title: "Sakinah Streams | تلاوات قرآنية خاشعة",
        locale: "ar_EG",
        description:
          "تجربة روحانية عبر الاستماع لتلاوات القرآن الكريم المهدئة للنفس.",
        url: `${baseUrl}/${locale}`,
        siteName: "Sakinah Streams",
      },
    };
  }
  return {
    ...commonMetadata,
    title: {
      default: "Sakinah Streams | Peaceful Quran Recitations",
      template: "%s | Sakinah Streams",
    },
    description:
      "Immerse yourself in the Holy Quran. Sakinah Streams offers beautiful, high-quality recitations to bring peace and tranquility (Sakinah - سكينة) to your day. Listen anytime, anywhere.",
    keywords: [
      "Quran",
      "Quran Recitations",
      "Sakinah",
      "Tranquility",
      "Listen to Quran",
      "High-Quality Recitations",
      "Holy Quran",
      "Quran Listening",
      "Islamic Content",
      "Spiritual Peace",
    ].join(", "),
    alternates: {
      canonical: `${baseUrl}/en`,
      languages: {
        en: `${baseUrl}/en`,
        ar: `${baseUrl}/ar`,
      },
    },
    openGraph: {
      type: "website",
      title: "Sakinah Streams | Peaceful Quran Recitations",
      locale: "en_US",
      description:
        "Listen to the Holy Quran recited beautifully to bring calm and spiritual peace to your day.",
      url: `${baseUrl}/en`,
      siteName: "Sakinah Streams",
    },
  };
}

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
        className={`${cairo.variable} ${tajawal.variable} dark:bg-background bg-gray-100`}
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
