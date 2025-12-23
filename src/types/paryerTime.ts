export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}
export type PrayerName = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

export type DisplayPrayerTimes = Record<PrayerName, PrayerName>;


export type AladhanApiTimings = DisplayPrayerTimes & {
  Sunrise: string;
  Sunset: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
};
