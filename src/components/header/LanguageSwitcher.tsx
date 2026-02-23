"use client";
import { Button } from "@/components/ui/button";

import { LuGlobe } from "react-icons/lu";

import { useLocale, useTranslations } from "next-intl";
import { useCallback, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const pathname = usePathname();
  const tSettings = useTranslations("Settings");

  const handleLanguageSwitch = useCallback(() => {
    const nextLocale = locale === "ar" ? "en" : "ar";
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }, [locale, pathname, router, startTransition]);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {tSettings("language")}
      </p>
      <Button
        variant="outline"
        size="sm"
        className="w-full gap-2 cursor-pointer"
        onClick={handleLanguageSwitch}
      >
        <LuGlobe className="h-4 w-4" />
        {locale === "ar" ? "English" : "عربي"}
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
