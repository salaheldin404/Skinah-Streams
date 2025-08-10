"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useCallback, useMemo } from "react";
import { LuVolume2, LuVolume1, LuVolumeX } from "react-icons/lu";
import { setVolume } from "@/lib/store/slices/audio-slice";
const useVolume = () => {
  const { volume } = useAppSelector((state) => state.audio);
  const dispatch = useAppDispatch();
  const VolumeIcon = useMemo(() => {
    if (volume === 0) {
      return LuVolumeX;
    } else if (volume < 0.5) {
      return LuVolume1;
    } else {
      return LuVolume2;
    }
  }, [volume]);

  const handleVolumeChange = useCallback(
    (value: number[]) => {
      dispatch(setVolume(value[0]));
    },

    [dispatch]
  );
  return {
    volume,
    VolumeIcon,
    handleVolumeChange,
  };
};

export default useVolume;
