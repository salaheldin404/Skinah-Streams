"use client";
import { useAppSelector } from "@/lib/store/hooks";
import { useMemo } from "react";

type FontSizeKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type FontFamilyKey = "uthmani" | "almushaf" | "almajeed";

type FontClasses = {
  fontSize: string;
  fontFamily: string;
  ayahNumberStyle: string;
};

const fontSizeMap: Record<FontSizeKey, string> = {
  1: "text-lg",
  2: "text-xl",
  3: "text-2xl",
  4: "text-3xl",
  5: "text-4xl",
  6: "text-5xl",
  7: "text-6xl",
  8: "text-7xl",
};

const fontFamilyMap: Record<FontFamilyKey, string> = {
  uthmani: "uthmanic-text",
  almushaf: "mushaf-text",
  almajeed: "almajeed-text",
};

export const useFont = (): FontClasses => {
  const size = useAppSelector((state) => state.font.quranFont.size);
  const style = useAppSelector((state) => state.font.quranFont.style);
  const ayahNumberStyle = useAppSelector((state) => state.font.ayahNumberStyle);

  const fontClasses = useMemo(() => {
    const fontSize = fontSizeMap[size as FontSizeKey] || "text-2xl";
    const fontFamily = fontFamilyMap[style as FontFamilyKey] || "uthmanic-text";

    return { fontSize, fontFamily, ayahNumberStyle };
  }, [size, style, ayahNumberStyle]);

  return fontClasses;
};
