"use client";

import { useEffect, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { LuSearch, LuX } from "react-icons/lu";
import { IoIosArrowBack } from "react-icons/io";

import { useLocale, useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog";
import { useDebounce } from "@uidotdev/usehooks";
import { useClickAway } from "@uidotdev/usehooks";
import { Link, usePathname } from "@/i18n/navigation";
import BodyScrollLocker from "../common/BodyScrollLocker";
import quranData from "@/data/all-quran-surah.json";
import { Surah } from "@/types/surah";

interface SurahSearchResult extends Surah {
  matchType: "name" | "englishName" | "translation" | "number";
}

const NewSearch = () => {
  const t = useTranslations("SearchBar");
  const locale = useLocale();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [value, setValue] = useState("");
  const [isDesktopActive, setIsDesktopActive] = useState(false);
  const debouncedSearchTerm = useDebounce(value, 300);
  const pathname = usePathname();

  const ref = useClickAway<HTMLDivElement>(() => {
    setIsDesktopActive(false);
  });

  // Search logic
  const searchResults = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return [];

    const searchTerm = debouncedSearchTerm.trim().toLowerCase();
    const surahs = quranData.data as Surah[];

    return surahs
      .map((surah) => {
        let matchType: SurahSearchResult["matchType"] | null = null;

        // Search by number
        if (surah.number.toString() === searchTerm) {
          matchType = "number";
        }
        // Search by Arabic name (full or short)
        else if (
          surah.name.toLowerCase().includes(searchTerm) ||
          surah.shortName.toLowerCase().includes(searchTerm)
        ) {
          matchType = "name";
        }
        // Search by English name
        else if (surah.englishName.toLowerCase().includes(searchTerm)) {
          matchType = "englishName";
        }
        // Search by English translation
        else if (
          surah.englishNameTranslation.toLowerCase().includes(searchTerm)
        ) {
          matchType = "translation";
        }

        if (matchType) {
          return { ...surah, matchType } as SurahSearchResult;
        }
        return null;
      })
      .filter((item): item is SurahSearchResult => item !== null)
      .sort((a, b) => {
        // Prioritize exact number matches
        if (a.matchType === "number") return -1;
        if (b.matchType === "number") return 1;
        // Then sort by surah number
        return a.number - b.number;
      })
      .slice(0, 10); // Limit to 10 results
  }, [debouncedSearchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSurahClick = () => {
    // router.push(`/surahs/${surahNumber}`);
    setIsDesktopActive(false);
    setIsMobileOpen(false);
    setValue("");
  };

  const showResults = debouncedSearchTerm.trim().length > 0;

  useEffect(() => {
    setIsMobileOpen(false);
    setIsDesktopActive(false);
    setValue("");
  }, [pathname]);

  return (
    <div className="relative md:w-[50%] lg:w-full max-w-lg font-cairo">
      {isDesktopActive && showResults && <BodyScrollLocker />}

      {/* Desktop Search */}
      <div
        className="relative hidden md:block"
        onFocus={() => setIsDesktopActive(true)}
        ref={ref}
      >
        <LuSearch className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("placeholder")}
          className="w-full pl-10 pr-4 py-2 rounded border focus-visible:ring-0 focus-visible:outline-none"
          value={value}
          onChange={handleChange}
        />
        {isDesktopActive && showResults && (
          <div className="absolute w-full top-full bg-card overflow-y-auto min-h-[300px] max-h-[50vh] border rounded-md shadow-lg mt-1 z-50">
            <SearchResultsContent
              results={searchResults}
              isLoading={false}
              noResultsText={t("no-results")}
              onSurahClick={handleSurahClick}
              locale={locale}
            />
          </div>
        )}
      </div>

      {/* Mobile Search */}
      <div className="md:hidden">
        <Dialog open={isMobileOpen} onOpenChange={setIsMobileOpen}>
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
                className="w-full pl-10 pr-4 py-2 rounded border focus-visible:ring-0 focus-visible:outline-none"
                value={value}
                onChange={handleChange}
              />
            </div>
            {showResults && (
              <div className="h-[60vh] mt-4">
                <SearchResultsContent
                  results={searchResults}
                  isLoading={false}
                  noResultsText={t("no-results")}
                  onSurahClick={handleSurahClick}
                  locale={locale}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

interface SearchResultsContentProps {
  results: SurahSearchResult[];
  isLoading: boolean;
  noResultsText: string;
  onSurahClick: () => void;
  locale: string;
}

const SearchResultsContent = ({
  results,
  isLoading,
  noResultsText,
  onSurahClick,
  locale,
}: SearchResultsContentProps) => {
  const t = useTranslations("Surah");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <LuSearch className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{noResultsText}</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-2">
        {results.map((surah) => (
          <div
            key={surah.number}
            onClick={() => onSurahClick()}
            className="relative flex items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors duration-200 group"
          >
            <Link
              href={`/surahs/${surah.number}`}
              className="absolute inset-0 cursor-pointer"
            />

            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Surah Number */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <span className="text-sm font-semibold">{surah.number}</span>
              </div>

              {/* Surah Names */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3
                    className="font-semibold text-base truncate"
                    dir={locale === "ar" ? "rtl" : "ltr"}
                  >
                    {locale === "ar" ? surah.shortName : surah.englishName}
                  </h3>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground truncate">
                    {locale === "ar"
                      ? surah.englishNameTranslation
                      : surah.shortName}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {surah.numberOfAyahs}{" "}
                    {t(surah.numberOfAyahs === 1 ? "verse" : "verses")}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {t(
                      surah.revelationType.toLowerCase() as
                        | "meccan"
                        | "medinan",
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Arrow Icon */}
            <div
              className={`flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-transform ${
                locale === "ar"
                  ? "group-hover:-translate-x-1"
                  : "group-hover:translate-x-1"
              }`}
            >
              <IoIosArrowBack />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewSearch;
