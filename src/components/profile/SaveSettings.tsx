"use client";

import { Loader2, Save } from "lucide-react";
import { useTranslations } from "next-intl";

import quranData from "@/data/all-quran-surah.json";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { KhatmaReminderForm, QuranReminderForm } from "@/types/profile";
import { useMemo } from "react";
import { formatTime } from "@/lib/utils/profile";

type SaveSettingsProps = {
  quranReminders: QuranReminderForm[];
  khatmaReminder: KhatmaReminderForm;
  isSaving: boolean;
};

const SURAHS = quranData.data;

export default function SaveSettings({
  quranReminders,
  khatmaReminder,
  isSaving,
}: SaveSettingsProps) {
  const t = useTranslations("ProfilePage");
  const enabledReminders = useMemo(
    () => quranReminders.filter((r) => r.isEnabled),
    [quranReminders],
  );

  const quranSummary = useMemo(() => {
    if (enabledReminders.length === 0) {
      return t("save.noQuranReminders");
    }

    const preview = enabledReminders
      .slice(0, 2)
      .map((r) => `${SURAHS[r.surahId - 1].shortName} • ${formatTime(r.time)}`)
      .join(", ");

    const extraCount = enabledReminders.length - 2;

    return extraCount > 0 ? `${preview} +${extraCount}` : preview;
  }, [enabledReminders, t]);

  const khatmaSummary = formatTime(khatmaReminder.time);

  return (
    <Card className="rounded-[28px] border-white/70 bg-white/85 shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/90">
      <CardHeader>
        <CardTitle>{t("save.title")}</CardTitle>
        {/* <CardDescription>{t("save.description")}</CardDescription> */}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-border/70 bg-background/75 px-4 py-3 text-sm text-muted-foreground">
          {t("save.summary", {
            quran: quranSummary,
            khatma: khatmaSummary,
          })}
        </div>

        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-primary text-white "
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("save.saving")}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {t("save.action")}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
