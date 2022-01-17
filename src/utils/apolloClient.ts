import { ApolloClient, InMemoryCache } from '@apollo/client'

/**
 * Creates a new Apollo client instance.
 */
const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
})

console.log(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT)

export default client
