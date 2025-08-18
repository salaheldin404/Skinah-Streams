"use client";
// React and Next.js imports
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

// Third-party library imports
import { toast } from "sonner";
import { LuBookOpen, LuFileText, LuBookmark } from "react-icons/lu";

// UI Component imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SurahInfo from "@/components/surah/SurahInfo";
import VersesLoadingSkeleton from "@/components/verse/VersesLoadingSkeleton";
import ReadingContent from "@/components/surah/ReadingContent";
import TranslationContent from "@/components/surah/TranslationContent";
import SurahNavigationButton from "@/components/surah/SurahNavigationButton";

// Redux/API imports
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useGetVersesChapterQuery } from "@/lib/store/features/versesApi";
import { setSaveMarkRead, setGoToVerse } from "@/lib/store/slices/surah-slice";

// Utility, Data, and Type imports
import { groupVersesByPage } from "@/lib/utils/verse";
import quranData from "@/data/all-quran-surah.json";
import { Verse } from "@/types/verse";
import SurahTopBar from "@/components/surah/SurahTopBar";
const SurahPage = () => {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const verseQuery = searchParams.get("verse");
  const currentVerseLocation = useAppSelector(
    (state) => state.surah.currentVerseLocation
  );

  const locale = useLocale();
  const dispatch = useAppDispatch();
  const t = useTranslations("Surah");
  const t2 = useTranslations("SurahPage");
  const [groupedVerses, setGroupedVerses] = useState<Record<string, Verse[]>>(
    {}
  );
  const numericId = Number(id);

  const [activeTab, setActiveTab] = useState("reading");

  const chapterParams = useMemo(() => {
    const params = new URLSearchParams({
      fields:
        "text_uthmani,qpc_uthmani_hafs,text_uthmani_tajweed,page_number,audio,chapter_id",
      per_page: "all",
      translations: "131,85",
      translation_fields: "resource_name,language_id",
    });
    return params.toString();
  }, []);

  const { data: versesData, isFetching } = useGetVersesChapterQuery(
    {
      params: chapterParams.toString(),
      chapterId: numericId,
    },
    {
      skip: !id,
      refetchOnMountOrArgChange: true,
    }
  );

  const handleSaveMark = () => {
    dispatch(setSaveMarkRead(true));
    dispatch(setGoToVerse(null));
    toast.success(t2("marked-saved"));
  };

  const handleNextSurah = useCallback(() => {
    if (numericId < 114) {
      router.push(`/surahs/${numericId + 1}`);
    }
  }, [numericId, router]);

  const handlePreviousSurah = useCallback(() => {
    if (numericId > 1) {
      router.push(`/surahs/${numericId - 1}`);
    }
  }, [numericId, router]);

  const surah = useMemo(() => quranData.data[+id - 1], [id]);

  // Memoize navigation states
  const navigationState = useMemo(
    () => ({
      isPreviousDisabled: numericId === 1,
      isNextDisabled: numericId === 114,
    }),
    [numericId]
  );

  // Memoize bismillah condition
  const showBismillah = useMemo(
    () => surah?.number !== 1 && surah?.number !== 9,
    [surah?.number]
  );

  useEffect(() => {
    if (versesData) {
      const grouped = groupVersesByPage(versesData.verses);

      setGroupedVerses(grouped);
    }
  }, [versesData]);

  useEffect(() => {
    if (verseQuery) {
      dispatch(setGoToVerse(`${id}:${verseQuery}`));
    } else {
      dispatch(setGoToVerse(null));
    }
  }, [verseQuery, dispatch, id]);

  if (!surah) {
    return (
      <div className="text-center py-10 space-y-3">
        <h3 className="text-2xl font-bold">{t2("not-found")}</h3>
        <p className="text-gray-500">{t2("not-found-description")}</p>
      </div>
    );
  }
  return (
    <div className="py-10 relative">
      <SurahTopBar surah={surah} currentVerseLocation={currentVerseLocation} />
      <div className="max-w-4xl mx-auto p-6 pb-32">
        <SurahInfo surah={surah} locale={locale} t={t} t2={t2} />
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full my-4"
        >
          <TabsList className="grid w-full grid-cols-2 h-auto rounded-0">
            <TabsTrigger
              value="reading"
              className="flex items-center gap-2 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-white py-3"
            >
              <LuFileText className="h-4 w-4" />
              {t2("reading")}
            </TabsTrigger>
            <TabsTrigger
              value="translation"
              className="flex items-center gap-2 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-white py-3"
            >
              <LuBookOpen className="h-4 w-4" />
              {t2("translation")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reading">
            {isFetching ? (
              <VersesLoadingSkeleton />
            ) : (
              <div
                dir="rtl"
                className="mt-6  text-center rounded-md py-2  leading-loose space-y-6 uthmanic-text "
              >
                {showBismillah && (
                  <div className="text-center grid place-content-center mt-3">
                    <p className="text-7xl mushaf-text">﷽</p>
                  </div>
                )}

                {Object.keys(groupedVerses).map((pageNumber) => {
                  const versesOnPage = groupedVerses[pageNumber];
                  return (
                    <ReadingContent
                      key={pageNumber}
                      pageNumber={pageNumber}
                      verses={versesOnPage}
                      locale={locale}
                      surah={surah}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="translation">
            {isFetching ? (
              <VersesLoadingSkeleton />
            ) : (
              <TranslationContent verses={versesData?.verses} surah={surah} />
            )}
          </TabsContent>
        </Tabs>

        {!isFetching && (
          <SurahNavigationButton
            onNextSurah={handleNextSurah}
            onPreviousSurah={handlePreviousSurah}
            isPreviousDisabled={navigationState.isPreviousDisabled}
            isNextDisabled={navigationState.isNextDisabled}
          />
        )}
      </div>
      <Tooltip delayDuration={100}>
        <TooltipTrigger
          onClick={handleSaveMark}
          className="fixed bottom-4 left-4 cursor-pointer grid place-content-center w-8 h-8 rounded-full hover:bg-secondary transition-colors"
        >
          <LuBookmark />
        </TooltipTrigger>
        <TooltipContent>
          <p>{t2("save-mark")}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default SurahPage;
