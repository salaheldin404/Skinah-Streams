"use client";

import { useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationPermissionRequest() {
  const { requestPermission } = useNotifications();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      Notification.permission === "default"
    ) {
      requestPermission();
    }
  }, [requestPermission]);

  return null;
}
