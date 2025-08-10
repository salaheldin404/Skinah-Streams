"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLocale, useTranslations } from "next-intl";
import { FaBars } from "react-icons/fa";

import { LuX } from "react-icons/lu";
import { IoHome } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { Link, usePathname } from "@/i18n/navigation";
import { FaRadio } from "react-icons/fa6";
import { GiSoundWaves } from "react-icons/gi";
import { useEffect, useState } from "react";

const LINKS = [
  {
    title: "home",
    href: "/",
    icon: IoHome,
  },
  {
    title: "favorites",
    href: "/favorites",
    icon: FaHeart,
  },
  {
    title: "reciters",
    href: "/reciters",
    icon: GiSoundWaves,
  },
  {
    title: "radio",
    href: "/radios",
    icon: FaRadio,
  },
];

const SideNav = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("SideNav");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="cursor-pointer">
        <FaBars size={20} />
      </SheetTrigger>
      <SheetContent
        className={` py-7 px-4`}
        side={locale === "en" ? "left" : "right"}
        aria-describedby={undefined}
      >
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
        </SheetHeader>
        <ul className="space-y-2">
          {LINKS.map(({ title, href, icon: Icon }) => (
            <li key={title} className="w-full">
              <Link
                href={href}
                className="flex items-center gap-3 py-3 px-4 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-card"
              >
                <Icon />
                {t(title)}
              </Link>
            </li>
          ))}
        </ul>

        <SheetClose
          asChild
          className={`absolute cursor-pointer top-3 ${
            locale === "en" ? "right-3" : "left-3"
          } text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors`}
        >
          <LuX size={30} />
        </SheetClose>
        <SheetFooter className="text-center">
          <Link href="https://www.linkedin.com/in/salah-eldin-ahmed-389471221/">
            Built with ❤️ by Salah Eldin
          </Link>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SideNav;
