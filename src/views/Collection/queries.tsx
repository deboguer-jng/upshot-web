import { gql } from '@apollo/client'

/**
 * Get Collection
 */

export type GetCollectionVars = {
  id: number
}

export type GetCollectionData = {
  collectionById: {
    name: string
    description: string
    imageUrl: string
    ceil: string
    size: string
    average: string
    totalVolume: string
    timeSeries?: {
      average: string
      timestamp: number
    }[]
  }
}

export const GET_COLLECTION = gql`
  query GetCollectionById($id: Int!) {
    collectionById(id: $id) {
      name
      description
      imageUrl
      ceil
      size
      average
      totalVolume
      timeSeries {
        average
        timestamp
      }
    }
  }
`
