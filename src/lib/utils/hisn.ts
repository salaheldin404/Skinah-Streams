import {
  FaSun,
  FaMoon,
  FaMosque,
  FaBed,
  FaClock,
  FaBook,
  FaBookOpen,
} from "react-icons/fa";
import { FaHandsPraying } from "react-icons/fa6";
import { PiHandsPrayingBold } from "react-icons/pi";

import { IconType } from "react-icons/lib";
import { AthkarSlug } from "../store/slices/athkar-slice";

interface Unit {
  singular: string;
  dual: string;
  plural: string;
}

export const hisnCategoryIconMap: Record<AthkarSlug | "default", IconType> = {
  "morning-athkar": FaSun,
  "evening-athkar": FaMoon,
  "post-prayer-athkar": FaMosque,
  tasabih: FaHandsPraying,
  "sleep-athkar": FaBed,
  "waking-up-athkar": FaClock,
  "quranic-duas": FaBook,
  "prophets-duas": PiHandsPrayingBold,
  default: FaBookOpen,
};

export const hisnUnitMap: Record<AthkarSlug, Unit> = {
  "morning-athkar": { singular: "ذكر", dual: "ذكران", plural: "أذكار" },
  "evening-athkar": { singular: "ذكر", dual: "ذكران", plural: "أذكار" },
  "post-prayer-athkar": { singular: "ذكر", dual: "ذكران", plural: "أذكار" },
  tasabih: { singular: "تسبيح", dual: "تسبيحتان", plural: "تسابيح" },
  "sleep-athkar": { singular: "ذكر", dual: "ذكران", plural: "أذكار" },
  "waking-up-athkar": { singular: "ذكر", dual: "ذكران", plural: "أذكار" },
  "quranic-duas": { singular: "دعاء", dual: "دعاءان", plural: "أدعية" },
  "prophets-duas": { singular: "دعاء", dual: "دعاءان", plural: "أدعية" },
};

export const getItemCountText = (count: number, units: Unit): string => {
  if (count === 1) return `1 ${units.singular}`;
  if (count === 2) return `2 ${units.dual}`;
  if (count >= 3 && count <= 10) return `${count} ${units.plural}`;
  return `${count} ${units.singular}`;
};

export const getNextExpirationDate = (): string => {
  const tomorrow = new Date();
  // Move the date to the next day
  tomorrow.setDate(tomorrow.getDate() + 1);
  // Set the time to midnight (the very beginning of that day)
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
};

export const isAthkarExpired = (expirationDate: string): boolean => {
  return new Date() > new Date(expirationDate);
};
