import { Surah } from "@/types/surah";
import { ReciterWishlist } from "@/types/wishlist";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  reciters: ReciterWishlist[];
  surahs: Surah[];
}

export const initialState: WishlistState = {
  reciters: [],
  surahs: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addReciterToWishlist: (state, action: PayloadAction<ReciterWishlist>) => {
      const reciters = state.reciters;
      const newReciter = action.payload;
      const existReciter = reciters.find(
        (reciter) =>
          reciter.reciter_id === newReciter.reciter_id &&
          reciter.mushaf_id === newReciter.mushaf_id
      );
      if (!existReciter) {
        state.reciters.push(newReciter);
      }
    },
    addSurahToWishlist: (state, action: PayloadAction<Surah>) => {
      const surahs = state.surahs;
      const newSurah = action.payload;
      const existSurah = surahs.find(
        (surah) =>
          surah.number === newSurah.number &&
          surah.reciterId === newSurah.reciterId
      );
      if (!existSurah) {
        state.surahs.push(newSurah);
      }
    },
    removeReciterFromWishlist: (
      state,
      action: PayloadAction<{ reciterId: number; mushafId: number | string }>
    ) => {
      const existIndex = state.reciters.findIndex(
        (reciter) =>
          reciter.reciter_id === action.payload.reciterId &&
          reciter.mushaf_id === action.payload.mushafId
      );
      if (existIndex !== -1) {
        state.reciters.splice(existIndex, 1);
      }
    },
    removeSurahFromWishlist: (
      state,
      action: PayloadAction<{
        surahId: number;
        reciterId: number;
        mushafId: number | string;
      }>
    ) => {
      const existIndex = state.surahs.findIndex(
        (surah) =>
          surah.number === action.payload.surahId &&
          surah.reciterId === action.payload.reciterId &&
          surah.mushafId === action.payload.mushafId
      );
      if (existIndex !== -1) {
        state.surahs.splice(existIndex, 1);
      }
    },
  },
});

export const {
  addReciterToWishlist,
  addSurahToWishlist,
  removeReciterFromWishlist,
  removeSurahFromWishlist,
} = wishlistSlice.actions;
export const wishlistReducer = wishlistSlice.reducer;
