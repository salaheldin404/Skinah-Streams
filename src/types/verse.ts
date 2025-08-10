import { AudioResponse } from "./audio";
import { Segment } from "./segment";
import { Tafsir } from "./tafsir";
import { Translation } from "./translation";
import { Word } from "./word";

export interface Verse {
  id: number;
  verse_number: number;
  chapter_id: number | string;
  page_number: number;
  juz_number: number;
  hizb_number: number;
  rub_number: number;
  verse_key: string;
  verse_index: number;
  words: Word[];
  text_uthmani?: string;
  text_uthmani_simple?: string;
  text_uthmani_tajweed?: string;
  qpc_uthmani_hafs: string;
  text_imlaei?: string;
  text_imlaei_simple?: string;
  text_indopak?: string;
  sajdahNumber: null;
  sajdahType: null;
  image_url?: string;
  image_width?: number;
  v1_page?: number;
  v2_page?: number;
  code_v1?: string;
  code_v2?: string;
  translations?: Translation[];
  tafsirs?: Tafsir[];
  audio?: AudioResponse;
}
export interface VerseTiming {
  verse_key: string;
  timestamp_from: number;
  timestamp_to: number;
  duration: number;
  segments: Segment[];
}
