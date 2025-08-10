"use client";
import { memo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Surah } from "@/types/surah";
import { useLocale } from "next-intl";
import { toArabicNumber } from "@/lib/utils/surah";
interface SurahAyahSelectorsProps {
  surahs: Surah[];
  selectedSurah: string;
  onSelectSurah: (value: string) => void;
  ayahCount: number;
  selectedAyah: number;
  onSelectAyah: (value: string) => void;
}

const SurahAyahSelectors = memo(
  ({
    surahs,
    selectedSurah,
    onSelectSurah,
    ayahCount,
    selectedAyah,
    onSelectAyah,
  }: SurahAyahSelectorsProps) => {
    const locale = useLocale();
    const direction = locale === "ar" ? "rtl" : "ltr";

    return (
      <div className="flex flex-col sm:flex-row items-center gap-3 my-4">
        <Select
          dir={direction}
          value={selectedSurah}
          onValueChange={onSelectSurah}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select a Surah" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {surahs.map((surah) => (
                <SelectItem key={surah.number} value={surah.number.toString()}>
                  <span>
                    {locale === "ar"
                      ? toArabicNumber(surah.number)
                      : surah.number}
                  </span>
                  <span>
                    {locale === "ar" ? surah.shortName : surah.englishName}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          dir={direction}
          value={selectedAyah.toString()}
          onValueChange={onSelectAyah}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select an Ayah" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Array.from({ length: ayahCount }, (_, index) => (
                <SelectItem key={index + 1} value={(index + 1).toString()}>
                  {locale === "ar" ? toArabicNumber(index + 1) : index + 1}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  }
);

SurahAyahSelectors.displayName = "SurahAyahSelectors";

export default SurahAyahSelectors;
