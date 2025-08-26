"use client";
import { memo, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { HisnData } from "@/types/hisn-muslim";
import React from "react";
import { FaCheck } from "react-icons/fa";

import {
  AthkarSlug,
  resetCustomCardAthkar,
  setAthkarCount,
} from "@/lib/store/slices/athkar-slice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { toast } from "sonner";
import { RiResetLeftFill } from "react-icons/ri";

interface AthkarCardProps {
  item: HisnData;
  index: number;
  dataCount: number;
  slug: AthkarSlug;
  goToNextCard: () => void;
}

const AthkarCard = memo(
  ({ item, index, slug, goToNextCard }: AthkarCardProps) => {
    const { content, description, count } = item;
    const dispatch = useAppDispatch();
    const storedCount = useAppSelector((state) => state.athkar[slug]?.[index]);
    const [completed, setCompleted] = useState(false);
    const [isMount, setIsMount] = useState(false);

    const [countState, setCountState] = useState(
      typeof storedCount === "number" ? storedCount : +count
    );
    const handleClickCheck = () => {
      if (countState > 0) {
        const newCount = countState - 1;

        setCountState(newCount);
        dispatch(setAthkarCount({ count: newCount, index, slug }));
        if (newCount === 0) {
          goToNextCard();
        }
      }
    };
    const handleResetCount = () => {
      dispatch(resetCustomCardAthkar({ index, slug }));
      toast.success("تمت إعادة تعيين العداد الحالي ");
    };

    useEffect(() => {
      // When the `storedCount` from Redux changes (e.g., after a reset),
      // this effect will run and update the local `countState`.
      const newCount = typeof storedCount === "number" ? storedCount : +count;
      setCountState(newCount);
    }, [storedCount, count]); // It runs whenever the Redux value changes.

    useEffect(() => {
      setCompleted(countState === 0);
    }, [countState, index, slug]);

    useEffect(() => {
      setIsMount(true);
    }, []);
    return (
      <div
        // style={{ flex: "0 0 80%" }}
        className="embla__slide relative overflow-auto  max-h-[400px] flex-shrink-0 flex-grow-0 basis-full min-w-0 bg-card p-4 rounded tajwal-text"
      >
        <div className="embla__slide__number h-full flex justify-between flex-col">
          <div>
            <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed text-slate-800 dark:text-white  text-center">
              {content}
            </p>

            {description && (
              <div className="mt-4 pt-4 border-t border-dashed ">
                {description && (
                  <p className="text-sm text-slate-600 dark:text-slate-100 mt-2 p-3 bg-slate-100 dark:bg-secondary rounded-md">
                    {description}
                  </p>
                )}
              </div>
            )}
          </div>

          {isMount && (
            <div className="relative flex items-center justify-center gap-4 pt-4 mt-4">
              <Button
                className={`select-none cursor-pointer flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-md ${
                  completed
                    ? "bg-primary text-white cursor-not-allowed"
                    : "bg-slate-200 text-slate-700"
                }`}
                disabled={completed}
                variant={"ghost"}
                onClick={handleClickCheck}
              >
                <span className="font-sans">
                  {completed ? <FaCheck /> : countState}
                </span>
              </Button>
              <div
                title="إعادة تعيين  العداد الحالي"
                aria-label="إعادة تعيين  العداد الحالي"
                onClick={handleResetCount}
                className="cursor-pointer absolute left-4 bottom-4"
              >
                <RiResetLeftFill size={24} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

AthkarCard.displayName = "AthkarCard";

export default AthkarCard;
