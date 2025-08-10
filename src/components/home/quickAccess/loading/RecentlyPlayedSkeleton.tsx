import { Skeleton } from "@/components/ui/skeleton";

const RecentlyPlayedSkeleton = () => (
  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="surah-card flex items-center justify-between group"
      >
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Play button skeleton */}
          <Skeleton className="h-10 w-10 rounded-md  bg-gray-300 dark:bg-muted " />

          <div>
            {/* Surah title skeleton */}
            <Skeleton className="h-5 w-28 mb-1 bg-gray-300 dark:bg-muted " />
            {/* Verses count skeleton */}
            <Skeleton className="h-4 w-20 bg-gray-300 dark:bg-muted " />
          </div>
        </div>

        {/* Revelation type skeleton */}
        <Skeleton className="h-4 w-16 bg-gray-300 dark:bg-muted " />
      </div>
    ))}
  </div>
);

export default RecentlyPlayedSkeleton;
