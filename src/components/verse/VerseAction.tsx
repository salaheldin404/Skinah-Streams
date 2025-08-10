import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/i18n/navigation";
import { Verse } from "@/types/verse";
import { useTranslations } from "next-intl";
import { LuBookOpen, LuPlay, LuCopy } from "react-icons/lu";
import { toast } from "sonner";

interface VerseActionProps {
  verse: Verse;
  isReciterDisabled: boolean;
  className?: string;
  onClickVerse: (verse: Verse) => void;
  onClickCopy: (verse: Verse) => void;
}
const VerseAction = ({
  verse,
  isReciterDisabled,
  className,
  onClickVerse,
  onClickCopy,
}: VerseActionProps) => {
  const t = useTranslations("VerseAction");

  const handleClickCopy = () => {
    onClickCopy(verse);
    toast.success(t("copy-message"));
  };
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Tooltip delayDuration={100}>
        <TooltipTrigger
          onClick={() => onClickVerse(verse)}
          className={`${
            isReciterDisabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          }  grid place-content-center w-8 h-8 rounded-full hover:bg-secondary transition-colors`}
          disabled={isReciterDisabled}
        >
          <LuPlay />
        </TooltipTrigger>
        <TooltipContent>
          <p>{isReciterDisabled ? t("no-play") : t("play")}</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip delayDuration={100}>
        <TooltipTrigger
          onClick={handleClickCopy}
          className="cursor-pointer grid place-content-center w-8 h-8 rounded-full hover:bg-secondary transition-colors"
        >
          <LuCopy />
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("copy")}</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip delayDuration={100}>
        <TooltipTrigger
          asChild
          className="cursor-pointer grid place-content-center w-8 h-8 rounded-full hover:bg-secondary transition-colors"
        >
          <Link
            href={`/tafsir/${verse.chapter_id}/${verse.verse_number}`}
            className="cursor-pointer grid place-content-center w-8 h-8 rounded-full hover:bg-secondary transition-colors"
            aria-label="Open Tafsir"
            scroll={false}
          >
            <LuBookOpen />
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("tafsirs")}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default VerseAction;
