import { Reciter } from "@/types/reciter";
import { useTranslations } from "next-intl";
import Image from "next/image";
import RecitationTypeBadge from "./RecitationTypeBadge";

import {
  getReciterImage,
  getAvailableRecitationTypes,
} from "@/lib/utils/reciters";
import { useTheme } from "next-themes";
import { Link } from "@/i18n/navigation";
import {
  DARK_DEFAULT_RECITER_IMAGE,
  LIGHT_DEFAULT_RECITER_IMAGE,
} from "@/constatnts/images";
import { memo } from "react";

const ReciterCard = memo(({ reciter }: { reciter: Reciter }) => {
  const t = useTranslations("Reciters");
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";
  const defaultImage = isDark
    ? LIGHT_DEFAULT_RECITER_IMAGE
    : DARK_DEFAULT_RECITER_IMAGE;

  const imageUrl = getReciterImage(reciter.name) || defaultImage;

  const recitationTypes = {
    murattal: t("murattal"),
    mojawwad: t("mojawwad"),
    "mo'lim": t("mo'lim"),
  };

  const availableTypes = getAvailableRecitationTypes({
    reciter,
    recitationTypes,
  });
  return (
    <div
      className=" group relative w-full cursor-pointer transition-all duration-300"
      aria-label={`Listen to ${reciter.name}`}
    >
      <Link
        href={`/reciters/${reciter.id}`}
        className="absolute inset-0 w-full h-full z-10"
      />

      {/* Glossy background with border that appears on hover */}
      <div className="absolute inset-0 bg-card backdrop-blur-lg rounded-2xl border border-transparent group-hover:border-primary transition-all duration-300 -z-10"></div>

      <div className="p-6 flex flex-col items-center text-center transform transition-transform duration-300 group-hover:-translate-y-1">
        {/* Reciter Image with Play Button Overlay */}
        <div className="relative mb-4">
          <Image
            src={imageUrl}
            alt={`Portrait of ${reciter.name}`}
            className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white/50 dark:border-gray-700/50 transition-all duration-300 group-hover:scale-105 group-hover:border-primary"
            width={128}
            height={128}
            onError={(e) => {
              e.currentTarget.src = defaultImage;
            }}
          />
        </div>

        {/* Reciter Information */}
        <h3
          title={reciter.name}
          className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 truncate w-full"
        >
          {reciter.name}
        </h3>
        <div className="flex gap-2 flex-wrap items-center">
          {availableTypes.map((type, index) => {
            return <RecitationTypeBadge type={type} key={`${type}-${index}`} />;
          })}
        </div>
      </div>
    </div>
  );
});

ReciterCard.displayName = "ReciterCard";

export default ReciterCard;
