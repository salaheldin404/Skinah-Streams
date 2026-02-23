"use client";

import { Plus, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateClick: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  const t = useTranslations("Khatma");

  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <div className="p-4 rounded-full bg-primary/10">
          <Sparkles className="h-12 w-12 text-primary" />
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{t("noPlansYet")}</h3>
      <p className="text-muted-foreground mb-6">{t("noPlansDescription")}</p>
      <Button onClick={onCreateClick} size="lg" className="gap-2">
        <Plus className="h-5 w-5" />
        {t("createFirstPlan")}
      </Button>
    </div>
  );
}
