"use client";
// React and Next.js imports
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
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

// Redux/API imports
import { useAppDispatch } from "@/lib/store/hooks";
import { useGetVersesChapterQuery } from "@/lib/store/features/versesApi";
import { setSaveMarkRead, setGoToVerse } from "@/lib/store/slices/surah-slice";

// Utility, Data, and Type imports
import { groupVersesByPage } from "@/lib/utils/verse";
import quranData from "@/data/all-quran-surah.json";
import { Verse } from "@/types/verse";
const SurahPage = () => {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const verseQuery = searchParams.get("verse");

  const locale = useLocale();
  const dispatch = useAppDispatch();
  const t = useTranslations("Surah");
  const t2 = useTranslations("SurahPage");
  const [groupedVerses, setGroupedVerses] = useState<Record<string, Verse[]>>(
    {}
  );

  const [activeTab, setActiveTab] = useState("reading");
  const chapterParams = new URLSearchParams({
    fields:
      "text_uthmani,qpc_uthmani_hafs,image_url,image_width,text_uthmani_tajweed,page_number,audio,chapter_id",
    per_page: "all",
    translations: "131,85",
    translation_fields: "resource_name,language_id",
    // words: "true",
    // word_fields:
    //   "location,line_number,line_v2,line_v1,text_qpc_hafs,chapter_id",
  });

  const { data: versesData, isLoading } = useGetVersesChapterQuery(
    {
      params: chapterParams.toString(),
      chapterId: Number(id),
    },
    {
      skip: !id,
      refetchOnMountOrArgChange: true,
    }
  );

  const handleSaveMark = () => {
    dispatch(setSaveMarkRead(true));
    toast.success(t2("marked-saved"));
  };
  const surah = quranData.data[+id - 1];

  useEffect(() => {
    if (versesData) {
      const grouped = groupVersesByPage(versesData.verses);
      // const groupdLinesByPage = groupLinesByPage(versesData.verses);
      // setGroupedLines(groupdLinesByPage);
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
            {isLoading ? (
              <VersesLoadingSkeleton />
            ) : (
              <div
                dir="rtl"
                className="mt-6  text-center rounded-md py-2 px-2 md:px-4 lg:px-6 leading-loose space-y-6 uthmanic-text "
              >
                {surah?.number !== 1 && surah?.number !== 9 && (
                  <div className="text-center grid place-content-center mt-3">
                    <p className="text-7xl mushaf-text">﷽</p>
                  </div>
                )}
                {/* <div className="text-center bg-card p-5">
                  {Object.keys(groupedLines).map((pageNumber) => {
                    const linesOnPage = groupedLines[pageNumber];
                    const versesOnPage = Object.keys(linesOnPage).map(
                      (lineNumber) => {
                        const wordsOnLine = linesOnPage[lineNumber];
                        return (
                          <VerseLine
                            key={`${pageNumber}-${lineNumber}`}
                            line={wordsOnLine}
                          />
                        );
                      }
                    );
                    return (
                      <div className="w-[400px] md:w-[600px]" key={pageNumber}>
                        {versesOnPage}
                        <div className="text-center my-4 border-b">
                          {pageNumber}
                        </div>
                      </div>
                    );
                  })}
                </div> */}
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
            {isLoading ? (
              <VersesLoadingSkeleton />
            ) : (
              <TranslationContent verses={versesData?.verses} surah={surah} />
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Tooltip delayDuration={100}>
        <TooltipTrigger
          onClick={handleSaveMark}
          className="fixed bottom-2 left-4 cursor-pointer grid place-content-center w-8 h-8 rounded-full hover:bg-secondary transition-colors"
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
