import type { Surah } from "@/types/surah";

interface AudioPlayerState {
  isPlaying: boolean;
  isOpen: boolean;
  currentReciter: number | null;
  currentSurah: number | null;
}

class AudioPlayerService {
  static getPlaybackAction(
    surha: Surah,
    currentState: AudioPlayerState,
  ): "TOGGLE" | "CHANGE_RECITER" | "CHANGE_SURAH" | "INVALID" {
    const isSameReciter = surha.reciterId === currentState.currentReciter;
    const isSameSurah = surha.number === currentState.currentSurah;

    if (!isSameSurah) {
      return "CHANGE_SURAH";
    }
    if (isSameSurah && !isSameReciter) {
      return "CHANGE_RECITER";
    }

    if (isSameSurah && isSameReciter) {
      return "TOGGLE";
    }
    return "INVALID";
  }
  static validateSurahData(surah: Surah): {
    isValid: boolean;
    hasAudio: boolean;
    hasReciter: boolean;
  } {
    return {
      isValid: !!surah.number && !!surah.name,
      hasAudio: !!surah.serverLink,
      hasReciter: !!surah.reciterId && !!surah.reciterName,
    };
  }

  /**
   * Resolves the reciter data to use for a given surah.
   * Priority: surah's own reciter > fallback default > current reciter.
   */
  static resolveReciterData(
    surah: Surah,
    currentReciter: { id: number; name: string },
    isSpecificReciter: boolean,
  ): { id: number; name: string } {
    if (surah.reciterId && surah.reciterName) {
      return { id: surah.reciterId, name: surah.reciterName };
    }
    if (isSpecificReciter) {
      return { id: 7, name: "مشاري راشد العفاسي" };
    }
    return { id: currentReciter.id, name: currentReciter.name };
  }
}

export default AudioPlayerService;
