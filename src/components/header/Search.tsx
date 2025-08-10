"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input"; // Assuming you have an input component from shadcn/ui
import { LuSearch, LuX } from "react-icons/lu";
import { useLocale, useTranslations } from "next-intl";
import { useSearchQuery } from "@/lib/store/features/searchApi";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog";
import { useDebounce } from "@uidotdev/usehooks";

import SearchContent from "@/components/common/SearchContent";
import { useClickAway } from "@uidotdev/usehooks";
import { usePathname } from "@/i18n/navigation";

const Search = () => {
  const t = useTranslations("SearchBar");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [activeSearch, setActiveSearch] = useState(false);
  const debouncedSearchTerm = useDebounce(value, 300);
  const pathname = usePathname();
  const ref = useClickAway<HTMLDivElement>(() => {
    setActiveSearch(false);
  });

  const { data, isFetching } = useSearchQuery(
    {
      params: `q=${debouncedSearchTerm}&per_page=10`,
    },
    {
      skip: !debouncedSearchTerm.trim().length,
      refetchOnMountOrArgChange: true,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setActiveSearch(true);
    } else {
      setActiveSearch(false);
    }
  };
  const showResults = debouncedSearchTerm.trim().length > 0;

  useEffect(() => {
    setIsOpen(false);
    setActiveSearch(false);
  }, [pathname]);
  return (
    <div className={`relative md:w-full max-w-lg font-cairo`}>
      <div
        className="relative hidden md:block"
        onFocus={() => setActiveSearch(true)}
        ref={ref}
      >
        <LuSearch className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("placeholder")}
          className=" w-full pl-10 pr-4 py-2 rounded border focus-visible:ring-0  focus-visible:outline-none"
          value={value}
          onChange={handleChange}
        />
        {activeSearch && showResults && (
          <SearchContent
            data={data}
            className="absolute w-full top-full bg-card min-h-[300px] max-h-[50vh] "
            isLoading={isFetching}
            noResultsText={t("no-results")}
          />
        )}
      </div>
      <div className="md:hidden">
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild className="cursor-pointer">
            <LuSearch />
          </DialogTrigger>
          <DialogContent
            className="min-h-[50vh] block"
            aria-describedby={undefined}
          >
            <DialogClose
              className={`cursor-pointer absolute top-4 ${
                locale === "en" ? "right-2" : "left-2"
              }`}
            >
              <LuX />
            </DialogClose>

            <DialogTitle className="mb-5">{t("label")}</DialogTitle>
            <div className="relative">
              <LuSearch className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder={t("placeholder")}
                className={` w-full pl-10 pr-4 py-2 rounded border focus-visible:ring-0  focus-visible:outline-none `}
                value={value}
                onChange={handleChange}
              />
            </div>
            {showResults && (
              <SearchContent
                data={data}
                className="h-[60vh]"
                isLoading={isFetching}
                noResultsText={t("no-results")}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Search;
