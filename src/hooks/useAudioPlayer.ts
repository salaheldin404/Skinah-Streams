import { useAppDispatch } from "@/lib/store/hooks";
import { useCallback, useEffect, useRef, useState } from "react";

import { setIsPlaying } from "@/lib/store/slices/audio-slice";

interface AudioPlayerProps {
  src: string | null;
  isPlaying: boolean;
  onEnded: () => void;
  setPlaying: (isPlaying: boolean) => void;
  onSeeked: () => void;
}

const useAudioPlayer = ({
  src,
  isPlaying,
  onEnded,
  setPlaying,
  onSeeked,
}: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const dispatch = useAppDispatch();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && src && audio.src !== src) {
      setIsLoading(true);

      audio.src = src;
      audio.load();
    } else if (audio && !src) {
      audio.removeAttribute("src");
    }
  }, [src, setPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch((e) => console.error("Playback error", e));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const handleDurationChange = () => {
      setDuration(audio.duration);
    };
    const handleLoading = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      audio.play().catch((e) => console.log("Playback error", e));
      dispatch(setIsPlaying(true));

      // if (isPlaying) {
      //   audio.play().catch((e) => console.log("Playback error", e));
      //   dispatch(setIsPlaying(true));
      // }
    };
    const handlePlaying = () => {
      setIsLoading(false);
    };

    const handleEerror = () => {
      setIsLoading(false);
      setIsError(true);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("loadedmetadata", handleDurationChange); // Also use loadedmetadata for initial duration
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("waiting", handleLoading);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("seeked", onSeeked); // Listen for the 'seeked' event
    audio.addEventListener("error", handleEerror);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("loadedmetadata", handleDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("waiting", handleLoading);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("seeked", onSeeked);
      audio.removeEventListener("error", handleEerror);
    };
  }, [src, onEnded, dispatch, onSeeked, isPlaying]);

  const handleSeek = useCallback(
    (value: number) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;
      audio.currentTime = (value / 100) * duration;
    },
    [duration]
  );

  return {
    audioRef,
    currentTime,
    duration,
    handleSeek,
    isLoading,
    isError,
  };
};

export default useAudioPlayer;
