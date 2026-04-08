"use client";

import { useEffect, useState, useCallback } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firebase/config";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";

export const useNotifications = () => {
  const { data: session } = useSession();
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const router = useRouter();
  const registerToken = useCallback(
    async (fcmToken: string) => {
      if (!session) return;

      try {
        await fetch("/api/notifications/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: fcmToken,
            userAgent: navigator.userAgent,
          }),
        });
      } catch (error) {
        console.error("Error registering token with backend:", error);
      }
    },
    [session],
  );

  const requestPermission = useCallback(async () => {
    if (!messaging) return;

    try {
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);

      if (permissionResult === "granted") {
        const currentToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (currentToken) {
          setToken(currentToken);
          await registerToken(currentToken);
        }
      }
    } catch (error) {
      console.error("An error occurred while requesting permission ", error);
    }
  }, [registerToken]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPermission(Notification.permission);
    }

    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground message received:", payload);
        const link = payload.data?.url;
        if (link) {
          // Handle foreground message (e.g., show a toast)
          toast.info(payload.notification?.title || "New Notification", {
            description: payload.notification?.body,
            action: {
              label: "أذهب",
              onClick: () => {
                router.push(link);
              },
            },
          });
        } else {
          toast.info(payload.notification?.title || "New Notification", {
            description: payload.notification?.body,
          });
        }
      });

      return () => unsubscribe();
    }
  }, [router]);

  useEffect(() => {
    const currentMessaging = messaging;

    if (!currentMessaging || permission !== "granted" || token || !session) {
      return;
    }

    let isMounted = true;

    const syncGrantedPermissionToken = async () => {
      try {
        const currentToken = await getToken(currentMessaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (!currentToken) {
          return;
        }

        if (isMounted) {
          setToken(currentToken);
        }
        await registerToken(currentToken);
      } catch (error) {
        console.error("Error syncing notification token:", error);
      }
    };

    syncGrantedPermissionToken();

    return () => {
      isMounted = false;
    };
  }, [permission, registerToken, session, token]);

  return { token, permission, requestPermission };
};
