import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface KhatmaState { 
  khatmaPagesRange: string;
  khatmaBookmarkIndex: number;
  khatmaId: string;
  isKhatmaActive: boolean;
}

export const initialState: KhatmaState = {
  khatmaPagesRange: "",
  khatmaBookmarkIndex: 0,
  khatmaId: "",
  isKhatmaActive: false,
};

const khatmaSlice = createSlice({
  name: "khatma",
  initialState,
  reducers: {
    setKhatmaPages(state, action: PayloadAction<string>) {
      state.khatmaPagesRange = action.payload;
    },
    setKhatmaBookmark(
      state,
      action: PayloadAction<number>,
    ) {
      state.khatmaBookmarkIndex = action.payload;
    },
    setKhatmaData(state, action: PayloadAction<{ pagesRange: string; bookmarkIndex: number; khatmaId: string; isKhatmaActive: boolean }>) {
      state.khatmaPagesRange = action.payload.pagesRange;
      state.khatmaBookmarkIndex = action.payload.bookmarkIndex;
      state.khatmaId = action.payload.khatmaId;
      state.isKhatmaActive = action.payload.isKhatmaActive;
    }
  },
});

export const { setKhatmaPages, setKhatmaBookmark, setKhatmaData } = khatmaSlice.actions;

export default khatmaSlice.reducer;