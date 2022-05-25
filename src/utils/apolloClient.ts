import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { store } from 'redux/store'

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
})

const authLink = setContext((_, { headers }) => {
  const state = store.getState()
  const signature = state?.web3?.auth?.signature

  return {
    headers: {
      ...headers,
      authorization: signature ? `Bearer ${signature}` : '',
    },
  }
})

/**
 * Creates a new Apollo client instance.
 */
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        fields: {
          txHistory: {
            keyArgs: false,
            merge: (existing = {}, incoming) => {
              if (incoming.count === existing?.events?.length) return existing
              return {
                count: incoming.count,
                events: [...(existing.events || []), ...incoming.events],
              }
            },
          },
        },
      },
    },
  }),
})

export default client
