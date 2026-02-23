"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Pause,
  Play,
  Trash2,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  calculatePlanDays,
  formatDate,
  toCalendarDay,
} from "@/lib/utils/khatma";
import type { KhatmaPlan } from "@/types/khatma";
import { deleteKhatmaPlan, updateKhatma } from "@/server/khatma";

import { Link } from "@/i18n/navigation";

interface KhatmaPlanCardProps {
  plan: KhatmaPlan;
}

export function KhatmaPlanCard({ plan }: KhatmaPlanCardProps) {
  const t = useTranslations("Khatma");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const progressPercentage = (plan.completedPages / plan.totalPages) * 100;
  const remainingPages = plan.totalPages - plan.completedPages;
  const { daysElapsed, targetDays } = calculatePlanDays(plan);

  const handleMarkProgress = (pagesToAdd: number) => {
    startTransition(async () => {
      try {
        const newCompletedPages = Math.min(
          plan.totalPages,
          plan.completedPages + pagesToAdd,
        );
        const newCurrentPage = Math.min(
          plan.totalPages,
          plan.currentPage + pagesToAdd,
        );

        const result = await updateKhatma(plan.id, {
          completedPages: newCompletedPages,
          currentPage: newCurrentPage,
          isCompleted: newCompletedPages >= plan.totalPages,
          bookMarkIndex: null,
        });

        if (result.status === 200) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      } catch {
        toast.error(t("updateError"));
      }
    });
  };

  const handleToggleActive = () => {
    startTransition(async () => {
      try {
        // resume from pause: calculate paused days and update before toggling active
        if (!plan.isActive) {
          const msPerDay = 1000 * 60 * 60 * 24;
          const pausedStart = toCalendarDay(
            plan.pausedAt ? new Date(plan.pausedAt) : new Date(),
          );
          const now = toCalendarDay(new Date());

          const pausedDays = Math.floor((now - pausedStart) / msPerDay);
          await updateKhatma(plan.id, {
            totalPausedDays: plan.totalPausedDays + pausedDays,
            pausedAt: null,
            isActive: true,
          }).then((res) => {
            if (res.status === 200) {
              toast.success(t("planActivated"));
            } else {
              toast.error(res.message);
            }
          });
        } else {
          // pausing: set pausedAt to now, keep totalPausedDays until resume
          await updateKhatma(plan.id, {
            pausedAt: new Date().toISOString(),
            isActive: false,
          }).then((res) => {
            if (res.status === 200) {
              toast.success(t("planPaused"));
            } else {
              toast.error(res.message);
            }
          });
        }
      } catch {
        toast.error(t("updateError"));
      }
    });
  };

  const handleDelete = () => {
    if (!confirm(t("confirmDelete"))) return;
    startTransition(async () => {
      try {
        const res = await deleteKhatmaPlan(plan.id);
        if (res.status === 200) {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      } catch {
        toast.error(t("deleteError"));
      }
    });
  };

  return (
    <Card className={plan.isActive ? "border-primary" : "opacity-75"}>
      <CardHeader className="px-4 md:px-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {plan.title || t("myKhatmaPlan")}
              {plan.isCompleted && (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {t("completed")}
                </Badge>
              )}
              {plan.isActive && !plan.isCompleted && (
                <Badge variant="default">{t("active")}</Badge>
              )}
              {!plan.isActive && !plan.isCompleted && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 dark:text-white shrink-0">
                  {t("paused")}
                </span>
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              {t("startedOn")} {formatDate(plan.startDate, locale)}
            </CardDescription>
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleActive}
              disabled={isPending || plan.isCompleted}
              className="cursor-pointer"
            >
              {plan.isActive ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isPending}
              className="cursor-pointer"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 md:px-6 space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("progress")}</span>
            <span className="font-bold">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {plan.completedPages} / {plan.totalPages} {t("pages")}
            </span>
            <span>
              {remainingPages} {t("remaining")}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-2 md:p-3 rounded-lg bg-primary/5">
            <BookOpen className="h-5 w-5 text-primary" />
            <div className="text-center">
              <p className="text-[10px] md:text-xs text-muted-foreground">
                {t("pagesPerDay")}
              </p>
              <p className="text-lg font-bold">{plan.pagesPerDay}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 md:p-3 rounded-lg bg-blue-500/5">
            <Calendar className="h-5 w-5 text-blue-500" />
            <div className="text-center">
              <p className="text-[10px] md:text-xs text-muted-foreground">
                {t("daysElapsed")}
              </p>
              <p className="text-lg font-bold">
                {daysElapsed} / {targetDays}
              </p>
            </div>
          </div>
        </div>

        {/* Target Date */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">{t("targetCompletion")}</span>
          </div>
          <span className="text-sm font-bold">
            {formatDate(plan.targetEndDate, locale)}
          </span>
        </div>

        {/* Notes */}
        {plan.notes && (
          <div className="p-3 rounded-lg bg-muted/30 text-sm text-muted-foreground">
            {plan.notes}
          </div>
        )}
      </CardContent>

      {!plan.isCompleted && plan.isActive && (
        <CardFooter className="flex flex-wrap gap-2 px-4 md:px-6">
          <Button
            className="cursor-pointer flex-1"
            disabled={isPending}
            // onClick={() => router.push(`/KhatmaReaderPage`)}
          >
            <Link href="/KhatmaReaderPage">{t("readWird")}</Link>
          </Button>
          <div className="w-full lg:w-auto flex gap-2 justify-between ">
            <Button
              onClick={() => handleMarkProgress(plan.pagesPerDay)}
              disabled={isPending}
              className="cursor-pointer flex-1"
            >
              {t("markTodayComplete")}
            </Button>
            <Button
              onClick={() => handleMarkProgress(1)}
              disabled={isPending}
              variant="outline"
              className="cursor-pointer"
            >
              +1
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
