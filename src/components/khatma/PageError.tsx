"use client";
import { memo } from "react";

import { useTranslations } from "next-intl";
const PageError = memo(({ pageNumber }: { pageNumber: number }) => {
  const t = useTranslations("KhatmaReader");
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-destructive px-4">
      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
        <span className="text-xl">⚠</span>
      </div>
      <p className="text-sm font-medium font-cairo">
        {t("pageLoadError")} {pageNumber}
      </p>
      <p className="text-xs text-muted-foreground font-cairo">
        {t("tryRefreshing")}
      </p>
    </div>
  );
});

PageError.displayName = "PageError";

export default PageError;
