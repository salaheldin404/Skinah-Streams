import { memo } from "react";
import { Skeleton } from "../ui/skeleton";

const PageSkeleton = memo(() => (
  <div className="flex flex-col h-full px-4 sm:px-6 pt-4 pb-4 gap-3 animate-pulse">
    {/* header bar */}
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-20 bg-gray-300/50 dark:bg-muted rounded-md" />
      <Skeleton className="h-4 w-12 bg-gray-300/50 dark:bg-muted rounded-md" />
    </div>

    {/* Surah header skeleton */}
    <div className="my-2 rounded-lg border border-primary/10 p-3">
      <Skeleton className="h-6 w-32 mx-auto bg-gray-300/50 dark:bg-muted rounded-md" />
    </div>

    {/* verse lines */}
    {Array.from({ length: 8 }).map((_, i) => (
      <Skeleton
        key={i}
        className={`h-7 bg-gray-300/50 dark:bg-muted rounded-md ${
          i % 3 === 2 ? "w-4/5" : i % 4 === 0 ? "w-11/12" : "w-full"
        }`}
      />
    ))}

    {/* Bottom spacer */}
    <div className="mt-auto" />
  </div>
));

PageSkeleton.displayName = "PageSkeleton";

export default PageSkeleton;