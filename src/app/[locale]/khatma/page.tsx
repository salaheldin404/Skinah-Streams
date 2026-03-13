import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";
import { BookOpen } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { getKhatmaPlans } from "@/server/db/khatmaPlan";
import { KhatmaContent } from "@/components/khatma/KhatmaContent";
import { KhatmaPlan } from "@/types/khatma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "en" | "ar" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  const title = isArabic
    ? "مخطط الختمة"
    : "Khatma Planner";

  const description = isArabic
    ? "خطط وتابع رحلتك لإتمام القرآن الكريم. حدد أهداف القراءة اليومية وابقَ متحفزًا لإتمام ختمتك."
    : "Plan and track your journey to complete the Holy Quran. Set daily reading goals and stay motivated to finish your Khatma.";

  const keywords = isArabic
    ? ["ختمة القرآن", "مخطط الختمة", "قراءة القرآن", "خطة يومية", "إتمام القرآن", "سكينة ستريمز"].join(", ")
    : ["Khatma planner", "Quran completion", "daily reading plan", "finish Quran", "Khatma tracker", "Sakinah Streams"].join(", ");

  const canonical = `/${locale}/khatma`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: {
        en: "/en/khatma",
        ar: "/ar/khatma",
      },
    },
    robots:{
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Sakinah Streams",
      type: "website",
      locale: isArabic ? "ar_EG" : "en_US",
      images: ["/og/khatma.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og/khatma.png"],
    },
  };
}

export default async function KhatmaPage() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations("Khatma");
  
  // Get plans only if user is authenticated
  const plans = session?.user?.id 
    ? await getKhatmaPlans(session.user.id)
    : [] as KhatmaPlan[];

  return (
    <div className="main-container py-8 space-y-8">
      {/* Header Section */}
      <header className="text-center space-y-4">
        <div className="flex items-center justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t("description")}
        </p>
      </header>

      {/* Content Section */}
      <KhatmaContent initialPlans={plans} />
    </div>
  );
}
