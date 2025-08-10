import FeaturedSurahs from "@/components/home/FeaturedSurahs";
import QuickAccess from "@/components/home/quickAccess/index";
import RecentlyPlayed from "@/components/home/RecentlyPlayed";
import Reciters from "@/components/home/Reciters";

export default function Home() {
  return (
    <div className="bg-ground ">
      <main className="">
        {/* quick access */}
        <QuickAccess />

        {/* Featured Surahs */}
        <FeaturedSurahs />
        <Reciters />
        <RecentlyPlayed />
      </main>
    </div>
  );
}
