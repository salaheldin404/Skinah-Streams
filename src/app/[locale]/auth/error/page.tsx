"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LuShieldX, LuTriangleAlert, LuRotateCcw } from "react-icons/lu";
import { FaHome } from "react-icons/fa";

const AuthErrorPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");
  const t = useTranslations("AuthError");

  const isAccessDenied = error === "AccessDenied";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div
            className={`rounded-full p-5 ${
              isAccessDenied
                ? "bg-orange-100 dark:bg-orange-500/10"
                : "bg-red-100 dark:bg-red-500/10"
            }`}
          >
            {isAccessDenied ? (
              <LuShieldX className="w-12 h-12 text-orange-500" />
            ) : (
              <LuTriangleAlert className="w-12 h-12 text-red-500" />
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold">
          {isAccessDenied ? t("title") : t("default-title")}
        </h1>

        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-base md:text-lg">
          {isAccessDenied
            ? t("access-denied-description")
            : t("default-description")}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity w-full sm:w-auto justify-center"
          >
            <FaHome className="w-4 h-4" />
            {t("back-home")}
          </Link>

          {!isAccessDenied && (
            <Link
              href="/api/auth/signin"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-card font-medium hover:bg-secondary transition-colors w-full sm:w-auto justify-center"
            >
              <LuRotateCcw className="w-4 h-4" />
              {t("try-again")}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthErrorPage;
