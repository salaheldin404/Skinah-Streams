import { newVersionApiSlice } from "../services/newVersionApiSlice";

export const versesApi = newVersionApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVersesChapter: builder.query({
      query: ({ chapterId, params }: { chapterId: number; params?: string }) =>
        `/verses/by_chapter/${chapterId}?${params}`,
    }),
    getVersesPage: builder.query({
      query: ({
        pageNumber,
        params,
      }: {
        pageNumber: number;
        params?: string;
      }) => `/verses/by_page/${pageNumber}?${params}`,
    }),
    getVersesJuz: builder.query({
      query: ({ juzNumber, params }: { juzNumber: number; params?: string }) =>
        `/verses/by_juz/${juzNumber}?${params}`,
    }),
    getVerseKey: builder.query({
      query: ({ verseKey, params }: { verseKey: string; params?: string }) =>
        `/verses/by_key/${verseKey}?${params}`,
    }),
  }),
});

export const {
  useGetVersesChapterQuery,
  useGetVersesPageQuery,
  useGetVersesJuzQuery,
  useGetVerseKeyQuery,
} = versesApi;
