"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

import {
  addSurahToWishlist,
  removeSurahFromWishlist,
  addReciterToWishlist,
  removeReciterFromWishlist,
} from "@/lib/store/slices/wishlist-slice";
import { Moshaf, Reciter } from "@/types/reciter";
import { Surah } from "@/types/surah";
import { ReciterWishlist } from "@/types/wishlist";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";

interface WishlistProps {
  reciter?: Reciter;
  selectedMoshaf?: Moshaf;
  surah?: Surah;
  reciterImage?: string;
}

export const useWishlist = ({
  reciter,
  selectedMoshaf,
  surah,
  reciterImage,
}: WishlistProps) => {
  const { reciters, surahs } = useAppSelector((state) => state.wishlist);
  const dispatch = useAppDispatch();
  const t = useTranslations("Wishlist");

  const isReciterInWishlist = useMemo(() => {
    return reciters.some(
      (reciterItem) =>
        reciterItem.reciter_id === reciter?.id &&
        reciterItem.mushaf_id === selectedMoshaf?.id
    );
  }, [reciters, reciter?.id, selectedMoshaf?.id]);

  const isSurahInWishlist = useMemo(() => {
    return surahs.some(
      (surahItem) =>
        surahItem.number === surah?.number &&
        surahItem.mushafId === surah?.mushafId
    );
  }, [surahs, surah]);

  const surahText = useMemo(() => {
    return isSurahInWishlist ? t("remove-from-wishlist") : t("add-to-wishlist");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSurahInWishlist]);

  const reciterText = useMemo(() => {
    return isReciterInWishlist
      ? t("remove-from-wishlist")
      : t("add-to-wishlist");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReciterInWishlist]);

  const handleToggleAddReciterToWishlist = useCallback(() => {
    if (reciter && selectedMoshaf) {
      const reciterWishlist: ReciterWishlist = {
        reciter_id: reciter.id,
        reciter_name: reciter.name,
        reciter_image: reciterImage || "",
        mushaf_id: selectedMoshaf.id,
        mushaf_name: selectedMoshaf.name,
      };

      if (!isReciterInWishlist) {
        dispatch(addReciterToWishlist(reciterWishlist));
      } else {
        dispatch(
          removeReciterFromWishlist({
            reciterId: reciterWishlist.reciter_id,
            mushafId: reciterWishlist.mushaf_id,
          })
        );
      }
    }
  }, [dispatch, reciter, selectedMoshaf, reciterImage, isReciterInWishlist]);

  const handleToggleAddSurahToWishlist = useCallback(() => {
    if (
      surah &&
      surah.reciterId &&
      surah.reciterName &&
      surah.mushafId &&
      surah.mushafName
    ) {
      // const surahWishlist: SurahWishlist = {
      //   surah_id: surah.number,
      //   surah_name: surah.name,
      //   mushaf_id: surah.mushafId,
      //   mushaf_name: surah.mushafName,
      //   reciter_id: surah.reciterId,
      //   reciter_name: surah.reciterName,
      // };

      if (!isSurahInWishlist) {
        dispatch(addSurahToWishlist(surah));
      } else {
        dispatch(
          removeSurahFromWishlist({
            surahId: surah.number,
            mushafId: surah.mushafId,
            reciterId: surah.reciterId,
          })
        );
      }
    }
  }, [dispatch, surah, isSurahInWishlist]);

  return {
    isReciterInWishlist,
    isSurahInWishlist,
    handleToggleAddReciterToWishlist,
    handleToggleAddSurahToWishlist,
    reciterText,
    surahText,
  };
};
