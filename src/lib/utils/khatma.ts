import { TOTAL_QURAN_PAGES } from "@/lib/constants/khatma";
import { KhatmaPlan } from "@/types/khatma";

/**
 * Format a number using locale-aware digits (e.g. Arabic-Indic numerals).
 */
export const formatNumber = (num: number, locale: string): string => {
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(num);
};

/**
 * Format a Date (or ISO string) for display using the given locale.
 */
export const formatDate = (
  date: Date | string,
  locale: string,
  options?: Intl.DateTimeFormatOptions,
): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
};

/**
 * Calculate how many days it takes to finish and the target completion date.
 */
export const calculateDaysAndTarget = (
  pagesPerDay: number,
  totalPages: number = TOTAL_QURAN_PAGES,
): { days: number; targetDate: Date } => {
  const days = Math.floor(totalPages / Math.max(pagesPerDay, 1));
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + days);
  return { days, targetDate };
};

export const getKhatmaRange = (currentPage: number, pagesPerDay: number) => {
  const start = currentPage;
  const end = Math.min(currentPage + pagesPerDay - 1, TOTAL_QURAN_PAGES);
  return `${start}-${end}`;
};

/**
 * Convenience wrapper that returns pre-formatted strings for the create form.
 */
export const calculateKhatmaDetails = (
  pagesPerDay: number,
  locale: string,
  totalPages: number = TOTAL_QURAN_PAGES,
) => {
  const { days, targetDate } = calculateDaysAndTarget(pagesPerDay, totalPages);

  return {
    daysToComplete: formatNumber(days, locale),
    formattedTargetDate: formatDate(targetDate, locale),
  };
};

/**
 * Calculate elapsed and target day counts for a plan.
 *
 * Comparisons are done on calendar days (time-stripped) so that
 * `daysElapsed` increments at midnight local time, not 24 h after
 * the stored creation timestamp.
 */
export const toCalendarDay = (d: Date) =>
  Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());

export const calculatePlanDays = (
  plan: KhatmaPlan,
): { daysElapsed: number; targetDays: number } => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const {
    startDate,
    targetEndDate,
    isActive,
    isCompleted,
    totalPausedDays,
    pausedAt,
  } = plan;
  /** Strip the time portion of a date so comparisons land on calendar days. */

  const nowDay = toCalendarDay(new Date());
  const startDay = toCalendarDay(new Date(startDate));
  const endDay = toCalendarDay(new Date(targetEndDate));

  const dayDiff = (later: number, earlier: number) =>
    Math.max(0, Math.floor((later - earlier) / msPerDay));
  const targetDays = dayDiff(endDay, startDay);

  if (!isActive && isCompleted) {
    return {
      daysElapsed: targetDays,
      targetDays,
    };
  }
  if (!isActive && !isCompleted && !pausedAt) {
    return {
      daysElapsed: 0,
      targetDays,
    };
  }
  let rawElapsed = dayDiff(nowDay, startDay) - totalPausedDays;

  if (!isActive && pausedAt) {
    const pausedDay = toCalendarDay(new Date(pausedAt));
    rawElapsed = dayDiff(pausedDay, startDay) - totalPausedDays;
  }
  const daysElapsed = Math.min(Math.max(0, rawElapsed), targetDays);
  return {
    daysElapsed,
    targetDays,
  };
};

export function parsePageRange(
  rangeStr: string,
): { start: number; end: number } | null {
  const parts = rangeStr.split("-");

  if (parts.length === 1) {
    const page = parseInt(parts[0]);
    return isNaN(page) ? null : { start: page, end: page };
  }

  const start = parseInt(parts[0]);
  const end = parseInt(parts[1]);

  if (isNaN(start) || isNaN(end)) return null;

  // Ensure start ≤ end and within Mushaf bounds (1–604)
  return {
    start: Math.max(1, Math.min(start, end)),
    end: Math.min(604, Math.max(start, end)),
  };
}