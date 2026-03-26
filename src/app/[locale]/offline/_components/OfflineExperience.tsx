"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Home, RadioTower, RefreshCw, WifiOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";


export default function OfflineExperience() {
  const t = useTranslations("Offline");
  const locale = useLocale() 
  const [isOnline, setIsOnline] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);

    updateStatus();
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      router.push("/");
    }
  }, [isOnline, router]);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = `/${locale}`;
  };
  
  const tips = t.raw("tips") as string[];
  const cardItems = t.raw("cardItems") as string[];

  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.22),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#ede9fe_45%,_#f8fafc_100%)] px-4 py-10 dark:bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.18),_transparent_32%),linear-gradient(180deg,_#09090b_0%,_#111827_48%,_#09090b_100%)] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-14 top-16 h-44 w-44 rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-500/15" />
        <div className="absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/4 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/10" />
        <div className="absolute bottom-12 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-300/10" />
      </div>

      <section className="relative mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_24px_80px_rgba(76,29,149,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/65 dark:shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-700 dark:border-violet-400/20 dark:bg-violet-500/15 dark:text-violet-200">
            <WifiOff className="size-4" />
            {t("badge")}
          </div>

          <div className="mt-6 max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-lg">
              {t("description")}
            </p>
          </div>

          <div
            className={cn(
              "mt-6 inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium",
              isOnline
                ? "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                : "border-zinc-200 bg-white/70 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300",
            )}
          >
            <RadioTower className="size-4" />
            {isOnline ? t("statusOnline") : t("statusOffline")}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 rounded-2xl px-6 shadow-lg shadow-violet-500/20 cursor-pointer"
              onClick={handleRetry}
            >
              <RefreshCw className="size-4" />
              {t("primaryAction")}
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-2xl border-white/70 bg-white/70 px-6 dark:border-zinc-800 dark:bg-zinc-900/70"
            >
              <Link href={`/${locale}`}>
                <Home className="size-4" />
                {t("secondaryAction")}
              </Link>
            </Button>

            <Button
              size="lg"
              variant="ghost"
              className="h-12 rounded-2xl px-6 cursor-pointer"
              onClick={handleBack}
            >
              <ArrowLeft
                className={cn("size-4", locale === "ar" && "rotate-180")}
              />
              {t("tertiaryAction")}
            </Button>
          </div>
        </div>

        <aside className="grid gap-6">
          <div className="rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/65 dark:shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700/80 dark:text-violet-200/80">
              {t("tipsTitle")}
            </p>
            <div className="mt-5 space-y-3">
              {tips.map((tip, index) => (
                <div
                  key={tip}
                  className="rounded-2xl border border-zinc-200/80 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
                >
                  <div className="mb-2 inline-flex size-7 items-center justify-center rounded-full bg-violet-500 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-violet-200/70 bg-gradient-to-br from-violet-600 via-violet-500 to-fuchsia-500 p-6 text-white shadow-[0_24px_80px_rgba(124,58,237,0.35)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
              {t("cardTitle")}
            </p>
            <div className="mt-6 grid gap-3">
              {cardItems.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm"
                >
                  <p className="text-sm font-medium text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
