import { apiSlice } from "../services/apiSlice";

import type { Reciter } from "@/types/reciter";

export const quranApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllRectitationsData: builder.query({
      query: ({
        language,
        reciterId,
        surahId,
      }: {
        language: string;
        reciterId?: number;
        surahId?: number;
      }) => {
        const params = new URLSearchParams({
          language,
        });
        if (reciterId) {
          params.append("reciter", reciterId.toString());
        }
        if (surahId) {
          params.append("surah", surahId.toString());
        }
        return `/reciters?${params}`;
      },
      transformResponse: (res: { reciters: Reciter[] }) => res.reciters,
    }),
    getAllRadios: builder.query({
      query: ({ language }: { language: string }) => {
        const params = new URLSearchParams({
          language,
        });
        return `/radios?${params}`;
      },
    }),
    getAllTafsirs: builder.query({
      query: ({ language }: { language: string }) => {
        const params = new URLSearchParams({
          language,
        });
        return `/tafsir?${params}`;
      },
    }),
    getTadbors: builder.query({
      query: ({ language, suraId }: { language: string; suraId?: number }) => {
        const params = new URLSearchParams({
          language,
        });
        if (suraId) {
          params.append("surah", suraId.toString());
        }
        return `/tadbor?${params}`;
      },
    }),
    getRiwayat: builder.query({
      query: ({ language }: { language: string }) => {
        const params = new URLSearchParams({
          language,
        });
        return `/riwayat?${params}`;
      },
    }),
  }),
});

export const {
  useGetAllRectitationsDataQuery,
  useGetAllRadiosQuery,
  useGetAllTafsirsQuery,
  useGetTadborsQuery,
  useGetRiwayatQuery,
} = quranApi;
