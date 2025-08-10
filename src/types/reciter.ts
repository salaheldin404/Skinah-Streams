export interface Reciter {
  id: number;
  name: string;
  moshaf: Moshaf[];
}

export interface ReciterAudio {
  id: number;
  reciter_name: string;
  style: string;
  translated_name: {
    language_name: string;
    name: string;
  };
}

export interface Moshaf {
  id: number;
  moshaf_type?: number;
  server?: string;
  surah_list?: string;
  surah_total?: number;
  name: string;
}
