import type { EmblaOptionsType } from "embla-carousel";

export const DEFAULT_READER_CAROUSEL_OPTIONS: EmblaOptionsType = {
  loop: false,
  align: "center",
  containScroll: "trimSnaps",
  skipSnaps: false,
  dragFree: false,
};

export const clampReaderCarouselIndex = (
  index: number,
  slideCount: number,
) => {
  if (slideCount <= 0) return 0;

  return Math.min(Math.max(index, 0), slideCount - 1);
};

export const getInitialFetchedReaderSlides = ({
  initialIndex,
  slideCount,
  preloadAdjacentSlides,
}: {
  initialIndex: number;
  slideCount: number;
  preloadAdjacentSlides: boolean;
}) => {
  const slides = new Set<number>([initialIndex]);

  if (!preloadAdjacentSlides || slideCount <= 1) {
    return slides;
  }

  if (initialIndex > 0) slides.add(initialIndex - 1);
  if (initialIndex < slideCount - 1) slides.add(initialIndex + 1);

  return slides;
};
