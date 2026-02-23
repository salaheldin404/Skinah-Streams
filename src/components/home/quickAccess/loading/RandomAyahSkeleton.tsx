import { Skeleton } from "@/components/ui/skeleton";

export default function RandomAyahSkeleton() {
  return (
    <section className="py-10">
      <div className="main-container">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white/10 dark:bg-white/[0.04] backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/20 p-8">
          {/* ── decorative orbs (kept for visual consistency) ── */}
          {/* <div
            aria-hidden
            className="pointer-events-none bg-primary absolute -top-20 -left-20 h-64 w-64 rounded-full opacity-30 blur-[100px]"
          />
          <div
            aria-hidden
            className="pointer-events-none bg-primary absolute -bottom-20 -right-20 h-72 w-72 rounded-full opacity-25 blur-[120px]"
          /> */}

          {/* ── header row ── */}
          <div className="relative z-10 flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full bg-gray-300 dark:bg-muted" />
              <Skeleton className="h-6 w-32 bg-gray-300 dark:bg-muted" />
            </div>

            {/* "New Ayah" button skeleton */}
            <Skeleton className="h-9 w-10 sm:w-28 rounded-full bg-gray-300 dark:bg-muted" />
          </div>

          {/* ── ayah content ── */}
          <div className="relative z-10">
            {/* arabic text skeleton (right-aligned for RTL) */}
            <div className="flex flex-col items-end gap-3 mb-6">
              <Skeleton className="h-10 md:h-12 w-full md:w-[90%] bg-gray-300 dark:bg-muted" />
              <Skeleton className="h-10 md:h-12 w-4/5 md:w-[70%] bg-gray-300 dark:bg-muted" />
            </div>

            {/* translation skeleton */}
            <div className="flex" dir="ltr">
              {/* vertical accent bar */}
              <Skeleton className="w-1 shrink-0 rounded-full mr-4 h-14 bg-gray-300 dark:bg-muted" />
              
              <div className="flex w-full flex-col gap-2">
                <Skeleton className="h-5 w-full bg-gray-300 dark:bg-muted" />
                <Skeleton className="h-5 w-5/6 bg-gray-300 dark:bg-muted" />
              </div>
            </div>

            {/* surah reference skeleton */}
            <Skeleton className="mt-5 h-4 w-48 mr-auto bg-gray-300 dark:bg-muted" />
          </div>

          {/* ── action buttons ── */}
          <div className="relative z-10 mt-8 flex items-center gap-2">
            {/* copy button skeleton */}
            <Skeleton className="h-10 w-10 rounded-full bg-gray-300 dark:bg-muted" />
            
            {/* share button skeleton */}
            <Skeleton className="h-10 w-10 rounded-full bg-gray-300 dark:bg-muted" />
          </div>
        </div>
      </div>
    </section>
  );
}