import { memo, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import NavButton from "../khatma/NavButton";
import { Bookmark, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Setting from "../header/Setting";

export interface ReaderPageHeaderProps {
  pageText: string;
  currentIndexLabel: string;
  totalItemsLabel: string;
  bookmarkLabel: string;
  isBookmarked: boolean;
  isBookmarkLoading: boolean;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onBookmark: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

interface MobileNavButtonProps {
  ariaLabel: string;
  children: ReactNode;
  disabled: boolean;
  onClick: () => void;
}

const MobileNavButton = memo(
  ({ ariaLabel, children, disabled, onClick }: MobileNavButtonProps) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="p-1.5 rounded-lg text-muted-foreground disabled:opacity-20 active:scale-90 transition-all"
    >
      {children}
    </button>
  ),
);

MobileNavButton.displayName = "MobileNavButton";

const ReaderPageHeader = memo(
  ({
    pageText,
    currentIndexLabel,
    totalItemsLabel,
    bookmarkLabel,
    isBookmarked,
    isBookmarkLoading,
    canGoPrevious,
    canGoNext,
    onBookmark,
    onPrevious,
    onNext,
  }: ReaderPageHeaderProps) => {
    const isBookmarkDisabled = isBookmarkLoading || isBookmarked;

    return (
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 bg-card/80 backdrop-blur-sm shrink-0 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold font-cairo">
            <span>{currentIndexLabel}</span>
            <span className="text-primary/50">/</span>
            <span>{totalItemsLabel}</span>
          </div>
          <Setting />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-cairo font-medium text-foreground/80">
            {pageText}
          </span>
          <button
            type="button"
            onClick={onBookmark}
            disabled={isBookmarkDisabled}
            aria-label={bookmarkLabel}
            className={cn(
              "cursor-pointer p-2 rounded-md transition-colors disabled:opacity-70",
              isBookmarked
                ? "bg-primary/10 dark:bg-primary/20 text-primary"
                : "hover:bg-secondary text-slate-400",
            )}
          >
            {isBookmarkLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Bookmark
                className={cn("w-5 h-5", isBookmarked && "fill-current")}
              />
            )}
          </button>
        </div>

        <div className="hidden md:flex items-center gap-1.5">
          <NavButton
            onClick={onPrevious}
            disabled={!canGoPrevious}
            direction="prev"
          />
          <NavButton onClick={onNext} disabled={!canGoNext} direction="next" />
        </div>

        <div className="flex md:hidden items-center gap-1">
          <MobileNavButton
            onClick={onPrevious}
            disabled={!canGoPrevious}
            ariaLabel="Previous"
          >
            <ChevronRight className="w-4 h-4" />
          </MobileNavButton>
          <MobileNavButton onClick={onNext} disabled={!canGoNext} ariaLabel="Next">
            <ChevronLeft className="w-4 h-4" />
          </MobileNavButton>
        </div>
      </div>
    );
  },
);

ReaderPageHeader.displayName = "ReaderPageHeader";

export default ReaderPageHeader;
