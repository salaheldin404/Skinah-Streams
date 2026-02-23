"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import type { KhatmaPlan } from "@/types/khatma";
import { CreateKhatmaForm } from "./CreateKhatmaForm";
import { KhatmaPlanCard } from "./KhatmaPlanCard";
import { EmptyState } from "./EmptyState";

interface KhatmaContentProps {
  initialPlans: KhatmaPlan[];
}

export function KhatmaContent({ initialPlans }: KhatmaContentProps) {
  const t = useTranslations("Khatma");
  const [showCreateForm, setShowCreateForm] = useState(
    initialPlans.length === 0,
  );

  const hasPlans = initialPlans.length > 0;

  if (showCreateForm) {
    return (
      <div className="max-w-2xl mx-auto">
        <CreateKhatmaForm onSuccess={() => setShowCreateForm(false)} />
        {hasPlans && (
          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={() => setShowCreateForm(false)}>
              {t("cancel")}
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (!hasPlans) {
    return <EmptyState onCreateClick={() => setShowCreateForm(true)} />;
  }

  return (
    <>
      <div className="flex justify-center">
        <Button
          onClick={() => setShowCreateForm(true)}
          size="lg"
          className="gap-2"
        >
          <Plus className="h-5 w-5" />
          {t("createNewPlan")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {initialPlans.map((plan) => (
          <KhatmaPlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </>
  );
}
