"use client";

import { useTranslations } from "next-intl";

const Loading = () => {
  const t = useTranslations("Loading");
  return <div className="text-center py-20 text-lg">{t("loading")}</div>;
};

export default Loading;
