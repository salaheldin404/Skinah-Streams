import { newVersionApiSlice } from "../services/newVersionApiSlice";
import type { Search } from "@/types/search";
export const searchAPi = newVersionApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.query({
      query: ({ params }: { params?: string }) => `/search?${params}`,
      transformResponse: (res: { search: Search }) => res.search,
    }),
  }),
});

export const { useSearchQuery } = searchAPi;
