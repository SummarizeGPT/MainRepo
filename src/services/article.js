import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const sampleArticleUrl = 'https://example.com/';
export const unsupportedArticleMessage =
  'Live summaries are disabled in this preview. Try the example URL.';

export const articleApi = createApi({
  reducerPath: 'articleApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.BASE_URL }),
  endpoints: (builder) => ({
    getSummary: builder.query({
      queryFn: (articleUrl, _api, _options, fetchWithBQ) => {
        // Only fetch the checked-in response; never send the submitted URL.
        if (
          articleUrl !== sampleArticleUrl &&
          `${articleUrl}/` !== sampleArticleUrl
        ) {
          return { error: { status: 'CUSTOM_ERROR', error: unsupportedArticleMessage } };
        }

        return fetchWithBQ('demo-summary.json');
      },
    }),
  }),
});

export const { useLazyGetSummaryQuery } = articleApi;
