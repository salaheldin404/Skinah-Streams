"use client";
import RecitersList from "@/components/reciter/RecitersList";
import ReciterCardSkeleton from "@/components/reciter/ReciterCardSkeleton";
import Pagination from "@/components/Pagination";
import { useDebounce } from "@uidotdev/usehooks";
import SearchInput from "@/components/common/SearchInput";

import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";

import { useGetAllRectitationsDataQuery } from "@/lib/store/features/quranApi";
import { useCallback, useEffect, useMemo, useState } from "react";

const RecitersPage = () => {
  const t = useTranslations("Reciters");

  const locale = useLocale();
  const queryParams = useMemo(() => ({ language: locale }), [locale]);
  const { data, isLoading, isError } =
    useGetAllRectitationsDataQuery(queryParams);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [currentPage, setCurrentPage] = useState(1);

  const allReciters = useMemo(() => data || [], [data]);
  const ITEMS_PER_PAGE = 18;

  const filteredReciters = useMemo(() => {
    if (!debouncedSearchTerm) {
      return allReciters;
    }
    let result = allReciters;
    const lowercasedSearchTerm = debouncedSearchTerm.toLowerCase();

    result = result.filter((reciter) => {
      const nameMatches = reciter.name
        .toLowerCase()
        .includes(lowercasedSearchTerm);
      const moshafMatches = reciter.moshaf?.some((moshaf) =>
        moshaf.name.toLowerCase().includes(lowercasedSearchTerm)
      );
      return nameMatches || moshafMatches;
    });
    return result;
  }, [allReciters, debouncedSearchTerm]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const totalPages = Math.ceil(filteredReciters.length / ITEMS_PER_PAGE);
  // Slice the filtered list to get only the items for the current page.
  const paginatedReciters = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredReciters.slice(startIndex, endIndex);
  }, [filteredReciters, currentPage]);

  // --- Helper function to render the main content based on state ---
  const renderContent = () => {
    // 5. Handle the loading state with skeleton loaders.
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 12 }).map((_, index) => (
            <ReciterCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    // 6. Handle the error state gracefully.
    if (isError) {
      return (
        <div className="text-center py-20">
          <h3 className="text-xl font-bold text-red-500">
            {t("error-loading-title", {
              defaultMessage: "Failed to Load Reciters",
            })}
          </h3>
          <p className="text-gray-500">
            {t("error-loading-description", {
              defaultMessage: "Please check your connection and try again.",
            })}
          </p>
        </div>
      );
    }

    // 7. Handle the "No Results" state for searches.
    if (filteredReciters.length === 0) {
      return (
        <div className="text-center py-20">
          <h3 className="text-xl font-bold">{t("no-reciters")}</h3>
          <p className="text-gray-500">{t("no-reciters-description")}</p>
        </div>
      );
    }

    // 8. Render the filtered list of reciters.
    return <RecitersList reciters={paginatedReciters} />;
  };

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  return (
    <div className="py-10">
      <div className="main-container">
        <div className="text-center space-y-6 mb-12">
          <h1 className="font-bold text-primary text-4xl">{t("header")}</h1>
          <p className="text-gray-500 leading-relaxed">{t("description")}</p>
        </div>
        <SearchInput
          onChange={handleSearchChange}
          value={searchTerm}
          placeholder={t("input")}
        />

        {renderContent()}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default RecitersPage;
