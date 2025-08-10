import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api/v4",
  credentials: "include",
});

// const baseQueryWithReauth: BaseQueryFn<
//   string | FetchArgs,
//   unknown,
//   FetchBaseQueryError
// > = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);

//   // Handle token expiration
//   if (result.error?.status === 401 || result.error?.status === 403) {
//     console.log("Access token expired or invalid, refreshing...");

//     // Invalidate cached token
//     invalidateTokenCache();

//     try {
//       const newAccessToken = await getAccessToken();
//       if (newAccessToken) {
//         console.log("Token refreshed successfully, retrying request...");
//         // Retry the original request with new token
//         result = await baseQuery(args, api, extraOptions);
//       } else {
//         console.error("Failed to refresh token");
//       }
//     } catch (error) {
//       console.error("Error during token refresh:", error);
//       invalidateTokenCache();
//     }
//   }

//   return result;
// };

export const newVersionApiSlice = createApi({
  reducerPath: "apiv2",
  baseQuery,
  endpoints: () => ({}),
});
