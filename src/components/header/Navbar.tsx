"use client";
import LanguageSwitcher from "./LanguageSwitcher";
import Search from "./Search";
import SideNav from "./SideNav";
import { Link } from "@/i18n/navigation";
import Setting from "./Setting";

import useScrollDirection from "@/hooks/useScrollDirection";
const Navbar = () => {
  const scrollDirection = useScrollDirection();
  return (
    <header
      className={` ${scrollDirection === "down" ? "-top-24" : "top-0"}
          sticky z-50 w-full border-b bg-white dark:bg-muted
                  transition-all duration-300
  `}
    >
      <div className="main-container flex h-[70px] md:gap-3 items-center justify-between">
        <Link href={"/"} className="min-[370px]:text-lg lg:text-2xl font-bold">
          Sakinah Streams
        </Link>
        <Search />

        <div className="flex items-center gap-2 md:gap-3 ">
          <LanguageSwitcher />
          <SideNav />
          <Setting />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
