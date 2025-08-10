import { Skeleton } from "@/components/ui/skeleton";

export function QuickRecentlyPlayedSkeleton() {
  return (
    <div className="surah-card flex items-center group justify-between">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Icon box skeleton */}
        <Skeleton className="w-12 h-12 rounded-lg bg-gray-300 dark:bg-muted" />

        <div className="space-y-1">
          {/* Title skeleton */}
          <Skeleton className="h-5 w-28 bg-gray-300 dark:bg-muted" />
          {/* Subtitle skeleton */}
          <Skeleton className="h-4 w-24 bg-gray-300 dark:bg-muted" />
        </div>
      </div>

      {/* Play button skeleton */}
      <Skeleton className="h-10 w-10 rounded-md bg-gray-300 dark:bg-muted" />
    </div>
  );
}

export default QuickRecentlyPlayedSkeleton;
