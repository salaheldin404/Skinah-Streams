"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLocale, useTranslations } from "next-intl";
import { LuSettings, LuX } from "react-icons/lu";
import FontControl from "../font/FontControl";
import { ModeToggle } from "./mode-toggle";
import LanguageSwitcher from "./LanguageSwitcher";

const Setting = () => {
  const locale = useLocale();
  const t = useTranslations("Settings");
  return (
    <Sheet>
      <SheetTrigger asChild className="cursor-pointer">
        <LuSettings size={20} />
      </SheetTrigger>
      <SheetContent
        className={`py-2  overflow-y-auto`}
        side={locale === "en" ? "left" : "right"}
        aria-describedby={undefined}
      >
        <SheetHeader className="flex flex-row py-2 px-4 justify-between items-center gap-3 mb-3 border-b">
          <SheetTitle>{t("title")}</SheetTitle>

          <SheetClose
            className={`block cursor-pointer top-3  text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors`}
          >
            <LuX size={30} />
          </SheetClose>
        </SheetHeader>

        <div className="space-y-4">
          <div className="space-y-4  px-4 border-b pb-3">
            <h2 className="text-lg font-bold">{t("theme")}</h2>
            <ModeToggle />
          </div>
          <div className="space-y-4  px-4 border-b pb-3">
            <h2 className="text-lg font-bold">{t("language")}</h2>
            <LanguageSwitcher />
          </div>
          <FontControl />
        </div>
        {/* <SheetClose
          asChild
          className={`absolute cursor-pointer top-3 ${
            locale === "en" ? "right-3" : "left-3"
          } text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors`}
        >
          <LuX size={30} />
        </SheetClose> */}
      </SheetContent>
    </Sheet>
  );
};

export default Setting;
