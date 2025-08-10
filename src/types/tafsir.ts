export interface Tafsir {
  id?: number;
  resource_id?: number;
  text?: string;
  language_id?: string;
  verse_key?: string;
  verses?: Record<
    string,
    {
      id: number;
      text_qpc_hafs?: string;
    }
  >;
}

export interface TafsirData {
  id: number;
  authorName?: string;
  language_name: string;
  translated_name: {
    language_name: string;
    name: string;
  };
}
