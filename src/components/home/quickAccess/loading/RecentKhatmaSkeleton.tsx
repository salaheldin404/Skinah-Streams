import { Skeleton } from "@/components/ui/skeleton";

function RecentKhatmaSkeleton() {
  return (
    <div className="surah-card relative flex items-start gap-3">
      {/* Icon box skeleton */}
      <Skeleton className="w-12 h-12 rounded-lg bg-gray-300 dark:bg-muted shrink-0" />

      <div className="flex-1 space-y-2">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32 bg-gray-300 dark:bg-muted" />
          <Skeleton className="h-4 w-12 rounded-full bg-gray-300 dark:bg-muted" />
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-20 bg-gray-300 dark:bg-muted" />
            <Skeleton className="h-3 w-8 bg-gray-300 dark:bg-muted" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full bg-gray-300 dark:bg-muted" />
        </div>

        {/* Range info */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-28 bg-gray-300 dark:bg-muted" />
          <Skeleton className="h-3 w-16 bg-gray-300 dark:bg-muted" />
        </div>
      </div>

      {/* Arrow */}
      <Skeleton className="h-4 w-4 rounded-sm self-center bg-gray-300 dark:bg-muted" />
    </div>
  );
}

export default RecentKhatmaSkeleton;
