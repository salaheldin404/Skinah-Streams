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
import { toast } from "sonner";

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
      (reciterItem: ReciterWishlist) =>
        reciterItem.reciter_id === reciter?.id &&
        reciterItem.mushaf_id === selectedMoshaf?.id,
    );
  }, [reciters, reciter?.id, selectedMoshaf?.id]);

  const isSurahInWishlist = useMemo(() => {
    return surahs.some(
      (surahItem: Surah) =>
        surahItem.number === surah?.number &&
        surahItem.mushafId === surah?.mushafId,
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
        toast.success(t("added-to-wishlist"));
      } else {
        dispatch(
          removeReciterFromWishlist({
            reciterId: reciterWishlist.reciter_id,
            mushafId: reciterWishlist.mushaf_id as number,
          }),
        );

        toast.success(t("removed-from-wishlist"));
      }
    }
  }, [dispatch, reciter, selectedMoshaf, reciterImage, isReciterInWishlist, t]);

  const handleToggleAddSurahToWishlist = useCallback(() => {
    if (
      surah &&
      surah.reciterId &&
      surah.reciterName &&
      surah.mushafId &&
      surah.mushafName
    ) {
      if (!isSurahInWishlist) {
        dispatch(addSurahToWishlist(surah));
        toast.success(t("added-to-wishlist"));
      } else {
        dispatch(
          removeSurahFromWishlist({
            surahId: surah.number,
            mushafId: surah.mushafId,
            reciterId: surah.reciterId,
          }),
        );
        toast.success(t("removed-from-wishlist"));
      }
    }
  }, [dispatch, surah, isSurahInWishlist, t]);

  return {
    isReciterInWishlist,
    isSurahInWishlist,
    handleToggleAddReciterToWishlist,
    handleToggleAddSurahToWishlist,
    reciterText,
    surahText,
  };
};
