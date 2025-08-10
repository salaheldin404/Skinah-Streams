import { Button } from "@/components/ui/button";
import { LuPause, LuPlay } from "react-icons/lu";

interface SurahPlayButtonProps {
  isPlaying: boolean;
  currentSurah: boolean;
  handleTogglePlay: () => void;
  className?: string;
  children?: React.ReactNode;
}

const SurahPlayButton = ({
  isPlaying,
  currentSurah,
  handleTogglePlay,
  className,
  children,
}: SurahPlayButtonProps) => {
  return (
    <Button
      className={`${className} cursor-pointer w-10 h-10 transition-opacity gradient-purple rounded-lg flex items-center justify-center `}
      onClick={handleTogglePlay}
    >
      {children}
      {currentSurah && isPlaying ? <LuPause size={16} /> : <LuPlay size={16} />}
    </Button>
  );
};

export default SurahPlayButton;
