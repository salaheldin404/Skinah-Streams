import { ReciterAudio } from "@/types/reciter";
import { newVersionApiSlice } from "../services/newVersionApiSlice";
import { AudioData } from "@/types/audio";

export const audioApi = newVersionApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAudioChapter: builder.query({
      query: ({
        reciterId,
        chapterId,
        segments,
      }: {
        reciterId: number;
        chapterId: number;
        segments?: boolean;
      }) => {
        const params = new URLSearchParams();
        if (segments) {
          params.append("segments", "true");
        }
        return `/chapter_recitations/${reciterId}/${chapterId}?${params}`;
      },
      transformResponse: (res: { audio_file: AudioData }) => {
        return res.audio_file;
      },
    }),
    getAllChaptersAudio: builder.query({
      query: ({ reciterId }: { reciterId: number }) =>
        `/chapter_recitations/${reciterId}`,
    }),
    getAllRectitations: builder.query({
      query: ({ language }: { language: string }) => {
        const params = new URLSearchParams({
          language,
        });

        return `/resources/recitations?${params}`;
      },
      transformResponse: (res: { recitations: ReciterAudio[] }) =>
        res.recitations,
    }),
    getAllAudioOfReciter: builder.query({
      query: ({ reciterId }: { reciterId: number }) =>
        `/quran/recitations/${reciterId}`,
    }),
    getAyaRecitationsSurah: builder.query({
      query: ({
        reciterId,
        chapterId,
      }: {
        reciterId: number;
        chapterId: number;
      }) => `/recitations/${reciterId}/by_chapter/${chapterId}`,
    }),
  }),
});

export const {
  useGetAudioChapterQuery,
  useGetAllChaptersAudioQuery,
  useGetAllRectitationsQuery,
  useGetAllAudioOfReciterQuery,
  useGetAyaRecitationsSurahQuery,
} = audioApi;
