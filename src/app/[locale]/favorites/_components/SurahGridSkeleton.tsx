import { Skeleton } from "@/components/ui/skeleton";

export function SurahGridSkeleton() {
  return (
    <div className="grid min-[370px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div className="surah-card group relative" key={i}>
          {/* Top cover block */}
          <Skeleton className="w-full h-32 rounded-lg mb-4  bg-gray-300 dark:bg-muted" />

          {/* Title + Verses + Reciter */}
          <div className="space-y-3 flex items-center justify-between gap-2">
            <div className="space-y-2">
              {/* Short name / English name */}
              <Skeleton className="h-5 w-28  bg-gray-300 dark:bg-muted" />
              {/* Verses count */}
              <Skeleton className="h-4 w-20  bg-gray-300 dark:bg-muted" />
            </div>

            {/* Reciter name */}
            <Skeleton className="h-4 w-16  bg-gray-300 dark:bg-muted" />
          </div>

          {/* Bottom row: badge + buttons */}
          <div className="flex items-center justify-between mt-4">
            {/* Badge placeholder */}
            <Skeleton className="h-6 w-20 rounded-md  bg-gray-300 dark:bg-muted" />

            {/* Play + Wishlist buttons */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-md  bg-gray-300 dark:bg-muted" />
              <Skeleton className="h-10 w-10 rounded-full  bg-gray-300 dark:bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SurahGridSkeleton;
