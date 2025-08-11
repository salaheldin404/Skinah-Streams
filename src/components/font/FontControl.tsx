"use client";

import FontSize from "./FontSize";
import FontSelect from "./FontSelect";
import { useTranslations } from "next-intl";
import AyahStyleSelect from "./AyahStyleSelect";

const FontControl = () => {
  const t = useTranslations("Settings");

  return (
    <div className="space-y-5 px-4">
      <h2 className="text-xl font-bold">{t("quran-font")}</h2>
      <div className="flex items-start md:items-center justify-between  gap-4 flex-col md:flex-row">
        <p>{t("style")}</p>
        <FontSelect />
      </div>
      <div className="flex items-start md:items-center justify-between  gap-4 flex-col md:flex-row">
        <p>{t("size")}</p>
        <FontSize />
      </div>
      <div className="flex items-start md:items-center justify-between  gap-4 flex-col md:flex-row">
        <p>{t("ayah-style")}</p>
        <AyahStyleSelect />
      </div>
    </div>
  );
};

export default FontControl;
