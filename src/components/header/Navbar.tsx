import LanguageSwitcher from "./LanguageSwitcher";
import Search from "./Search";
import SideNav from "./SideNav";
import { Link } from "@/i18n/navigation";
import Setting from "./Setting";
const Navbar = () => {
  return (
    <header
      className={` sticky top-0 z-50 w-full border-b bg-white dark:bg-muted `}
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
