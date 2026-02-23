"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";
import KhatmaPageSlide from "./KhatmaPageSlide";
import { useLocale, useTranslations } from "next-intl";
import { toArabicNumber } from "@/lib/utils/surah";
import { Bookmark, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { setKhatmaBookmark } from "@/lib/store/slices/khatma-slice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { findOwnedPlan, updateKhatma } from "@/server/khatma";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import Setting from "../header/Setting";
import NavButton from "./NavButton";
import DotIndicators from "./DotIndicators";

interface KhatmaReaderCarouselProps {
  start: number;
  end: number;
}



const KhatmaReaderCarousel = ({ start, end }: KhatmaReaderCarouselProps) => {
  const locale = useLocale();
  const t = useTranslations("KhatmaReader");
  const isRTL = locale === "ar";
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [isSavingBookmark, setIsSavingBookmark] = useState(false);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const isInitialScrollDone = useRef(false);

    const { data: session, } = useSession();
   
  const khatmaId = useAppSelector((state) => state.khatma.khatmaId);

  const storeSlideIndex = useAppSelector(
    (state) => state.khatma.khatmaBookmarkIndex,
  );
  const isCurrentBookmark = storeSlideIndex === selectedIndex;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    direction: isRTL ? "rtl" : "ltr",
    align: "center",
    containScroll: "trimSnaps",
    skipSnaps: false,
    dragFree: false,
  });

  const pages = useMemo(
    () => Array.from({ length: end - start + 1 }, (_, i) => start + i),
    [start, end],
  );
  const isLastSlide = selectedIndex == pages.length - 1;

  const params = useMemo(
    () =>
      new URLSearchParams({
        fields:
          "qpc_uthmani_hafs,page_number,juz_number,hizb_number,verse_key,verse_number,chapter_id,audio",
        per_page: "50",
      }).toString(),
    [],
  );

  
  // Track fetched slides so we never un-fetch them
  const [fetchedSlides, setFetchedSlides] = useState<Set<number>>(
    () => new Set([0]),
  );
  useEffect(() => {
    
    setFetchedSlides((prev) => {
      const next = new Set(prev);
      next.add(selectedIndex);
      // Preload previous and next slides
      if (selectedIndex > 0) next.add(selectedIndex - 1);
      if (selectedIndex < pages.length - 1) next.add(selectedIndex + 1);

      // Only return new Set if size changed to prevent unnecessary re-renders
      return next.size === prev.size ? prev : next;
    });
  }, [selectedIndex, pages.length]);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || isInitialScrollDone.current) return;

    if (storeSlideIndex > 0) {
      emblaApi?.scrollTo(storeSlideIndex, true);
    }
    isInitialScrollDone.current = true;
  }, [storeSlideIndex, emblaApi]);

  const handleVisualLeft = useCallback(() => {
    if (isRTL) emblaApi?.scrollNext();
    else emblaApi?.scrollPrev();
  }, [emblaApi, isRTL]);

  const handleVisualRight = useCallback(() => {
    if (isRTL) emblaApi?.scrollPrev();
    else emblaApi?.scrollNext();
  }, [emblaApi, isRTL]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  const handleCompleteReading = async () => {
    const userId = session?.user?.id;
    if (!userId) {
      toast.error(t("noActiveKhatma"));
      return;
    }
    setIsUpdatingProgress(true);

    const khatmaPlan = await findOwnedPlan(khatmaId!, userId);
    if (!khatmaPlan) {
      toast.error(t("noActiveKhatma"));
      return;
    }
    const newCompletedPages = Math.min(
      khatmaPlan.totalPages,
      khatmaPlan.completedPages + khatmaPlan.pagesPerDay,
    );
    const newCurrentPage = Math.min(
      khatmaPlan.totalPages,
      khatmaPlan.currentPage + khatmaPlan.pagesPerDay,
    );
    const result = await updateKhatma(khatmaPlan.id, {
      completedPages: newCompletedPages,
      currentPage: newCurrentPage,
      isCompleted: newCompletedPages >= khatmaPlan.totalPages,
      bookMarkIndex: null,
    });
    if (result.status === 200) {
      toast.success(t("progressUpdated"));
      router.push("/khatma");
    } else {
      toast.error(result.message);
      setIsUpdatingProgress(false);
    }
  };

  // UX ENHANCEMENT: Keyboard Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleVisualRight();
      if (e.key === "ArrowLeft") handleVisualLeft();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleVisualRight, handleVisualLeft]);

  const handleBookmark = useCallback(async () => {
    if (!khatmaId) {
      toast.error(t("noActiveKhatma"));
      return;
    }
    dispatch(setKhatmaBookmark(selectedIndex));
    setIsSavingBookmark(true);
    const result = await updateKhatma(khatmaId, {
      bookMarkIndex: selectedIndex,
    });
    if (result.status == 200) {
      toast.success(t("bookmarkSaved"));
    } else {
      toast.error(result.message);
    }
    setIsSavingBookmark(false);
  }, [selectedIndex, dispatch, khatmaId, t]);

  const currentPage = pages[selectedIndex] ?? start;
  const pageLabel = isRTL ? toArabicNumber(currentPage) : String(currentPage);
  const totalLabel = isRTL
    ? toArabicNumber(pages.length)
    : String(pages.length);
  const indexLabel = isRTL
    ? toArabicNumber(selectedIndex + 1)
    : String(selectedIndex + 1);

  // Derived button states based on visual direction
  const canClickVisualLeft = isRTL ? canScrollNext : canScrollPrev;
  const canClickVisualRight = isRTL ? canScrollPrev : canScrollNext;

  if (isUpdatingProgress) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-8rem)] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{t("updatingProgress")}</p>
      </div>
    )
  }
  return (

    <div className="flex flex-col h-[calc(100dvh-8rem)] max-h-[900px]">
      {/* Top bar with page info */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 bg-card/80 backdrop-blur-sm shrink-0 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold font-cairo">
            <span>{indexLabel}</span>
            <span className="text-primary/50">/</span>
            <span>{totalLabel}</span>
          </div>
          <Setting/>
        </div>

        <div className="flex gap-2 items-center">
          <span className="text-sm font-cairo font-medium text-foreground/80">
            {isRTL ? `صفحة ${pageLabel}` : `Page ${pageLabel}`}
          </span>
          <button
            onClick={handleBookmark}
            disabled={isSavingBookmark || isCurrentBookmark}
            className={`cursor-pointer p-2 rounded-md transition-colors disabled:opacity-70 ${
              isCurrentBookmark
                ? "bg-primary/10 dark:bg-primary/20 text-primary "
                : "hover:bg-secondary text-slate-400"
            }`}
            aria-label={t("saveBookmark")}
          >
            {isSavingBookmark ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Bookmark
                className={`w-5 h-5 ${isCurrentBookmark ? "fill-current" : ""}`}
              />
            )}
          </button>
        </div>

        {/* Desktop navigation arrows */}
        <div className="hidden md:flex items-center gap-1.5">
          <NavButton
            onClick={handleVisualRight}
            disabled={!canClickVisualRight}
            direction="prev"
          />
          <NavButton
            onClick={handleVisualLeft}
            disabled={!canClickVisualLeft}
            direction="next"
          />
        </div>

        {/* Mobile: small arrows */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={handleVisualRight}
            disabled={!canClickVisualRight}
            className="p-1.5 rounded-lg text-muted-foreground disabled:opacity-20 active:scale-90 transition-all"
            aria-label="Previous"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleVisualLeft}
            disabled={!canClickVisualLeft}
            className="p-1.5 rounded-lg text-muted-foreground disabled:opacity-20 active:scale-90 transition-all"
            aria-label="Next"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Embla Carousel */}
      <div className="flex-1 min-h-0 relative ">
        {/* Desktop side arrows (floating) */}
        {/* <div className="hidden md:flex absolute inset-y-0 -left-14 items-center z-10">
          <NavButton
            onClick={handleVisualLeft}
            disabled={!canClickVisualLeft}
            direction="next"
          />
        </div>
        <div className="hidden md:flex absolute inset-y-0 -right-14 items-center z-10">
          <NavButton
            onClick={handleVisualRight}
            disabled={!canClickVisualRight}
            direction="prev"
          />
        </div> */}

        <div
          className="khatma-carousel overflow-hidden h-full "
          ref={emblaRef}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="khatma-carousel__container flex gap-2 h-full">
            {pages.map((pageNumber, index) => (
              <div
                key={pageNumber}
                className="khatma-carousel__slide flex-[0_0_100%]  min-w-0 h-full"
              >
                <div className="h-full  border border-border/30 bg-card shadow-sm overflow-hidden">
                  <KhatmaPageSlide
                    pageNumber={pageNumber}
                    shouldFetch={fetchedSlides.has(index)}
                    params={params}
                    onVerseHighlighted={() => scrollTo(index)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom controls — dots + swipe hint */}
      <div className="flex flex-col items-center gap-2 px-4 py-3 border-t border-border/40 bg-card/80 backdrop-blur-sm shrink-0 rounded-b-xl">
        {isLastSlide ? (
          <Button
            onClick={handleCompleteReading}
            className="cursor-pointer w-full md:w-auto px-8 py-2.5 bg-primary text-primary-foreground rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
          >
            {isUpdatingProgress ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              t("markTodayComplete")
            )}
          </Button>
        ) : (
          <DotIndicators
            total={pages.length}
            selected={selectedIndex}
            onSelect={scrollTo}
          />
        )}

        {/* Mobile swipe hint (only shown briefly) */}
        <p className="text-[10px] text-muted-foreground/50 font-cairo md:hidden select-none">
          {isRTL ? "اسحب للتنقل بين الصفحات" : "Swipe to navigate pages"}
        </p>
      </div>
    </div>
  );
};

export default KhatmaReaderCarousel;
