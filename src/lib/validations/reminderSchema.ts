import { z } from "zod";

// export const reminderSchema = z.object({
//   surahId: z.number().int().positive().min(1).max(114),
//   time: z
//     .string()
//     .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
//   // Validates an array of integers between 0 (Sunday) and 6 (Saturday)
//   days: z.array(z.number().int().min(0).max(6)).min(1),
//   // Require the client to send their timezone
//   timezone: z.string().min(1),
//   isEnabled: z.boolean().optional().default(true),
// });

export const quranReminderSchema = z.object({
  id: z.string().optional(),
  surahId: z.coerce.number().int().positive(),
  time: z.coerce
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
  days: z.array(z.number().int().min(0).max(6)).min(1),
  isEnabled: z.boolean().default(true),
});

export const khatmaReminderSchema = z.object({
  time: z.coerce
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
  isEnabled: z.boolean().optional().default(true),
});

export const profileReminderSchema = z
  .object({
    timezone: z.string().min(1, "Timezone is required"),
    quranReminders: z.array(quranReminderSchema),
    khatmaReminder: khatmaReminderSchema,
  })
  .superRefine((data, ctx) => {
    const seen = new Set<number>();

    for (const reminder of data.quranReminders) {
      if (seen.has(reminder.surahId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["quranReminders"],
          message: `Duplicate surahId ${reminder.surahId} in Quran reminders`,
        });
      }
      seen.add(reminder.surahId);
    }
  });

// export type ReminderInput = z.infer<typeof reminderSchema>;
export type QuranReminderInput = z.infer<typeof quranReminderSchema>;
export type KhatmaReminderInput = z.infer<typeof khatmaReminderSchema>;
export type ProfileReminderInput = z.infer<typeof profileReminderSchema>;
