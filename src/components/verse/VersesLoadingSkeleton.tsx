import { memo } from "react";
import { Skeleton } from "../ui/skeleton";

const VersesLoadingSkeleton = memo(() => (
  <div className=" rounded-md py-1 px-6 space-y-2">
    {[...Array(6)].map((_, i) => (
      <Skeleton key={i} className="h-10 w-full bg-gray-300 dark:bg-muted" />
    ))}
  </div>
));

VersesLoadingSkeleton.displayName = "VersesLoadingSkeleton";

export default VersesLoadingSkeleton;
