"use client";

import { Search } from "@/types/search";
import { memo } from "react";
import { useRouter } from "@/i18n/navigation";
import { ImSpinner2 } from "react-icons/im";

interface SearchContentProps {
  data?: Search;
  className?: string;
  isLoading: boolean;
  noResultsText: string;
  onClose: () => void;
}

const SearchContent = memo(
  ({
    data,
    className,
    isLoading,
    noResultsText,
    onClose,
  }: SearchContentProps) => {
    const router = useRouter();
    const hasResults = data && data.results?.length > 0;

    const handleClickVerse = (versekey: string) => {
      const surahId = versekey.split(":")[0];
      const verseNumber = versekey.split(":")[1];
      router.push(`/surahs/${surahId}?verse=${verseNumber}`);
      onClose();
    };
    return (
      <div
        dir="rtl"
        className={`${className} space-y-3 overflow-y-auto p-4 rounded-md `}
      >
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <ImSpinner2 className="w-6 h-6 animate-spin " />
          </div>
        )}
        {!isLoading && !hasResults && (
          <div className="p-4 text-center text-gray-500">{noResultsText}</div>
        )}
        {!isLoading &&
          hasResults &&
          data.results.map((item) => (
            <div
              key={item.verse_id}
              className="mb-4 text-[20px] hover:bg-secondary rounded-lg p-2 transition-colors leading-normal uthmanic-text flex flex-wrap gap-1 cursor-pointer"
              onClick={() => handleClickVerse(item.verse_key)}
            >
              {item.words.map((word, index) => (
                <span
                  key={index}
                  className={`${
                    word.highlight
                      ? "font-bold text-primary"
                      : "dark:text-white text-gray-600"
                  } `}
                >
                  {word.text}
                </span>
              ))}
            </div>
          ))}
      </div>
    );
  }
);

SearchContent.displayName = "SearchContent";

export default SearchContent;
