import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useCallback } from "react";

import { Surah } from "@/types/surah";
import {
  setAudioData,
  setCurrentVerse,
  setIsPlaying,
  setOpenAudioPlayer,
  setReciter,
} from "@/lib/store/slices/audio-slice";
import AudioPlayerService from "@/lib/utils/audio";
import { setSurahInfo } from "@/lib/store/slices/surah-slice";
import useIsSpecificReciter from "@/hooks/useIsSpecificReciter";

interface PlayOptions {
  forcePlay?: boolean;
  openPlayer?: boolean;
}

const useAudio = () => {
  const dispatch = useAppDispatch();
  // const isPlaying = useAppSelector((state) => state.audio.isPlaying);
  // const isOpen = useAppSelector((state) => state.audio.isOpen);
  // const currentReciter = useAppSelector((state) => state.audio.reciter);
  const currentSurah = useAppSelector((state) => state.surah.surahInfo?.id);
  const {
    isOpen,
    isPlaying,
    reciter: currentReciter,
  } = useAppSelector((state) => state.audio);
  const isSpecificReciter = useIsSpecificReciter();

  const play = useCallback(
    (surah: Surah, options: PlayOptions = {}) => {
      const { forcePlay = false, openPlayer = true } = options;

      if (!isOpen && openPlayer) {
        dispatch(setOpenAudioPlayer(true));
      }
      // Validate surah data
      const validation = AudioPlayerService.validateSurahData(surah);
      if (!validation.isValid) {
        console.error("Invalid surah data:", surah);
        return;
      }
      const state = {
        isOpen,
        isPlaying,
        currentReciter: currentReciter.id,
        currentSurah,
      };
      const action = AudioPlayerService.getPlaybackAction(surah, state);
      const reciterData = AudioPlayerService.resolveReciterData(surah, currentReciter, isSpecificReciter);
      switch (action) {
        case "TOGGLE":
          dispatch(setIsPlaying(!isPlaying || forcePlay));
          break;
        case "CHANGE_RECITER":
          if (validation.hasReciter && validation.hasAudio) {
            dispatch(
              setAudioData({
                audio_url: surah.serverLink!,
                timestamps: [],
                chapter_id: surah.number,
              }),
            );
            dispatch(
              setReciter({
                id: reciterData.id,
                name: reciterData.name,
                source: "mp3quran",
              }),
            );

            dispatch(setCurrentVerse(null));
            dispatch(setIsPlaying(true));
          } else {
              dispatch(
                setReciter({
                  id: reciterData.id,
                  name: reciterData.name,
                }),
              );
            // if (isSpecificReciter) {
            //   dispatch(
            //     setReciter({
            //       id: 7,
            //       name: "مشاري راشد العفاسي",
            //     }),
            //   );
            // } else {
            //   dispatch(
            //     setReciter({
            //       id: currentReciter.id,
            //       name: currentReciter.name,
            //     }),
            //   );
            // }
          }

          break;
        case "CHANGE_SURAH":
          if (validation.hasAudio && validation.hasReciter) {
            dispatch(
              setAudioData({
                audio_url: surah.serverLink!,
                timestamps: [],
                chapter_id: surah.number,
              }),
            );
            dispatch(
              setReciter({
                id: reciterData.id,
                name: reciterData.name,
                source: "mp3quran",
              }),
            );

            dispatch(setCurrentVerse(null));
            dispatch(setIsPlaying(true));
          } else {
            console.warn(
              "Surah does not have valid audio or reciter data:",
              surah,
            );
              
             dispatch(
              setReciter({
                id: reciterData.id,
                name: reciterData.name,
              }),
            );
            // if (isSpecificReciter) {
            //   dispatch(
            //     setReciter({
            //       id: 7,
            //       name: "مشاري راشد العفاسي",
            //     }),
            //   );
            // } else {
            //   dispatch(
            //     setReciter({
            //       id: currentReciter.id,
            //       name: currentReciter.name,
            //     }),
            //   );
            // }
          }
          dispatch(
            setSurahInfo({
              id: surah.number,
              name: surah.name,
            }),
          );

          dispatch(setIsPlaying(false));
          break;
        default:
          console.warn("Invalid playback action for surah:", surah);
      }
    },
    [
      dispatch,
      isOpen,
      isPlaying,
      currentReciter,
      currentSurah,
      isSpecificReciter,
    ],
  );

  const pause = useCallback(() => {
    dispatch(setIsPlaying(false));
  }, [dispatch]);
  const toggle = useCallback(() => {
    dispatch(setIsPlaying(!isPlaying));
  }, [dispatch, isPlaying]);

  return { play, pause, toggle };
};

export default useAudio;
