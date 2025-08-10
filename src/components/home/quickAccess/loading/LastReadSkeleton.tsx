import { Skeleton } from "@/components/ui/skeleton";

function LastReadSkeleton() {
  return (
    <div className="surah-card relative flex items-center justify-between">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Icon box skeleton */}
        <Skeleton className="w-12 h-12 rounded-lg  bg-gray-300 dark:bg-muted " />

        <div className="space-y-1">
          {/* Title skeleton */}
          <Skeleton className="h-5 w-28  bg-gray-300 dark:bg-muted " />
          {/* Surah name + verse key skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20  bg-gray-300 dark:bg-muted " />
            <Skeleton className="h-4 w-12  bg-gray-300 dark:bg-muted " />
          </div>
        </div>
      </div>

      {/* Bookmark icon skeleton */}
      <Skeleton className="h-4 w-4 rounded-sm bg-gray-300 dark:bg-muted " />
    </div>
  );
}

export default LastReadSkeleton;
