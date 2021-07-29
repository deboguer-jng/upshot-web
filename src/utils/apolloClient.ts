import { ApolloClient, InMemoryCache } from '@apollo/client'

/**
 * GraphQL endpoints by application environment.
 */
const endpointByEnvironment = {
  production: process.env.NEXT_PUBLIC_PRODUCTION_GRAPHQL_ENDPOINT!,
  staging: process.env.NEXT_PUBLIC_PRODUCTION_GRAPHQL_ENDPOINT!,
  development: process.env.NEXT_PUBLIC_PRODUCTION_GRAPHQL_ENDPOINT!,
}

/**
 * Creates a new Apollo client instance.
 */
const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: endpointByEnvironment[process.env.NEXT_PUBLIC_ENV!],
})

export default client
