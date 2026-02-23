"use client";

import { LuMoon, LuSun, LuMonitor } from "react-icons/lu";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

import { useTranslations } from "next-intl";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const t = useTranslations("ModeSwitcher");
  const tSettings = useTranslations("Settings");  
  const themeOptions = [
    { value: "light", icon: LuSun, label: t("light") },
    { value: "dark", icon: LuMoon, label: t("dark") },
    { value: "system", icon: LuMonitor, label: t("system") },
  ] as const;
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {tSettings("theme")}
      </p>
      <div className="flex flex-wrap gap-1">
        {themeOptions.map(({ value, icon: Icon, label }) => (
          <Button
            key={value}
            variant={theme === value ? "default" : "outline"}
            size="sm"
            className="flex-1 gap-1.5 cursor-pointer"
            onClick={() => setTheme(value)}
          >
            <Icon className="h-4 w-4" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
