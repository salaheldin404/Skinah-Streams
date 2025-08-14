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
}

const SurahPlayButton = ({
  isPlaying,
  isLoading,
  currentSurah,
  handleTogglePlay,
  className,
  children,
}: SurahPlayButtonProps) => {
  const renderIcon = () => {
    // The loading state has the highest priority.
    if (currentSurah && isLoading) {
      return <ImSpinner2 className="w-6 h-6 animate-spin" />;
    }

    if (currentSurah && isPlaying) {
      return <LuPause size={16} />;
    }

    return <LuPlay size={16} />;
  };
  return (
    <Button
      className={`${className} cursor-pointer w-10 h-10 transition-opacity gradient-purple rounded-lg flex items-center justify-center `}
      onClick={handleTogglePlay}
      aria-label={currentSurah && isPlaying ? "Pause" : "Play"}
    >
      {children}

      {renderIcon()}
    </Button>
  );
};

export default SurahPlayButton;
