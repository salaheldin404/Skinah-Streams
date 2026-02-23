"use client";

import { useEffect, useRef } from "react";
import { useAppSelector } from "@/lib/store/hooks";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { SyncStatus } from "@/types/settings";
import {
  Cloud,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";

/**
 * SyncStatusToast component monitors sync state changes
 * and displays toast notifications for sync events
 */
export function SyncStatusToast() {
  const { status, error, pendingChanges } = useAppSelector(
    (state) => state.sync,
  );
  const t = useTranslations("sync");
  const previousStatus = useRef<SyncStatus>("idle");
  const syncingToastId = useRef<string | number | null>(null);

  useEffect(() => {
    // Only show toasts for meaningful state transitions
    if (status === previousStatus.current) return;

    const prev = previousStatus.current;
    previousStatus.current = status;

    // Don't show toast on initial mount or when going from idle to pending
    if (prev === "idle" && status === "pending") {
      return;
    }

    // Show syncing toast (loading state)
    if (status === "syncing") {
      syncingToastId.current = toast.loading(t("syncing"), {
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        description: pendingChanges > 0 
          ? t("pending", { count: pendingChanges })
          : undefined,
      });
      return;
    }

    // Dismiss the syncing toast if it exists
    if (syncingToastId.current !== null) {
      toast.dismiss(syncingToastId.current);
      syncingToastId.current = null;
    }

    // Show success toast
    if (status === "synced" && prev === "syncing") {
      toast.success(t("synced"), {
        icon: <Check className="h-4 w-4" />,
        duration: 2000,
      });
      return;
    }

    // Show error toast
    if (status === "error") {
      toast.error(t("error"), {
        icon: <AlertCircle className="h-4 w-4" />,
        description: error || t("errorOccurred"),
        duration: 4000,
      });
      return;
    }

    // Show pending notification (subtle)
    if (status === "pending" && prev !== "idle") {
      toast.info(t("pending", { count: pendingChanges }), {
        icon: <Cloud className="h-4 w-4" />,
        duration: 1500,
      });
    }
  }, [status, error, pendingChanges, t]);

  return null; // This component only manages toast notifications
}
