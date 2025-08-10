import { useTranslations } from "next-intl";

const RecitationTypeBadge = ({ type }: { type: string }) => {
  const t = useTranslations("Reciters");

  const styleMap = {
    [t("murattal")]:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
    [t("mojawwad")]:
      "bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300",
    [t("mo'lim")]:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
    Default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };
  const badgeClasses = styleMap[type] || styleMap.Default;
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${badgeClasses}`}
    >
      {type}
    </span>
  );
};

export default RecitationTypeBadge;
