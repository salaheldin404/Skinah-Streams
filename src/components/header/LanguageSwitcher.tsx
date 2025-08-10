"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LuGlobe } from "react-icons/lu";

import { useLocale } from "next-intl";
import { useCallback, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
const LANGUAGES = [
  { code: "en", labelKey: "English" },
  { code: "ar", labelKey: "عربي" },
] as const;

const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const onSelect = useCallback(
    (lang: (typeof LANGUAGES)[number]["code"]) => {
      startTransition(() => {
        router.replace(pathname, { locale: lang });
      });
    },
    [pathname, router, startTransition]
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button variant="outline" size="icon">
          <LuGlobe className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map(({ code, labelKey }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => onSelect(code)}
            disabled={code === locale}
            className={`cursor-pointer`}
          >
            {labelKey}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
