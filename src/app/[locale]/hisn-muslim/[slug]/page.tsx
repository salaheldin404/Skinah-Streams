"use client";
import { useCallback, useEffect, useMemo } from "react";

import { useParams } from "next/navigation";
import hisnData from "@/data/hisn-muslim.json";
import type { Hisn } from "@/types/hisn-muslim";
import HisnDetailsHeader from "../_components/HisnDetailsHeader";
import { Link } from "@/i18n/navigation";
import AthkarCard from "../_components/AthkarCard";
import useEmblaCarousel from "embla-carousel-react";
import useSelectedSnapDisplay from "@/hooks/useSelectedSnapDisplay";
import useCarouselTween from "@/hooks/useCarouselTween";
import { useAppDispatch } from "@/lib/store/hooks";
import { checkAndResetIfExpired } from "@/lib/store/slices/athkar-slice";

const HisnDetailViewPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const categoryData = (hisnData as Record<string, Hisn>)[slug];
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    direction: "rtl",
  });
  const { selectedSnap, snapCount } = useSelectedSnapDisplay(emblaApi);
  useCarouselTween(emblaApi);

  const goToNextCard = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  const goToFirstCard = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollTo(0);
    }
  }, [emblaApi]);

  useEffect(() => {
    dispatch(checkAndResetIfExpired());
  }, [dispatch]);

  // Memoize carousel content to prevent unnecessary re-renders
  const carouselContent = useMemo(
    () =>
      categoryData?.items.map((item, index) => (
        <AthkarCard
          key={`athkar-${index}`}
          item={item}
          index={index}
          dataCount={categoryData.items.length}
          slug={categoryData.slug}
          goToNextCard={goToNextCard}
        />
      )),
    [categoryData, goToNextCard]
  );
  if (!categoryData) {
    return (
      <div className="py-10 relative">
        <div className=" text-center max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-red-600">خطأ</h1>
          <p className="text-slate-500 mt-2">
            لم يتم العثور على الفئة المطلوبة.
          </p>
          <Link
            href={"/hisn-muslim"}
            className="text-primary hover:underline mt-4 inline-block"
          >
            العودة إلى الرئيسية
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="py-10">
      <div className=" max-w-4xl mx-auto p-6">
        <HisnDetailsHeader
          categoryName={categoryData.categoryName}
          totalCount={categoryData.items.length}
          categorySlug={categoryData.slug}
          goToFirstCard={goToFirstCard}
        />
        <div>
          {selectedSnap + 1} / {snapCount}
        </div>
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex  gap-3 ">{carouselContent}</div>
        </div>
      </div>
    </div>
  );
};

export default HisnDetailViewPage;
