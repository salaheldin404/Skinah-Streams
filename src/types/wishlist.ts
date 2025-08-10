export interface ReciterWishlist {
  reciter_name: string;
  reciter_id: number;
  reciter_image: string;
  mushaf_name: string;
  mushaf_id: number;
}

export interface SurahWishlist {
  surah_name: string;
  surah_id: number;
  reciter_name: string;
  reciter_id: number;
  mushaf_name: string;
  mushaf_id: string | number;
}
