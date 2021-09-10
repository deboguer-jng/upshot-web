import { gql } from '@apollo/client'

/**
 * Get top collections
 *
 * Returns the timestamp & market caps for all collections.
 */

export type GetTopCollectionsData = {
  collections: {
    assetSets: {
      timeSeries: {
        timestamp: string
        marketCap: string
      } | null
    }
  }
}

export type GetTopCollectionsVars = {}

export const GET_TOP_COLLECTIONS = gql`
  {
    collections {
      assetSets {
        timeSeries {
          timestamp
          marketCap
        }
      }
    }
  }
`
