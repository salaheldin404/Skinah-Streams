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

const Setting = () => {
  const locale = useLocale();
  const t = useTranslations("Settings");
  return (
    <Sheet>
      <SheetTrigger asChild className="cursor-pointer">
        <LuSettings size={20} />
      </SheetTrigger>
      <SheetContent
        className={`py-7 px-4`}
        side={locale === "en" ? "left" : "right"}
        aria-describedby={undefined}
      >
        <SheetHeader className="flex flex-row justify-between items-center gap-3 mb-3 border-b">
          <SheetTitle>{t("title")}</SheetTitle>

          <SheetClose
            className={`block cursor-pointer top-3  text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors`}
          >
            <LuX size={30} />
          </SheetClose>
        </SheetHeader>

        <div>
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
