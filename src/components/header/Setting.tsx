"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocale, useTranslations } from "next-intl";
import { LuSettings, LuX } from "react-icons/lu";
import FontControl from "../font/FontControl";

const Setting = () => {
  const locale = useLocale();
  const t = useTranslations("Settings");
  return (
    <Sheet>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <button
                className="group relative inline-flex h-9 w-9 items-center justify-center rounded-full
                  bg-muted/60 text-muted-foreground
                  transition-all duration-300 ease-in-out
                  hover:bg-primary/10 hover:text-primary hover:shadow-md
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2
                  active:scale-95 cursor-pointer"
                aria-label={t("title")}
              >
                <LuSettings
                  size={18}
                  className="transition-transform duration-500 ease-in-out group-hover:rotate-90"
                />
              </button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{t("title")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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

        {/* <div className="space-y-4">
          <div className="space-y-4  px-4 border-b pb-3">
            <h2 className="text-lg font-bold">{t("theme")}</h2>
            <ModeToggle />
          </div>
          <div className="space-y-4  px-4 border-b pb-3">
            <h2 className="text-lg font-bold">{t("language")}</h2>
            <LanguageSwitcher />
          </div>
        </div> */}
        <FontControl />
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
