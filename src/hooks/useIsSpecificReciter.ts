import { useGetAllRectitationsQuery } from "@/lib/store/features/audioApi";
import { useAppSelector } from "@/lib/store/hooks";

/**
 * Returns true if the current reciter is a "specific reciter" (not in the standard API list).
 * This means the audio comes from a custom source rather than the standard recitations API.
 */
const useIsSpecificReciter = () => {
  const { data: reciters } = useGetAllRectitationsQuery({ language: "ar" });
  const reciter = useAppSelector((state) => state.audio.reciter);
  if (reciter.source) return true;
  const isReciterInList = reciters?.some(
    (reciterItem) =>
      reciterItem.id === reciter.id &&
      reciterItem.translated_name.name == reciter.name,
  );
  // If reciter is in the list, it's NOT a specific reciter
  // If reciter is NOT in the list (or undefined), it IS a specific reciter
  return !isReciterInList;
};

export default useIsSpecificReciter;
