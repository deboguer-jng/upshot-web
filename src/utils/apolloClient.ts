import { ApolloClient, InMemoryCache } from '@apollo/client'

/**
 * Creates a new Apollo client instance.
 */
const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getUser: {
            keyArgs: ['id', 'userAddress'],
            merge(existing = {}, incoming) {
              return { ...existing, ...incoming }
            },
          },
        },
      },
    },
  }),
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
})

export default client
