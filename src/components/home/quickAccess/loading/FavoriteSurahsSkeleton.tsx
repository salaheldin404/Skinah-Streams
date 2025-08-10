import { Skeleton } from "@/components/ui/skeleton";

function FavoriteSurahsSkeleton() {
  return (
    <div className="surah-card group relative">
      {/* Invisible link layer would normally be here */}
      <div className="flex items-center gap-3">
        {/* Icon box skeleton */}
        <Skeleton className="w-12 h-12 rounded-lg bg-gray-300 dark:bg-muted " />

        <div>
          {/* Title skeleton */}
          <Skeleton className="h-5 w-32 mb-1 bg-gray-300 dark:bg-muted " />
          {/* Subtitle skeleton */}
          <Skeleton className="h-4 w-20 bg-gray-300 dark:bg-muted " />
        </div>
      </div>
    </div>
  );
}

export default FavoriteSurahsSkeleton;
