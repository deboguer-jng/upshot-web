import { gql } from '@apollo/client'

/**
 * Get NavBar collections
 * @see NavBar onFocus() handler
 */
export type GetNavBarCollectionsVars = {}

export type GetNavBarCollectionsData = {
  collections: {
    assetSets: {
      id: number
      name: string
    }[]
  }
}

export const GET_NAV_BAR_COLLECTIONS = gql`
  query GetNavBarCollections($limit: OneToHundredInt!) {
    collections(limit: $limit) {
      assetSets {
        id
        name
      }
    }
  }
`
