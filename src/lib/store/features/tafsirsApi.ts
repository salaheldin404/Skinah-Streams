import { Tafsir, TafsirData } from "@/types/tafsir";
import { newVersionApiSlice } from "../services/newVersionApiSlice";

export const tafsirsApi = newVersionApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTafsirSurah: builder.query({
      query: ({ surahId, id }: { surahId: number; id: number }) =>
        `/tafsirs/${id}/by_chapter/${surahId}`,
    }),
    getTafsirs: builder.query({
      query: () => `/resources/tafsirs?language=ar`,
      transformResponse: (res: { tafsirs: TafsirData[] }) => res.tafsirs,
    }),
    getTafsirAyah: builder.query({
      query: ({ ayahKey, id }: { ayahKey: string; id: number }) =>
        `/tafsirs/${id}/by_ayah/${ayahKey}?fields=text_qpc_hafs`,
      transformResponse: (res: { tafsir: Tafsir }) => res.tafsir,
    }),
  }),
});

export const {
  useGetTafsirSurahQuery,
  useGetTafsirsQuery,
  useGetTafsirAyahQuery,
} = tafsirsApi;
