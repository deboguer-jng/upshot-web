import { ApolloClient, InMemoryCache } from '@apollo/client'
import { relayStylePagination } from '@apollo/client/utilities'

/**
 * Creates a new Apollo client instance.
 */
const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        fields: {
          txHistory: {
            keyArgs: ['limit'],
            merge: (existing = {}, incoming) => {
              if (incoming.count === existing?.events?.length) return existing
              return { 
                count: incoming.count,
                events: [
                  ...(existing.events || []),
                  ...incoming.events,
                ]}
            }
          },
        },
      },
    },
  }),
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
})

export default client
