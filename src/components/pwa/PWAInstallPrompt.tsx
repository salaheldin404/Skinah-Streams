"use client";

import { useEffect, useState } from "react";
import { Download, Share2, Smartphone, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";


type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISS_KEY = "sakinah-install-prompt-dismissed";


function isIosDevice() {
  if (typeof window === "undefined") {
    return false;
  }

  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isStandaloneDisplayMode() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

export default function PWAInstallPrompt() {
  const t = useTranslations("Pwa");
  // State
  const [isMounted, setIsMounted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

useEffect(() => {
  // Safely initialize client-side variables after mount
  setIsMounted(true);
  setIsIos(isIosDevice());
  setInstalled(isStandaloneDisplayMode());
  setDismissed(localStorage.getItem(DISMISS_KEY) === "true");

  const handleBeforeInstallPrompt = (event: Event) => {
    event.preventDefault();
    setDeferredPrompt(event as BeforeInstallPromptEvent);
  };

  const handleInstalled = () => {
    setInstalled(true);
    setDeferredPrompt(null);
    localStorage.removeItem(DISMISS_KEY);
  };

  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.addEventListener("appinstalled", handleInstalled);

  return () => {
    window.removeEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt,
    );
    window.removeEventListener("appinstalled", handleInstalled);
  };
}, []);


  const hidePrompt = () => {
    localStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      localStorage.removeItem(DISMISS_KEY);
      setInstalled(true);
    } else {
      hidePrompt();
    }

    setDeferredPrompt(null);
  };
const showIosManualPrompt = isIos && !deferredPrompt;
const canShow =
  isMounted && !installed && !dismissed && (Boolean(deferredPrompt) || isIos);
  if (!canShow) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 px-4 sm:bottom-6 sm:px-6">
      <section className="pointer-events-auto mx-auto max-w-xl overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/85 shadow-[0_30px_90px_rgba(124,58,237,0.22)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/80 dark:shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
        <div className="relative p-5 sm:p-6">
          <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.18),_transparent_70%)] dark:bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.22),_transparent_70%)]" />

          <Button
            aria-label={t("closeLabel")}
            className="cursor-pointer absolute end-4 top-4 inline-flex size-9 items-center justify-center rounded-full border border-zinc-200/70 bg-white/70 text-zinc-600 transition hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300"
            onClick={hidePrompt}
          >
            <X className="size-4" />
          </Button>

          <div className="relative flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30">
              {showIosManualPrompt ? (
                <Share2 className="size-6" />
              ) : (
                <Smartphone className="size-6" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="inline-flex rounded-full border border-violet-200/80 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-200">
                {t("badge")}
              </div>

              <h2 className="mt-3 text-xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                {showIosManualPrompt ? t("iosTitle") : t("title")}
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                {showIosManualPrompt
                  ? t("iosDescription")
                  : t("description")}
              </p>

              {showIosManualPrompt ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                    1. {t("iosStepOne")}
                  </div>
                  <div className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                    2. {t("iosStepTwo")}
                  </div>
                </div>
              ) : (
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button
                    className="cursor-pointer h-11 rounded-2xl px-5 shadow-lg shadow-violet-500/20"
                    onClick={handleInstall}
                  >
                    <Download className="size-4" />
                    {t("install")}
                  </Button>
                  <Button
                    variant="outline"
                    className={cn(
                      " cursor-pointer h-11 rounded-2xl border-white/70 bg-white/70 px-5 dark:border-zinc-800 dark:bg-zinc-900/70",
                    )}
                    onClick={hidePrompt}
                  >
                    {t("dismiss")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
