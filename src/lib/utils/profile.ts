import { QuranReminderForm } from "@/types/profile";

export const MAX_QURAN_REMINDERS = 5;

export function createDefaultQuranReminder(): QuranReminderForm {
  return {
    surahId: 67,
    days: [0, 1, 2, 3, 4, 5, 6],
    time: "11:00",
    timezone: "UTC",
    isEnabled: true,
  };
}

export const DAY_KEYS = [
  { value: 0, key: "sunday" },
  { value: 1, key: "monday" },
  { value: 2, key: "tuesday" },
  { value: 3, key: "wednesday" },
  { value: 4, key: "thursday" },
  { value: 5, key: "friday" },
  { value: 6, key: "saturday" },
] as const;

export function sortDays(days: number[]) {
  return [...days].sort((left, right) => left - right);
}

export function normalizeDays(days: number[]) {
  return [...new Set(days.map(Number))]
    .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
    .sort((left, right) => left - right);
}

export function formatTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}
