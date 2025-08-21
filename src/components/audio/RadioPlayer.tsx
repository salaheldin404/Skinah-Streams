"use client";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import {
  setOpenRadioPlayer,
  setRadioPlaying,
} from "@/lib/store/slices/audio-slice";
import { memo, useEffect } from "react";
import { Button } from "../ui/button";
import { LuX } from "react-icons/lu";
import PlayButton from "./PlayButton";
import useRadioPlayer from "@/hooks/useRadioPlayer";
import VolumeControl from "./VolumeControl";
import useVolume from "@/hooks/useVolume";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
const RadioPlayer = memo(() => {
  const t = useTranslations("RadioPlayer");
  const { radioUrl, radioName, isRadioPlayerOpen, isRadioPlaying } =
    useAppSelector((state) => state.audio);

  const dispatch = useAppDispatch();
  const {
    audioRef,
    isLoading: radioLoading,
    isError: isRadioError,
  } = useRadioPlayer({
    src: radioUrl,
    isPlaying: isRadioPlaying,
  });
  const { volume, VolumeIcon, handleVolumeChange } = useVolume();

  const handleToggleRadioPlayer = () => {
    dispatch(setRadioPlaying(!isRadioPlaying));
  };
  const handleCloseRadioPLayer = () => {
    dispatch(setOpenRadioPlayer(false));
    dispatch(setRadioPlaying(false));
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isRadioPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isRadioPlaying, isRadioPlayerOpen, audioRef]);
  useEffect(() => {
    const audio = audioRef.current;
    if (isRadioPlayerOpen && audio) {
      dispatch(setRadioPlaying(true));
      audio.play();
    }
  }, [isRadioPlayerOpen, audioRef, dispatch]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, audioRef]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keyboard events if an input is focused.
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      // Handle "Escape" to close the player
      if (e.key === "Escape") {
        handleCloseRadioPLayer();
      }
      // Handle "Space" to toggle play/pause
      else if (e.key === " ") {
        e.preventDefault(); // Prevents the default spacebar action (e.g., scrolling).
        handleToggleRadioPlayer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // The cleanup function correctly removes the exact listener that was added.
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
  useEffect(() => {
    if (isRadioError) {
      dispatch(setRadioPlaying(false));
      toast.error(t("radio-player-error"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRadioError, dispatch]);

  return (
    <div
      className={`${
        isRadioPlayerOpen
          ? "translate-y-0 opacity-100 visible"
          : "opacity-0 translate-y-[150%] invisible"
      } transition-all duration-300 fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border p-4 z-50`}
    >
      <audio ref={audioRef} preload="metadata" />
      <div className="main-container flex justify-between items-center">
        <div>{radioName}</div>
        <div className="flex items-center gap-3">
          <VolumeControl
            volume={volume}
            VolumeIcon={VolumeIcon}
            handleVolumeChange={handleVolumeChange}
          />
          <PlayButton
            isPlaying={isRadioPlaying}
            isLoading={radioLoading}
            handleTogglePlay={handleToggleRadioPlayer}
          />

          <Button
            variant="ghost"
            className="cursor-pointer w-8 h-8 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={handleCloseRadioPLayer}
          >
            <LuX className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
});

RadioPlayer.displayName = "RadioPlayer";
export default RadioPlayer;
