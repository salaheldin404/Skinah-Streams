import {
  configureStore,
  combineReducers,
  createListenerMiddleware,
  isAnyOf,
  TypedStartListening,
} from "@reduxjs/toolkit";

import { apiSlice } from "./services/apiSlice";
import { newVersionApiSlice } from "./services/newVersionApiSlice";
import {
  audioReducer,
  setReciter,
  setLastPlay,
  setVolume,
  initialState as initialAudioState,
} from "./slices/audio-slice";

import {
  wishlistReducer,
  addReciterToWishlist,
  addSurahToWishlist,
  removeReciterFromWishlist,
  removeSurahFromWishlist,
  initialState as initialWishlistState,
} from "./slices/wishlist-slice";

import {
  surahReducer,
  setLastRead,
  initialState as initialSurahState,
} from "./slices/surah-slice";

import fontReducer, {
  setQuranFont,
  incrementSize,
  decrementSize,
  setAyahNumberStyle,
} from "./slices/font-slice";

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  [newVersionApiSlice.reducerPath]: newVersionApiSlice.reducer,
  audio: audioReducer,
  font: fontReducer,
  surah: surahReducer,
  wishlist: wishlistReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];

const listenerMiddleware = createListenerMiddleware();
type AppStartListening = TypedStartListening<RootState, AppDispatch>;
const startAppListening =
  listenerMiddleware.startListening as AppStartListening;
startAppListening({
  matcher: isAnyOf(
    setQuranFont,
    incrementSize,
    decrementSize,
    setAyahNumberStyle,
    setReciter,
    setLastRead,
    setLastPlay,
    setVolume,
    addReciterToWishlist,
    addSurahToWishlist,
    removeReciterFromWishlist,
    removeSurahFromWishlist
  ),
  effect: (action, listenerApi) => {
    console.log(`Action matched: ${action.type}. Persisting state...`);
    try {
      const state = listenerApi.getState(); // Get the latest state

      // Create an object with only the state slices you want to persist.
      const stateToPersist = {
        font: state.font,
        audio: {
          reciter: state.audio.reciter,
          lastPlay: state.audio.lastPlay,
          volume: state.audio.volume,
        },
        surah: {
          lastRead: state.surah.lastRead,
        },
        wishlist: {
          reciters: state.wishlist.reciters,
          surahs: state.wishlist.surahs,
        },
      };

      const serializedState = JSON.stringify(stateToPersist);
      if (typeof window !== "undefined") {
        localStorage.setItem("userSettings", serializedState);
      }
    } catch (e) {
      console.warn("Could not save state to localStorage", e);
    }
  },
});

const reHydrateStore = (): Partial<RootState> | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const serializedState = localStorage.getItem("userSettings");

    if (serializedState === null) {
      return undefined;
    }
    const loadedState = JSON.parse(serializedState) as Partial<RootState>;

    if (loadedState.audio) {
      loadedState.audio = {
        ...initialAudioState, // Start with the complete default state
        ...loadedState.audio, // Override with the loaded 'reciter'
      };
    }

    if (loadedState.surah) {
      loadedState.surah = {
        ...initialSurahState, // Start with the complete default state
        ...loadedState.surah, // Override with the loaded 'reciter'
      };
    }

    if (loadedState.wishlist) {
      loadedState.wishlist = {
        ...initialWishlistState, // Start with the complete default state
        ...loadedState.wishlist, // Override with the loaded 'reciter'
      };
    }
    return loadedState;
  } catch (e) {
    console.warn("Could not load state from localStorage", e);
    return undefined;
  }
};

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: reHydrateStore(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false })
        .concat(apiSlice.middleware)
        .concat(newVersionApiSlice.middleware)
        .prepend(listenerMiddleware.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });
};

export const store = makeStore();
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
