import { newVersionApiSlice } from "../services/newVersionApiSlice";

export const quranDataApi = newVersionApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUthmaniScript: builder.query({
      query: ({ params }: { params?: string }) =>
        `/quran/verses/uthmani?${params}`,
    }),
  }),
});

export const { useGetUthmaniScriptQuery } = quranDataApi;
