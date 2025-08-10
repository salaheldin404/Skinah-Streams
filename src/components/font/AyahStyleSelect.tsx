"use client";
import { setAyahNumberStyle } from "@/lib/store/slices/font-slice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale, useTranslations } from "next-intl";
import { toArabicNumber } from "@/lib/utils/surah";
const AyahStyleSelect = () => {
  const dispatch = useAppDispatch();
  const { ayahNumberStyle } = useAppSelector((state) => state.font);
  const t = useTranslations("Surah");

  const locale = useLocale();

  const styles = new Array(5).fill("ayah").map((_, i) => {
    const styleNumber = locale === "ar" ? toArabicNumber(i + 1) : i + 1;
    return {
      style: `${t("style")}-${styleNumber}`,
      value: `ayah-${i + 1}`,
    };
  });

  const handleChangeStyle = (style: string) => {
    dispatch(setAyahNumberStyle(style));
  };
  return (
    <Select value={ayahNumberStyle} onValueChange={handleChangeStyle}>
      <SelectTrigger className="w-[70%]">
        <SelectValue placeholder="Select a ayah number style" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {styles.map(({ style, value }) => (
            <SelectItem key={style} value={value}>
              {style}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default AyahStyleSelect;
