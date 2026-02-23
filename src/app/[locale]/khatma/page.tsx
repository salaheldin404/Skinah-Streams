import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";
import { BookOpen } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { getKhatmaPlans } from "@/server/db/khatmaPlan";
import { KhatmaContent } from "@/components/khatma/KhatmaContent";
import { KhatmaPlan } from "@/types/khatma";

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
