"use client";
import { useParams } from "next/navigation";
import {
  useGetAllRectitationsDataQuery,
  useGetAllRadiosQuery,
} from "@/lib/store/features/quranApi";
import { useLocale, useTranslations } from "next-intl";

import Image from "next/image";
import { getReciterImage, getReciterRadio } from "@/lib/utils/reciters";
import { useTheme } from "next-themes";
import {
  DARK_DEFAULT_RECITER_IMAGE,
  LIGHT_DEFAULT_RECITER_IMAGE,
} from "@/constatnts/images";
import SearchInput from "@/components/common/SearchInput";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import SurahCard from "@/components/surah/SurahCard";

import quranData from "@/data/all-quran-surah.json";
import { normalizeArabic } from "@/lib/utils/index";
import { useDebounce } from "@uidotdev/usehooks";

import { Skeleton } from "@/components/ui/skeleton";
import {
  setRadio,
  setOpenRadioPlayer,
  setRadioPlaying,
} from "@/lib/store/slices/audio-slice";
import { Surah } from "@/types/surah";
import SurahPlayButton from "@/components/surah/SurahPlayButton";

import WishlistButton from "@/components/WishlistButton";
import { useWishlist } from "@/hooks/useWishlist";

const ReciterPage = () => {
  const { id } = useParams();
  const locale = useLocale();
  const dispatch = useAppDispatch();

  const t = useTranslations("ReciterPage");
  const { isRadioPlaying, radioName, isRadioPlayerOpen } = useAppSelector(
    (state) => state.audio
  );

  const { resolvedTheme } = useTheme();
  const { data, isLoading, isError } = useGetAllRectitationsDataQuery({
    language: locale,
    reciterId: Number(id),
  });
  const { data: radiosData } = useGetAllRadiosQuery({
    language: locale,
  });
  const reciter = useMemo(
    () => (data && data.length > 0 ? data[0] : null),
    [data]
  );

  const reciterRadio = useMemo(
    () => getReciterRadio(reciter?.name || "", radiosData?.radios || []),
    [reciter?.name, radiosData?.radios]
  );

  const [selectMoshafId, setSelectMoshafId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 200);
  const isDark = resolvedTheme === "dark";
  const defaultImage = isDark
    ? LIGHT_DEFAULT_RECITER_IMAGE
    : DARK_DEFAULT_RECITER_IMAGE;
  const imageUrl = getReciterImage(reciter?.name || "", defaultImage);

  const selectedMoshaf = useMemo(() => {
    if (!reciter?.moshaf?.length || !selectMoshafId) return null;
    return (
      reciter.moshaf.find(
        (moshaf) => moshaf.id.toString() === selectMoshafId
      ) ?? null
    );
  }, [reciter?.moshaf, selectMoshafId]);
  const { handleToggleAddReciterToWishlist, isReciterInWishlist, reciterText } =
    useWishlist({
      reciter: reciter || undefined,
      selectedMoshaf: selectedMoshaf || undefined,
      reciterImage: imageUrl,
    });

  const surahMap = useMemo(() => {
    return new Map(quranData.data.map((surah) => [surah.number, surah]));
  }, []);

  const isCurrentRadio = useMemo(() => {
    return reciterRadio?.name === radioName;
  }, [reciterRadio?.name, radioName]);

  const handleSelectChange = (value: string) => {
    setSelectMoshafId(value);
  };
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );
  const handlePlayRadio = () => {
    if (!isCurrentRadio && reciterRadio) {
      dispatch(setRadio(reciterRadio));
    } else {
      dispatch(setRadioPlaying(!isRadioPlaying));
    }
    if (!isRadioPlayerOpen) {
      dispatch(setOpenRadioPlayer(true));
    }
  };

  const filteredSurahs: Surah[] = useMemo(() => {
    if (!selectedMoshaf?.surah_list) {
      return []; // Return a stable empty array
    }

    const surahIds = selectedMoshaf.surah_list.split(",").map(Number);

    // Use reduce for a single, efficient pass to build the enriched surah list
    const allSurahs = surahIds.reduce<Surah[]>((accumulator, id) => {
      const surah = surahMap.get(id);
      // Only process if a valid surah is found
      if (surah) {
        const surahNum = id.toString().padStart(3, "0");
        accumulator.push({
          ...surah,
          serverLink: `${selectedMoshaf.server}/${surahNum}.mp3`,
          reciterName: reciter?.name,
          reciterId: reciter?.id,
          mushafName: selectedMoshaf.name,
          mushafId: selectedMoshaf.id,
        });
      }
      return accumulator;
    }, []);

    // Apply search filter if the query is not empty
    const query = debouncedSearchQuery.toLowerCase().trim();
    if (!query) {
      return allSurahs;
    }

    return allSurahs.filter(
      (surah) =>
        normalizeArabic(surah.name).toLowerCase().includes(query) ||
        surah.englishName.toLowerCase().includes(query) ||
        surah.number.toString().includes(query)
    );
  }, [
    surahMap,
    debouncedSearchQuery,
    selectedMoshaf,
    reciter?.name,
    reciter?.id,
  ]);

  useEffect(() => {
    if (reciter?.moshaf?.length && !selectMoshafId) {
      setSelectMoshafId(reciter.moshaf[0].id.toString());
    }
  }, [reciter?.moshaf, selectMoshafId]);

  if (isLoading) {
    return (
      <div className="main-container py-10">
        <div className=" space-y-4">
          <Skeleton className="h-32 w-32 rounded-full bg-gray-300 dark:bg-muted " />
          <Skeleton className="h-8 bg-gray-300 dark:bg-muted rounded w-48" />
        </div>
      </div>
    );
  }

  if (isError || !reciter) {
    return <div className="main-container py-10">{t("error")}</div>;
  }
  return (
    <div className="pt-10 pb-20">
      <div className="main-container">
        {/* Reciter Header */}
        <header className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <Image
              src={imageUrl}
              alt={reciter.name}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover shadow-lg border-4 border-white/50 dark:border-gray-700/50 "
              width={128}
              height={128}
              priority
            />
          </div>
          <div className="space-y-2 md:space-y-3">
            <h1 className="max-[380]:text-lg text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {reciter.name}
            </h1>

            <div className="flex items-center gap-3">
              <SurahPlayButton
                isPlaying={isRadioPlaying}
                currentSurah={isCurrentRadio}
                handleTogglePlay={handlePlayRadio}
                className="!w-auto"
              >
                {t("radio")}
              </SurahPlayButton>

              <WishlistButton
                handleToggle={handleToggleAddReciterToWishlist}
                isItemInWishlist={isReciterInWishlist}
                textContent={reciterText}
              />
            </div>
          </div>
        </header>
        <div className="flex flex-col sm:flex-row gap-3 my-3">
          <div className="flex-1">
            <SearchInput
              placeholder={t("search-input")}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          {reciter.moshaf?.length > 1 && (
            <Select
              onValueChange={handleSelectChange}
              value={selectMoshafId || ""}
            >
              <SelectTrigger className="w-full sm:w-[200px] bg-white dark:bg-card">
                <SelectValue placeholder={t("select")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {reciter.moshaf.map((moshaf) => (
                    <SelectItem key={moshaf.id} value={moshaf.id.toString()}>
                      {moshaf.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>

        {filteredSurahs && filteredSurahs.length > 0 ? (
          <div className="grid min-[370px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredSurahs.map((surah) => (
              <SurahCard
                key={`${surah?.number}-${selectMoshafId}`}
                surah={surah}
                isWishlistShow={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold">{t("no-surahs")}</h3>
            <p className="text-gray-500">{t("no-surahs-description")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReciterPage;
