import { Button } from "@/components/ui/button";
import { LuPause, LuPlay } from "react-icons/lu";
import { ImSpinner2 } from "react-icons/im";

interface SurahPlayButtonProps {
  isPlaying: boolean;
  currentSurah: boolean;
  isLoading: boolean;
  handleTogglePlay: () => void;
  className?: string;
  children?: React.ReactNode;
  isSameReciter?: boolean; // If false, show play icon even if currentSurah is true
}

const SurahPlayButton = ({
  isPlaying,
  isLoading,
  currentSurah,
  handleTogglePlay,
  className,
  children,
  isSameReciter = true, // Default to true for backward compatibility
}: SurahPlayButtonProps) => {
  // Only consider it the "current" playing track if it's the same surah AND same reciter
  const isCurrentlyPlaying = currentSurah && isSameReciter;

  const renderIcon = () => {
    // The loading state has the highest priority.
    if (isCurrentlyPlaying && isLoading) {
      return <ImSpinner2 className="w-6 h-6 animate-spin" />;
    }

    if (isCurrentlyPlaying && isPlaying) {
      return <LuPause size={16} />;
    }

    return <LuPlay size={16} />;
  };
  return (
    <Button
      className={`${className} z-30 cursor-pointer w-10 h-10 transition-opacity gradient-purple rounded-lg flex items-center justify-center `}
      onClick={handleTogglePlay}
      aria-label={isCurrentlyPlaying && isPlaying ? "Pause" : "Play"}
    >
      {children}

      {renderIcon()}
    </Button>
  );
};

export default SurahPlayButton;
