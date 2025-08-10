import React from "react";
import { Skeleton } from "../ui/skeleton";

const TafsirSkeleton = () => {
  return (
    <div className="w-full" dir="rtl">
      {/* Skeleton for the top Arabic verse */}
      <div className="pb-6 border-b">
        <Skeleton className="h-8 w-3/4 bg-gray-100 dark:bg-secondary" />
      </div>

      {/* Skeleton for the main tafsir text block */}
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-full rounded-md bg-gray-100 dark:bg-secondary" />
        <Skeleton className="h-5 w-full rounded-md bg-gray-100 dark:bg-secondary" />
        <Skeleton className="h-5 w-5/6 rounded-md bg-gray-100 dark:bg-secondary" />
        <Skeleton className="h-5 w-full rounded-md bg-gray-100 dark:bg-secondary" />
        <Skeleton className="h-5 w-1/2 rounded-md bg-gray-100 dark:bg-secondary" />
      </div>
    </div>
  );
};

export default TafsirSkeleton;
