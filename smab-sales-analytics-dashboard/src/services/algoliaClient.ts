import algoliasearch from 'algoliasearch';

// Create a wrapper that prevents empty queries from returning all results
const createSearchClient = (appId: string, apiKey: string) => {
  const client = algoliasearch(appId, apiKey);

  return {
    ...client,
    search: async (requests: any[]) => {
      // Modify requests to return empty results for empty queries
      const modifiedRequests = requests.map(request => {
        if (!request.params?.query?.trim()) {
          return {
            ...request,
            params: {
              ...request.params,
              query: ' ', // Space character returns no results instead of all
              hitsPerPage: 0
            }
          };
        }
        return request;
      });

      return client.search(modifiedRequests);
    }
  };
};

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!;

const algoliaClient = createSearchClient(appId, apiKey);
export default algoliaClient;
