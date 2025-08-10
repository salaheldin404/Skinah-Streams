"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { TafsirData } from "@/types/tafsir";
import { useLocale } from "next-intl";
import { Skeleton } from "../ui/skeleton";

interface TafsirCarouselProps {
  arabicTafsirs: TafsirData[];
  onSelectTafsir: (id: number) => void;
  selectedTafsirId: number;
  isTafsirsLoading: boolean;
}

const TafsirCarousel = ({
  arabicTafsirs,
  onSelectTafsir,
  selectedTafsirId,
  isTafsirsLoading,
}: TafsirCarouselProps) => {
  const locale = useLocale();
  const direction = locale === "ar" ? "rtl" : "ltr";
  if (isTafsirsLoading) {
    return (
      <div className="px-6 py-4">
        <div className="flex items-center space-x-4 overflow-hidden">
          {/* Create an array of 5 skeleton items to represent loading */}
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-16 w-40 rounded-lg bg-secondary"
            />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="px-6 py-4 relative">
      <Carousel
        opts={{
          direction: direction,
          align: "start",
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {arabicTafsirs.map((tafsir) => {
            const isSelected = tafsir.id === selectedTafsirId;
            return (
              <CarouselItem key={tafsir.id} className="basis-auto">
                <div className="p-1 h-full">
                  <div
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    onClick={() => onSelectTafsir(tafsir.id)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && onSelectTafsir(tafsir.id)
                    }
                    className={`
                       w-full h-full text-center bg-secondary cursor-pointer p-4 rounded-lg border-2 
                    transition-colors duration-200 ease-in-out
                    flex items-center justify-center
                    ${
                      isSelected
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground/50"
                    }
                    
                  `}
                  >
                    {tafsir.translated_name.name}
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default TafsirCarousel;
