import { memo } from "react";

const DotIndicators = memo(
  ({
    total,
    selected,
    onSelect,
  }: {
    total: number;
    selected: number;
    onSelect: (index: number) => void;
  }) => {
    // For many pages, show a sliding window of dots
    const maxDots = 7;
    const showDots = total <= maxDots;

    if (showDots) {
      return (
        <div className="flex items-center gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              aria-label={`Go to page ${i + 1}`}
              className={`
                rounded-full transition-all duration-300 ease-out
                ${
                  i === selected
                    ? "w-6 h-2 bg-primary shadow-sm shadow-primary/30"
                    : "w-2 h-2 bg-muted-foreground/25 hover:bg-muted-foreground/40"
                }
                cursor-pointer
              `}
            />
          ))}
        </div>
      );
    }

    // Sliding window for many pages
    const windowSize = 5;
    let windowStart = Math.max(0, selected - Math.floor(windowSize / 2));
    const windowEnd = Math.min(total, windowStart + windowSize);
    windowStart = Math.max(0, windowEnd - windowSize);

    return (
      <div className="flex items-center gap-1">
        {windowStart > 0 && (
          <span className="text-[10px] text-muted-foreground/50 px-0.5">
            ···
          </span>
        )}
        {Array.from({ length: windowEnd - windowStart }).map((_, i) => {
          const dotIndex = windowStart + i;
          return (
            <button
              key={dotIndex}
              onClick={() => onSelect(dotIndex)}
              aria-label={`Go to page ${dotIndex + 1}`}
              className={`
                rounded-full transition-all duration-300 ease-out
                ${
                  dotIndex === selected
                    ? "w-5 h-2 bg-primary shadow-sm shadow-primary/30"
                    : "w-2 h-2 bg-muted-foreground/25 hover:bg-muted-foreground/40"
                }
              `}
            />
          );
        })}
        {windowEnd < total && (
          <span className="text-[10px] text-muted-foreground/50 px-0.5">
            ···
          </span>
        )}
      </div>
    );
  },
);
DotIndicators.displayName = "DotIndicators";

export default DotIndicators;