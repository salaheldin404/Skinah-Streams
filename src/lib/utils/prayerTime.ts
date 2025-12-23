export const iconBgColors = {
  Fajr: "bg-indigo-100 dark:bg-indigo-900/50",
  Dhuhr: "bg-sky-100 dark:bg-sky-900/50",
  Asr: "bg-amber-100 dark:bg-amber-900/50",
  Maghrib: "bg-orange-100 dark:bg-orange-900/50",
  Isha: "bg-purple-100 dark:bg-purple-900/50",
};

export const iconTextColors = {
  Fajr: "text-indigo-500 dark:text-indigo-300",
  Dhuhr: "text-sky-500 dark:text-sky-300",
  Asr: "text-amber-500 dark:text-amber-300",
  Maghrib: "text-orange-500 dark:text-orange-300",
  Isha: "text-purple-500 dark:text-purple-300",
};

export const formatTo12Hour = (time24: string) => {
  if (!time24 || typeof time24 !== "string") return "";
  const [hours, minutes] = time24.split(":");
  let h = parseInt(hours, 10);
  h = h % 12;
  h = h ? h : 12; // Handle midnight (00:xx) by converting it to 12
  return `${h}:${minutes}`;
};
