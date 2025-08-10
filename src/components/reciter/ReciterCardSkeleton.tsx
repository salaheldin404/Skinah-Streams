import { Skeleton } from "../ui/skeleton";

const ReciterCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center space-y-4 rounded-2xl p-6 shadow-lg bg-gray-100 dark:bg-card">
      <Skeleton className="h-24 w-24 rounded-full bg-gray-300 dark:bg-muted " />
      <div className="space-y-2 w-full">
        <Skeleton className="h-6 w-3/4 mx-auto bg-gray-300 dark:bg-muted " />
        <Skeleton className="h-6 w-20 mx-auto rounded-full bg-gray-300 dark:bg-muted " />
      </div>
    </div>
  );
};

export default ReciterCardSkeleton;
