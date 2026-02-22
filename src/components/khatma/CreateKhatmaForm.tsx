"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { BookOpen, Calendar, Info, Target } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_PAGES_PER_DAY,
  MAX_NOTES_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_PAGES_PER_DAY,
  TOTAL_QURAN_PAGES,
} from "@/lib/constants/khatma";
import { getKhatmaSchema, type KhatmaInput } from "@/lib/validations/khatmaSchema";
import { calculateKhatmaDetails, formatNumber } from "@/lib/utils/khatma";
import { createKhatmaPlan } from "@/server/khatma";
import StatCard from "./StatCard";
import ErrorMessage from "./ErrorMessage";

interface CreateKhatmaFormProps {
  onSuccess: () => void;
}

export function CreateKhatmaForm({ onSuccess }: CreateKhatmaFormProps) {
  const t = useTranslations("Khatma");
  const tValidation = useTranslations("KhatmaValidation");
  const locale = useLocale();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<KhatmaInput>({
    resolver: zodResolver(getKhatmaSchema(tValidation)),
    defaultValues: {
      pagesPerDay: DEFAULT_PAGES_PER_DAY,
      title: "",
      notes: "",
    },
  });

  const watchedPages = watch("pagesPerDay");

  const { daysToComplete, formattedTargetDate } = useMemo(
    () => calculateKhatmaDetails(Number(watchedPages) || 1, locale),
    [watchedPages, locale],
  );

  const onSubmit = async (data: KhatmaInput) => {
    try {
      const result = await createKhatmaPlan(data);
      if (result.status !== 201) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      onSuccess();
    } catch (error) {
      console.error("Error creating khatma plan:", error);
      toast.error(t("createError"));
    }
  };

  return (
    <Card className="border-2 border-primary/20 shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <BookOpen className="h-6 w-6 text-primary" />
          {t("createNewPlan")}
        </CardTitle>
        <CardDescription className="text-base">
          {t("createPlanDescription")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Plan Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              {t("planTitle")}{" "}
              <span className="text-muted-foreground">({t("optional")})</span>
            </Label>
            <Input
              id="title"
              placeholder={t("planTitlePlaceholder")}
              {...register("title")}
              maxLength={MAX_TITLE_LENGTH}
              className="h-11"
            />
            <ErrorMessage message={errors.title?.message} />
          </div>

          {/* Pages Per Day */}
          <div className="space-y-3">
            <Label htmlFor="pagesPerDay" className="text-base font-semibold">
              {t("pagesPerDay")}
            </Label>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Input
                id="pagesPerDay"
                type="number"
                min={MIN_PAGES_PER_DAY}
                max={TOTAL_QURAN_PAGES}
                className="w-full sm:w-28 h-12 text-xl font-bold text-center"
                {...register("pagesPerDay", { valueAsNumber: true })}
              />
              <div className="flex-1 p-3.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg text-sm text-slate-700 dark:text-slate-300 flex gap-2.5 items-start">
                <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
                <p className="leading-relaxed">{t("pagesPerDayHelp")}</p>
              </div>
            </div>
            <ErrorMessage message={errors.pagesPerDay?.message} />
          </div>

          {/* Calculation Results */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/10">
            <StatCard
              icon={<BookOpen className="h-5 w-5 text-primary" />}
              label={t("totalPages")}
              value={formatNumber(TOTAL_QURAN_PAGES, locale)}
              bgColor="bg-primary/10"
            />
            <StatCard
              icon={<Calendar className="h-5 w-5 text-blue-600" />}
              label={t("daysToComplete")}
              value={daysToComplete}
              bgColor="bg-blue-500/10"
            />
            <StatCard
              icon={<Target className="h-5 w-5 text-green-600" />}
              label={t("targetDate")}
              value={formattedTargetDate}
              bgColor="bg-green-500/10"
              valueClassName="text-sm"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              {t("notes")}{" "}
              <span className="text-muted-foreground">({t("optional")})</span>
            </Label>
            <Textarea
              id="notes"
              placeholder={t("notesPlaceholder")}
              {...register("notes")}
              maxLength={MAX_NOTES_LENGTH}
              className="min-h-[100px] resize-none"
            />
            <ErrorMessage message={errors.notes?.message} />
          </div>

          {/* Submit */}
          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full h-12 text-base font-semibold cursor-pointer"
            size="lg"
          >
            {isSubmitting ? t("creating") : t("createFirstPlan")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
