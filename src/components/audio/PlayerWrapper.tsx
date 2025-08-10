"use client";
import { useEffect } from "react";
import AudioPlayer from "./AudioPlayer";
import RadioPlayer from "./RadioPlayer";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  setIsPlaying,
  setRadioPlaying,
  setOpenAudioPlayer,
  setOpenRadioPlayer,
} from "@/lib/store/slices/audio-slice";

const PlayerWrapper = () => {
  const { isRadioPlayerOpen, isOpen, reciter } = useAppSelector(
    (state) => state.audio
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isRadioPlayerOpen) {
      dispatch(setIsPlaying(false));
      dispatch(setOpenAudioPlayer(false));
    }
  }, [isRadioPlayerOpen, dispatch]);
  useEffect(() => {
    if (isOpen) {
      dispatch(setRadioPlaying(false));
      dispatch(setOpenRadioPlayer(false));
    }
  }, [isOpen, dispatch]);
  if (isRadioPlayerOpen) {
    return <RadioPlayer />;
  }
  if (isOpen) return <AudioPlayer isSpecificReciters={reciter.id == 0} />;
  return null;
};

export default PlayerWrapper;
