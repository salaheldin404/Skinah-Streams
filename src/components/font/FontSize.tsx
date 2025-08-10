"use client";
import { useCallback, useMemo } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
  incrementSize,
  decrementSize,
} from "@/lib/store/slices/font-slice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

import { toArabicNumber } from "@/lib/utils/surah";
import { useLocale } from "next-intl";
const FontSize = () => {
  const locale = useLocale();
  const { quranFont } = useAppSelector((state) => state.font);
  const dispatch = useAppDispatch();

  const fontValue = useMemo(() => {
    return locale === "ar" ? toArabicNumber(quranFont.size) : quranFont.size;
  }, [locale, quranFont.size]);

  const handleIncrease = useCallback(() => {
    dispatch(incrementSize());
  }, [dispatch]);

  const handleDecrease = useCallback(() => {
    dispatch(decrementSize());
  }, [dispatch]);

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        className="p-2 cursor-pointer rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-secondary transition-colors"
        onClick={handleDecrease}
      >
        <LuMinus className="w-5 h-5 " />
      </Button>
      <span className="text-lg font-bold">{fontValue}</span>
      <Button
        variant="ghost"
        className="p-2 cursor-pointer rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-secondary transition-colors"
        onClick={handleIncrease}
        disabled={quranFont.size === 8}
      >
        <LuPlus className="w-5 h-5 " />
      </Button>
    </div>
  );
};

export default FontSize;
