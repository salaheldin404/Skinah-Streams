"use client";
import { ModeToggle } from "./mode-toggle";

// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet" // For mobile menu
import LanguageSwitcher from "./LanguageSwitcher";
import Search from "./Search";
import SideNav from "./SideNav";
import { Link } from "@/i18n/navigation";
import Setting from "./Setting";
const Navbar = () => {
  // const { isPlaying } = useAppSelector((state) => state.audio);
  return (
    <header
      className={` sticky top-0 z-50 w-full h-[70px] border-b bg-white dark:bg-muted `}
    >
      <div className="main-container">
        <nav className="flex justify-between items-center gap-3 h-16">
          <div className="flex items-center gap-3 ">
            <LanguageSwitcher />
            <ModeToggle />
            <SideNav />
            <Setting />
          </div>
          <Search />
          <div>
            <Link
              href={"/"}
              className="min-[370px]:text-lg lg:text-2xl font-bold"
            >
              Sakinah Streams
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
