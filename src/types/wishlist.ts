export interface ReciterWishlist {
  reciter_name: string;
  reciter_id: number;
  reciter_image: string;
  mushaf_name: string;
  mushaf_id: number;
}

export interface WishlistReciterDB {
  id: string;
  settingsId: string;
  reciterId: number;
  reciterName: string;
  reciterImage: string;
  mushafId: number;
  mushafName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WishlistSurahDB {
  id: string;
  surahId: number;
  settingsId: string;

  surahNumber: number;
  surahName: string;
  shortName: string;
  revelationType: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  url: string;
  reciterId: number;
  reciterName: string;
  mushafId: number;
  mushafName: string;
  createdAt: Date;
  updatedAt: Date;
}
