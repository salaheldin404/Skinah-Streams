import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuranFont {
  style: string;
  size: number;
}

const initialState = {
  quranFont: {
    style: "uthmani",
    size: 3,
  },
  ayahNumberStyle: "ayah-2",
};

const fontSlice = createSlice({
  name: "font",
  initialState,
  reducers: {
    setQuranFont: (state, action: PayloadAction<QuranFont>) => {
      state.quranFont = action.payload;
    },
    incrementSize: (state) => {
      state.quranFont.size += 1;
    },

    decrementSize: (state) => {
      if (state.quranFont.size > 1) {
        state.quranFont.size -= 1;
      }
    },
    setAyahNumberStyle: (state, action: PayloadAction<string>) => {
      state.ayahNumberStyle = action.payload;
    },
  },
});

export const {
  setQuranFont,
  incrementSize,
  decrementSize,
  setAyahNumberStyle,
} = fontSlice.actions;
export default fontSlice.reducer;
