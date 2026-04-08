"use client";

import { Bell, Smartphone, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type { ProfileSummary } from "@/types/profile";

type ProfileInformationProps = {
  profile: ProfileSummary;
  deviceCount: number;
  permission: NotificationPermission;
  onPermissionRequest: () => Promise<void>;
};

export default function ProfileInformation({
  profile,
  deviceCount,
  permission,
  onPermissionRequest,
}: ProfileInformationProps) {
  const t = useTranslations("ProfilePage");

  const permissionTone =
    permission === "granted"
      ? "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/30"
      : permission === "denied"
        ? "text-amber-800 bg-amber-50 border-amber-200 dark:text-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30"
        : "text-sky-800 bg-sky-50 border-sky-200 dark:text-sky-200 dark:bg-sky-500/10 dark:border-sky-500/30";

  return (
    <Card className="rounded-[28px] border-white/70 bg-white/85 shadow-sm backdrop-blur dark:border-white/10 dark:bg-card/90">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <UserRound className="h-5 w-5 text-amber-700 dark:text-amber-300" />
          {t("profile.title")}
        </CardTitle>
        <CardDescription>{t("profile.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label>{t("profile.nameLabel")}</Label>
          <div className="rounded-2xl border border-border/70 bg-background/75 px-4 py-3 text-sm">
            {profile.name || t("profile.nameFallback")}
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("profile.emailLabel")}</Label>
          <div className="rounded-2xl border border-border/70 bg-background/75 px-4 py-3 text-sm">
            {profile.email}
          </div>
        </div>

        <div className={cn("rounded-2xl border px-4 py-4", permissionTone)}>
          <div className="flex items-start gap-3">
            <Bell className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold">{t("permission.title")}</p>
                <p className="mt-1 text-sm">
                  {t(`permission.status.${permission}`)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-current/15 px-3 py-1 text-xs font-medium">
                  <Smartphone className="h-3.5 w-3.5" />
                  {t("permission.connectedCount", {
                    count: deviceCount,
                  })}
                </div>

                {permission !== "granted" ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 rounded-full border-current/20 bg-transparent"
                    onClick={onPermissionRequest}
                  >
                    {t("permission.enableAction")}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
