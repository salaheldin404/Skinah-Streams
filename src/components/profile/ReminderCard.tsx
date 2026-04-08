import { CalendarDays, Clock3, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { cn } from "@/lib/utils";

import { QuranReminderForm } from "@/types/profile";
import quranData from "@/data/all-quran-surah.json";
import { memo } from "react";
import { DAY_KEYS, formatTime } from "@/lib/utils/profile";

interface ReminderCardProps {
  reminder: QuranReminderForm;
  index: number;
  dir: "ltr" | "rtl";
  onEdit: (reminder: QuranReminderForm) => void;
  onToggle: (id: string | undefined, isEnabled: boolean) => void;
  onRemove: (id: string | undefined) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (key: string, variables?: Record<string, any>) => string;
}
const ReminderCard = memo(
  ({
    reminder,
    index,
    onEdit,
    onToggle,
    onRemove,
    t,
    dir,
  }: ReminderCardProps) => {
    const surah = quranData.data[reminder.surahId - 1];

    return (
      <div className="relative overflow-hidden rounded-[26px] border border-primary/20 bg-gradient-to-br from-white via-primary/5 to-transparent p-5 shadow-sm dark:border-primary/20 dark:from-card dark:via-primary/10 dark:to-transparent">
        {/* Decorative background blur */}
        <div className="absolute -top-16 -right-10 h-36 w-36 rounded-full bg-primary/20 blur-3xl dark:bg-primary/10" />

        <div className="relative space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              {/* Reminder Number Badge */}
              <Badge
                variant="outline"
                className="rounded-full border-primary/20 bg-white/80 px-3 py-1 text-primary dark:border-primary/30 dark:bg-primary/10 dark:text-white"
              >
                {t("quranReminder.reminderCardLabel", {
                  number: index + 1,
                })}
              </Badge>
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {surah.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {surah.number}. {surah.englishName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-full border border-border/60 bg-white/70 px-3 py-2 dark:bg-background/40">
              <span
                className={cn(
                  "text-sm font-medium",
                  reminder.isEnabled
                    ? "text-primary" // Active state uses primary
                    : "text-muted-foreground",
                )}
              >
                {reminder.isEnabled
                  ? t("quranReminder.activeLabel")
                  : t("quranReminder.pausedLabel")}
              </span>
              <Switch
                checked={reminder.isEnabled}
                onCheckedChange={(checked) => onToggle(reminder.id, checked)}
                dir={dir}
                aria-label={t("quranReminder.toggleReminder")}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-white/70 p-3 dark:bg-background/40">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock3 className="h-4 w-4" />
                {t("quranReminder.timeLabel")}
              </div>
              <p className="mt-2 font-medium">{formatTime(reminder.time)}</p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-white/70 p-3 dark:bg-background/40">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                {t("quranReminder.daysLabel")}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {reminder.days.map((day) => {
                  const dayKey = DAY_KEYS.find((item) => item.value === day);

                  if (!dayKey) {
                    return null;
                  }

                  return (
                    <Badge
                      key={day}
                      variant="outline"
                      className="rounded-full border-primary/20 bg-primary/10 px-2.5 py-1 text-primary dark:border-primary/30 dark:bg-primary/10 dark:text-white"
                    >
                      {t(`days.${dayKey.key}`)}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onEdit(reminder)}
              className="rounded-xl"
            >
              <Pencil className="h-4 w-4" />
              {t("quranReminder.editAction")}
            </Button>
            {/* Destructive button remains red/destructive for UX safety */}
            <Button
              type="button"
              variant="ghost"
              onClick={() => onRemove(reminder.id)}
              className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              {t("quranReminder.removeAction")}
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

ReminderCard.displayName = "ReminderCard";

export default ReminderCard;
