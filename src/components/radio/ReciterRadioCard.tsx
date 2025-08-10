"use client";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { Station } from "@/types/radio";
import { useTheme } from "next-themes";
import Image from "next/image";
import { LuPause, LuPlay } from "react-icons/lu";
import {
  DARK_DEFAULT_RECITER_IMAGE,
  LIGHT_DEFAULT_RECITER_IMAGE,
} from "@/constatnts/images";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  setOpenRadioPlayer,
  setRadio,
  setRadioPlaying,
} from "@/lib/store/slices/audio-slice";

interface RadioCardProps {
  station: Station;
  language: "ar" | "en";
}

const ReciterRadioCard = memo(({ station, language }: RadioCardProps) => {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  const dispatch = useAppDispatch();
  const { isRadioPlaying, radioUrl, isRadioPlayerOpen } = useAppSelector(
    (state) => state.audio
  );
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const reciterName = useMemo(() => {
    return station.name[language];
  }, [station.name, language]);

  const defaultImage = useMemo(() => {
    const isDark = isMounted && resolvedTheme === "dark";

    return isDark ? LIGHT_DEFAULT_RECITER_IMAGE : DARK_DEFAULT_RECITER_IMAGE;
  }, [isMounted, resolvedTheme]);

  const isCurrentRadio = useMemo(() => {
    return radioUrl === station.url;
  }, [radioUrl, station.url]);
  const isPlayingThisStation = useMemo(() => {
    return isCurrentRadio && isRadioPlaying;
  }, [isCurrentRadio, isRadioPlaying]);

  const handlePlayRadio = useCallback(() => {
    // If it's the current station, just toggle play/pause.
    if (isCurrentRadio) {
      dispatch(setRadioPlaying(!isRadioPlaying));
      return;
    }

    // If it's a new station, set it and ensure it starts playing.
    dispatch(setRadio({ name: reciterName, url: station.url, id: station.id }));
    dispatch(setRadioPlaying(true));

    // If the player isn't open yet, open it.
    if (!isRadioPlayerOpen) {
      dispatch(setOpenRadioPlayer(true));
    }
  }, [
    dispatch,
    isCurrentRadio,
    isRadioPlaying,
    isRadioPlayerOpen,
    reciterName,
    station,
  ]);

  return (
    <div
      className=" group relative w-full cursor-pointer transition-all duration-300"
      aria-label={`Listen to ${reciterName}`}
      onClick={handlePlayRadio}
      role="button"
      tabIndex={0}
    >
      {/* <div className="absolute inset-0 bg-card backdrop-blur-lg rounded-2xl border border-transparent group-hover:border-primary transition-all duration-300 -z-10"></div> */}

      <div
        className={`absolute inset-0 bg-card backdrop-blur-lg rounded-2xl border transition-all duration-300 -z-10 ${
          isPlayingThisStation
            ? "border-primary"
            : "border-transparent group-hover:border-primary"
        }`}
      ></div>

      <div
        className={`p-6 flex flex-col items-center text-center transform transition-transform duration-300 ${
          isPlayingThisStation ? "-translate-y-1" : "group-hover:-translate-y-1"
        } `}
      >
        {/* Reciter Image with Play Button Overlay */}
        <div className="relative mb-4">
          <Image
            src={station.image_url || defaultImage}
            alt={`Portrait of ${reciterName}`}
            className={`${
              isPlayingThisStation
                ? "scale-105 border-primary"
                : "group-hover:scale-105 group-hover:border-primary border-white/50 dark:border-gray-700/50"
            } w-32 h-32 rounded-full object-cover shadow-lg border-4  transition-all duration-300 `}
            width={128}
            height={128}
            onError={(e) => {
              e.currentTarget.src = defaultImage;
            }}
          />
          <div
            className={`${
              isPlayingThisStation
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            } absolute inset-0 flex items-center justify-center bg-black/50 rounded-full  transition-opacity duration-300`}
          >
            {isPlayingThisStation ? (
              <LuPause className="h-10 w-10 text-white" fill="currentColor" />
            ) : (
              <LuPlay className="h-10 w-10 text-white" fill="currentColor" />
            )}
          </div>
        </div>

        {/* Reciter Information */}
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 truncate w-full">
          {reciterName}
        </h3>
      </div>
    </div>
  );
});

ReciterRadioCard.displayName = "ReciterRadioCard";

export default ReciterRadioCard;
