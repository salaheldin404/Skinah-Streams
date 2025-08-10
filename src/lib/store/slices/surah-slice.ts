import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { LastRead } from "@/types/surah";

interface SurahState {
  lastRead: LastRead | null;
  saveMarkRead: boolean;
  clickedVerse: string | null;
  surahInfo: {
    name: string;
    id: number;
  };
  goToVerse: string | null;
}

export const initialState: SurahState = {
  lastRead: null,
  saveMarkRead: false,
  clickedVerse: null,
  surahInfo: {
    name: "",
    id: 0,
  },
  goToVerse: null,
};
const surahSlice = createSlice({
  name: "surah",
  initialState,
  reducers: {
    setSurahInfo: (
      state,
      action: PayloadAction<{ name: string; id: number }>
    ) => {
      state.surahInfo = action.payload;
    },
    setClickedVerse(state, action: PayloadAction<string | null>) {
      state.clickedVerse = action.payload;
    },
    setLastRead(state, action: PayloadAction<LastRead | null>) {
      state.lastRead = action.payload;
    },
    setSaveMarkRead(state, action: PayloadAction<boolean>) {
      state.saveMarkRead = action.payload;
    },
    setGoToVerse(state, action: PayloadAction<string | null>) {
      state.goToVerse = action.payload;
    },
  },
});

export const {
  setSurahInfo,
  setClickedVerse,
  setLastRead,
  setSaveMarkRead,
  setGoToVerse,
} = surahSlice.actions;
export const surahReducer = surahSlice.reducer;
