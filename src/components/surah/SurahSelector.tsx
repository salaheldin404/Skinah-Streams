import { memo } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Surah } from "@/types/surah";

interface SurahSelectorProps{
  isRtl: boolean;
  surahs: Surah[];
  selectedSurah: { number: string; ayahCount: number } | null;
  handleSurahChange: (value: string) => void;
  t: (key: string) => string;
}

const SurahSelector = memo(({isRtl,surahs,selectedSurah,handleSurahChange,t}:SurahSelectorProps) => {
  return (
    <div className="flex items-center gap-4">
      <label htmlFor="surah" className="text-right">
        {t("labels.surah")}
      </label>
      <Select
        dir={isRtl ? "rtl" : "ltr"}
        onValueChange={handleSurahChange}
        value={
          selectedSurah
            ? `${selectedSurah.number}-${selectedSurah.ayahCount}`
            : undefined
        }
      >
        <SelectTrigger className="flex-1" id="surah">
          <SelectValue placeholder={t("placeholders.selectSurah")} />
        </SelectTrigger>
        <SelectContent
          className={`${isRtl ? "!text-right" : "text-left"} tajwal-text`}
        >
          <SelectGroup>
            <SelectLabel>{t("selectLabels.surahs")}</SelectLabel>
            {/* Map through surah data */}
            {surahs.map((surah) => (
              <SelectItem
                key={surah.number}
                value={`${surah.number}-${surah.numberOfAyahs}`}
              >
                {surah.number}.{isRtl ? surah.shortName : surah.englishName}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
})

SurahSelector.displayName = "SurahSelector";

export default SurahSelector
