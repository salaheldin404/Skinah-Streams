import { z } from "zod";
import {
  MAX_NOTES_LENGTH,
  MAX_PAGES_PER_DAY,
  MAX_TITLE_LENGTH,
  MIN_PAGES_PER_DAY,
  MIN_TITLE_LENGTH,
} from "@/lib/constants/khatma";

type Translator = (key: string) => string;

/** Regex that rejects basic HTML/script characters */
const SAFE_TEXT = /^[^<>&]*$/;

export const getKhatmaSchema = (t: Translator) =>
  z.object({
    title: z
      .string()
      .min(MIN_TITLE_LENGTH, t("titleShort"))
      .max(MAX_TITLE_LENGTH, t("titleLong"))
      .trim()
      .regex(SAFE_TEXT, t("invalidChars"))
      .optional()
      .or(z.literal("")),
    pagesPerDay: z
      .number({ message: t("pagesPerDayInvalid") })
      .int()
      .min(MIN_PAGES_PER_DAY, t("minPages"))
      .max(MAX_PAGES_PER_DAY, t("maxPages")),
    notes: z
      .string()
      .max(MAX_NOTES_LENGTH, t("notesLong"))
      .trim()
      .regex(SAFE_TEXT, t("invalidChars"))
      .optional()
      .or(z.literal("")),
  });

export type KhatmaInput = z.infer<ReturnType<typeof getKhatmaSchema>>;
