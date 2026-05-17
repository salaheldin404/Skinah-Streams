import { KhatmaReminderWithUser, ReminderWithUser } from "@/types/notification";
import quranData from "@/data/all-quran-surah.json";
import { prisma } from "@/lib/prisma";
import { messaging } from "@/lib/firebase/admin";

type SendResult = {
  reminderId: string;
  status: "sent" | "skipped" | "failed";
  successCount?: number;
  removedTokens?: number;
  error?: string;
};

const INVALID_TOKEN_CODES = new Set([
  "messaging/invalid-registration-token",
  "messaging/registration-token-not-registered",
]);

async function pruneInvalidTokens(tokens: string[]): Promise<void> {
  if (tokens.length === 0) return;

  await prisma.pushSubscription.deleteMany({
    where: { token: { in: tokens } },
  });
}

export async function sendNotification(
  reminder: ReminderWithUser,
): Promise<SendResult> {
  const tokens = reminder.user.pushSubscriptions.map((sub) => sub.token);
  if (tokens.length === 0) {
    return { reminderId: reminder.id, status: "skipped" };
  }

  const surah = quranData.data[reminder.surahId - 1]; // Assuming surahId is 1-based index
  if (!surah) {
    return {
      reminderId: reminder.id,
      status: "failed",
      error: `Unknown surahId: ${reminder.surahId}`,
    };
  }
  const message = {
    notification: {
      title: "تذكير بقراءة القرآن",
      body: `حان وقت قراءة سورة ${surah.shortName} `,
    },
    data: {
      surahId: reminder.surahId.toString(),
      url: `/surahs/${reminder.surahId}`,
    },
    tokens,
  };
  try {
    const response = await messaging.sendEachForMulticast(message);
    let removedTokensCount = 0;
    if (response.failureCount > 0) {
      const invalidTokens = tokens.filter((_, i) =>
        INVALID_TOKEN_CODES.has(response.responses[i]?.error?.code ?? ""),
      );
      if (invalidTokens.length > 0) {
        await pruneInvalidTokens(invalidTokens);
        removedTokensCount = invalidTokens.length;
      }
    }

    return {
      reminderId: reminder.id,
      status: "sent",
      successCount: response.successCount,
      removedTokens: removedTokensCount,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[reminders] Reminder ${reminder.id} failed:`, message);
    return { reminderId: reminder.id, status: "failed", error: message };
  }
}

export async function sendKhatmaReminderNotification(
  reminder: KhatmaReminderWithUser,
): Promise<SendResult> {
  const tokens = reminder.user.pushSubscriptions.map((sub) => sub.token);
  if (tokens.length === 0) {
    return { reminderId: reminder.id, status: "skipped" };
  }

  const message = {
    notification: {
      title: "تذكير بالختمة",
      body: "حان وقت متابعة وردك اليومي من القرآن الكريم",
    },
    data: {
      url: "/khatma",
    },
    tokens,
  };

  try {
    const response = await messaging.sendEachForMulticast(message);
    console.log(
      `Sent ${response.successCount} Khatma notifications for reminder ${reminder.id}`,
    );
    let removedTokensCount = 0;
    if (response.failureCount > 0) {
      const invalidTokens = tokens.filter((_, i) =>
        INVALID_TOKEN_CODES.has(response.responses[i]?.error?.code ?? ""),
      );
      if (invalidTokens.length > 0) {
        await pruneInvalidTokens(invalidTokens);
        removedTokensCount = invalidTokens.length;
      }
    }

    return {
      reminderId: reminder.id,
      status: "sent",
      successCount: response.successCount,
      removedTokens: removedTokensCount,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      `[khatma-reminders] Reminder ${reminder.id} failed:`,
      message,
    );

    return {
      reminderId: reminder.id,
      status: "failed",
      error: message,
    };
  }
}
