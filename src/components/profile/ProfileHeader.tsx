"use client";

import { useLocale, useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { ProfileSummary } from "@/types/profile";

type ProfileHeaderProps = {
  profile: ProfileSummary;
  deviceCount: number;
  reminderCount: number;
};

function formatMemberSince(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default function ProfileHeader({
  profile,
  deviceCount,
  reminderCount,
}: ProfileHeaderProps) {
  const t = useTranslations("ProfilePage");
  const locale = useLocale();
  const memberSince = formatMemberSince(profile.createdAt, locale);

  return (
    <header className="rounded-[32px] border border-white/70 bg-white/80 px-6 py-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/85 md:px-8 md:py-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border border-primary/20 shadow-sm dark:border-primary/30">
            <AvatarImage
              src={profile.image ?? ""}
              alt={profile.name ?? profile.email}
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {(profile.name ?? profile.email).slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">
              {t("eyebrow")}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {t("title")}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              {t("description")}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-background/75 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {t("profile.memberSince")}
            </p>
            <p className="mt-2 text-sm font-semibold">{memberSince}</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/75 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {t("profile.connectedDevices")}
            </p>
            <p className="mt-2 text-sm font-semibold">{deviceCount}</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/75 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {t("profile.reminders")}
            </p>
            <p className="mt-2 text-sm font-semibold">{reminderCount}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
