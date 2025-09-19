"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import quranData from "@/data/all-quran-surah.json";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import AyahSelector from "./AyahSelector";
import SurahSelector from "./SurahSelector";

const QuickAccessNavigation = () => {
  const locale = useLocale();
  const t = useTranslations("QuickAccessNavigation");
  const surahs = quranData.data;
  const [selectedSurah, setSelectedSurah] = useState<{
    number: string;
    ayahCount: number;
  } | null>(null);
  const [selectedAyah, setSelectedAyah] = useState("1");
  const router = useRouter();
  // Memoize direction calculation
  const isRtl = useMemo(() => locale === "ar", [locale]);

  const handleSurahChange = useCallback((value: string) => {
    const [number, ayahCount] = value.split("-");
    setSelectedSurah({
      number,
      ayahCount: parseInt(ayahCount, 10),
    });
    setSelectedAyah("1"); // Reset to first ayah when surah changes
  }, []);
  const handleAyahChange = useCallback((value: string) => {
    setSelectedAyah(value);
  }, []);
  const ayahOptions = useMemo(() => {
    if (!selectedSurah) return [];

    return Array.from({ length: selectedSurah.ayahCount }, (_, i) => i + 1);
  }, [selectedSurah]);

  const handleNavigation = useCallback(() => {
    if (selectedSurah && selectedAyah) {
      setSelectedSurah(null);
      router.push(`/surahs/${selectedSurah.number}?verse=${selectedAyah}`);
    }
  }, [selectedSurah, selectedAyah, router]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer px-1 md:px-2 text-sm"
          variant={"secondary"}
        >
          {t("triggerButton")}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`sm:max-w-lg ${isRtl ? "!text-right" : "text-left"}`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader className={`${isRtl ? "!text-right" : "text-left"} `}>
          <DialogTitle> {t("triggerButton")}</DialogTitle>
          <DialogDescription>{t("dialogDescription")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <SurahSelector
            handleSurahChange={handleSurahChange}
            isRtl={isRtl}
            selectedSurah={selectedSurah}
            surahs={surahs}
            t={t}
          />

          <AyahSelector
            ayahOptions={ayahOptions}
            handleAyahChange={handleAyahChange}
            isRtl={isRtl}
            selectedAyah={selectedAyah}
            selectedSurah={selectedSurah}
            t={t}
          />
        </div>
        <DialogFooter className="flex w-full !flex-row justify-between items-center gap-3">
          <DialogClose asChild>
            <Button
              className="flex-1 cursor-pointer"
              disabled={!selectedSurah || !selectedAyah}
              onClick={handleNavigation}
            >
              {t("buttons.go")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button className="flex-1 cursor-pointer" variant="outline">
              {t("buttons.cancel")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickAccessNavigation;
