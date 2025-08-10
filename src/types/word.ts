import { VerseTiming } from "./verse";

export interface Word {
  char_type_name: CharType;
  codeV1?: string;
  codeV2?: string;
  page_number?: number;
  // hizbNumber?: number;
  line_number?: number;
  position: number;
  location?: string;
  //   translation?: Translation;
  //   transliteration?: Transliteration;
  id?: number;
  text_uthmani?: string;
  text_indopak?: string;
  text_qpc_hafs: string;
  chapter_id: number | string;
  // highlight?: string | boolean;
  text?: string;
  //   audioUrl: $TsFixMe;
  // verse?: WordVerse;
}
export interface WordVerse {
  verseNumber: number;
  verseKey: string;
  chapterId: number | string;
  timestamps?: VerseTiming;
  translationsLabel: string;
  translationsCount: number;
}

export enum CharType {
  Word = "word",
  End = "end",
  Pause = "pause",
  Sajdah = "sajdah",
  RubElHizb = "rub-el-hizb",
}
