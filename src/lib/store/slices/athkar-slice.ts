import { getNextExpirationDate, isAthkarExpired } from "@/lib/utils/hisn";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AthkarState {
  expirationDate: string;
  "morning-athkar": (number | undefined)[];
  "evening-athkar": (number | undefined)[];
  "post-prayer-athkar": (number | undefined)[];
  tasabih: (number | undefined)[];
  "sleep-athkar": (number | undefined)[];
  "waking-up-athkar": (number | undefined)[];
  "quranic-duas": (number | undefined)[];
  "prophets-duas": (number | undefined)[];
}

export const initialState: AthkarState = {
  expirationDate: getNextExpirationDate(),
  "morning-athkar": [],
  "evening-athkar": [],
  "post-prayer-athkar": [],
  tasabih: [],
  "sleep-athkar": [],
  "waking-up-athkar": [],
  "quranic-duas": [],
  "prophets-duas": [],
};
export type AthkarSlug = keyof Omit<AthkarState, "expirationDate">;

const athkarSlice = createSlice({
  name: "athkar",
  initialState,
  reducers: {
    setAthkarCount: (
      state,
      action: PayloadAction<{ slug: AthkarSlug; index: number; count: number }>
    ) => {
      const { slug, index, count } = action.payload;
      // This check ensures we don't try to access a non-existent key.
      if (slug in state) {
        state[slug][index] = count;
      }
    },
    resetAthkar: () => {
      // Return a new state object to ensure a full reset
      return {
        ...initialState,
        expirationDate: getNextExpirationDate(),
      };
    },
    checkAndResetIfExpired: (state) => {
      if (isAthkarExpired(state.expirationDate)) {
        return {
          ...initialState,
          expirationDate: getNextExpirationDate(),
        };
      }
    },
    resetCustomAthkar: (state, action: PayloadAction<AthkarSlug>) => {
      state[action.payload] = [];
    },
    resetCustomCardAthkar: (
      state,
      action: PayloadAction<{ slug: AthkarSlug; index: number }>
    ) => {
      const { slug, index } = action.payload;
      state[slug][index] = undefined;
    },
  },
});

export const {
  setAthkarCount,
  checkAndResetIfExpired,
  resetAthkar,
  resetCustomAthkar,
  resetCustomCardAthkar,
} = athkarSlice.actions;

export default athkarSlice.reducer;
