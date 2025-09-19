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

interface AyahSelectorProps {
  isRtl: boolean;
  selectedSurah: { number: string; ayahCount: number } | null;
  selectedAyah: string;
  handleAyahChange: (value: string) => void;
  ayahOptions: number[];
  t: (key: string) => string;
}

const AyahSelector = memo(
  ({
    isRtl,
    selectedSurah,
    selectedAyah,
    handleAyahChange,
    ayahOptions,
    t,
  }: AyahSelectorProps) => {
    if (!selectedSurah) return null;
    return (
      <div className="flex items-center gap-4">
        <label htmlFor="ayah" className="text-right">
          {t("selectLabels.ayahs")}
        </label>

        <Select
          value={selectedAyah}
          onValueChange={handleAyahChange}
          dir={isRtl ? "rtl" : "ltr"}
        >
          <SelectTrigger className="flex-1" id="ayah">
            <SelectValue placeholder={t("placeholders.selectAyah")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t("selectLabels.ayahs")}</SelectLabel>
              {ayahOptions.map((ayahNumber) => (
                <SelectItem key={ayahNumber} value={ayahNumber.toString()}>
                  {ayahNumber}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  }
);

AyahSelector.displayName = "AyahSelector";

export default AyahSelector;
