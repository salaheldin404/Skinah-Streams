import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
interface SurahNavigationButtonProps {
  onNextSurah: () => void;
  onPreviousSurah: () => void;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
}

const SurahNavigationButton = ({
  onNextSurah,
  onPreviousSurah,
  isPreviousDisabled,
  isNextDisabled,
}: SurahNavigationButtonProps) => {
  const t = useTranslations("SurahNavigationButton");
  return (
    <div className="flex justify-between gap-3 items-center font-cairo">
      <Button
        variant={"outline"}
        disabled={isPreviousDisabled}
        size="sm"
        onClick={onPreviousSurah}
        className="cursor-pointer"
      >
        {t("previous")}
      </Button>
      <Button
        className="cursor-pointer"
        disabled={isNextDisabled}
        size="sm"
        onClick={onNextSurah}
      >
        {t("next")}
      </Button>
    </div>
  );
};

export default SurahNavigationButton;
