import { Button } from "./ui/button";
import { useTranslations } from "next-intl";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const t = useTranslations("Pagination");
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-4 mt-12">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 cursor-pointer rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        variant={"outline"}
      >
        {t("previous")}
      </Button>
      <span className="text-gray-700 dark:text-gray-300 font-medium">
        {t("page")} {currentPage} {t("of")} {totalPages}
      </span>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 cursor-pointer rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {t("next")}
      </Button>
    </div>
  );
};

export default Pagination;
