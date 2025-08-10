"use client";

import { useRef, useState, useEffect } from "react";

interface UseRadioPlayerProps {
  src?: string | null;
  isPlaying: boolean;
}

const useRadioPlayer = ({ src, isPlaying }: UseRadioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // When the src changes, update the audio element and load it.
    if (src && audio.src !== src) {
      audio.src = src;
      audio.load();
    }
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      // The play() method returns a Promise, which should be handled.
      audio.play().catch((e) => console.error("Radio playback failed:", e));
    } else {
      audio.pause();
    }
  }, [isPlaying, src]); // Re-run when play state or src changes.

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoading = () => setIsLoading(true);
    const handleCanPlay = () => {
      setIsLoading(false);
    };
    const handlePlaying = () => {
      setIsLoading(false);
    };
    // 'waiting' is fired when playback has stopped due to a temporary lack of data.
    audio.addEventListener("waiting", handleLoading);
    // 'playing' is fired when playback is ready to start after having been paused or delayed.
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("playing", handlePlaying);

    // Cleanup: remove event listeners when the component unmounts or src changes.
    return () => {
      audio.removeEventListener("waiting", handleLoading);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("playing", handlePlaying);
    };
  }, [src]); // Re-run if the audio source changes.
  return { audioRef, isLoading };
};

export default useRadioPlayer;
