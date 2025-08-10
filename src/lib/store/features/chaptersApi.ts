import { newVersionApiSlice } from "../services/newVersionApiSlice";

export const chaptersApi = newVersionApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChapters: builder.query({
      query: () => `/chapters`,
    }),
    getChapter: builder.query({
      query: (id) => `/chapters/${id}`,
    }),
    getChapterInfo: builder.query({
      query: (id) => `/chapters/${id}/info`,
    }),
  }),
});

export const {
  useGetChaptersQuery,
  useGetChapterInfoQuery,
  useGetChapterQuery,
} = chaptersApi;
