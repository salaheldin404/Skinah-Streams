import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo } from "react";

const NavButton = memo(
  ({
    onClick,
    disabled,
    direction,
  }: {
    onClick: () => void;
    disabled: boolean;
    direction: "prev" | "next";
  }) => {
    const Icon = direction === "prev" ? ChevronRight : ChevronLeft;
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label={direction === "prev" ? "Previous page" : "Next page"}
        className={`
          hidden md:flex items-center justify-center
          w-10 h-10 rounded-full
          bg-card border border-border/60 shadow-sm
          text-muted-foreground
          transition-all duration-200
          hover:bg-primary/10 hover:text-primary hover:border-primary/30 hover:shadow-md
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-card disabled:hover:text-muted-foreground disabled:hover:border-border/60 disabled:hover:shadow-sm
          active:scale-95
          cursor-pointer
        `}
      >
        <Icon className="w-5 h-5" />
      </button>
    );
  },
);

NavButton.displayName = "NavButton";

export default NavButton;