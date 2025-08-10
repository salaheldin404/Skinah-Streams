export interface Surah {
  number: number;
  name: string;
  shortName: string;
  revelationType: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  serverLink?: string;
  reciterName?: string;
  reciterId?: number;
  mushafName?: string;
  mushafId?: string | number;
}

export interface LastRead {
  chapter_id: number | string;
  verse_number: number;
  verse_key: string;
  page_number: number;
  qpc_uthmani_hafs: string;
}
