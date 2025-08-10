import SurahCard from "@/components/surah/SurahCard";
import SurahGridSkeleton from "./SurahGridSkeleton";
import { Surah } from "@/types/surah";

interface SurahContentProps {
  surahs: Surah[];
  surahText: string;
  isClient?: boolean;
}

const SurahContent = ({ surahs, surahText, isClient }: SurahContentProps) => {
  if (!isClient) return <SurahGridSkeleton />;
  if (surahs?.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold">{surahText}</h3>
      </div>
    );
  }
  return (
    <div className="grid min-[370px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {surahs?.map((surah) => (
        <SurahCard
          surah={surah}
          key={`surah-${surah.number}-${surah.mushafId}`}
          isWishlistShow={true}
        />
      ))}
    </div>
  );
};

export default SurahContent;
