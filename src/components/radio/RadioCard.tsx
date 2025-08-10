import { Station } from "@/types/radio";
import { memo, useCallback, useMemo } from "react";
import { LuPause, LuPlay } from "react-icons/lu";
import { Button } from "../ui/button";
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
const RadioCard = memo(({ station, language }: RadioCardProps) => {
  const dispatch = useAppDispatch();
  const { isRadioPlaying, radioUrl, isRadioPlayerOpen } = useAppSelector(
    (state) => state.audio
  );
  const stationName = useMemo(() => {
    return station.name[language];
  }, [station.name, language]);

  const isCurrentRadio = useMemo(() => {
    return radioUrl === station.url;
  }, [radioUrl, station.url]);
  const isPlayingThisStation = isCurrentRadio && isRadioPlaying;
  const handlePlayRadio = useCallback(() => {
    // If it's the current station, just toggle play/pause.
    if (isCurrentRadio) {
      dispatch(setRadioPlaying(!isRadioPlaying));
      return;
    }

    // If it's a new station, set it and ensure it starts playing.
    dispatch(setRadio({ name: stationName, url: station.url, id: station.id }));
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
    stationName,
    station,
  ]);
  return (
    <div className="bg-card p-3 rounded-md flex items-center justify-between">
      <p>{stationName}</p>
      <Button
        className={`cursor-pointer w-10 h-10 gradient-purple rounded-lg flex items-center justify-center `}
        onClick={handlePlayRadio}
      >
        {isPlayingThisStation ? <LuPause size={16} /> : <LuPlay size={16} />}
      </Button>
    </div>
  );
});

RadioCard.displayName = "RadioCard";

export default RadioCard;
