import { gql } from '@apollo/client'

/**
 * Get Collection
 */

export type GetCollectionVars = {
  id?: number
}

export type GetCollectionData = {
  collectionById: {
    name: string
    description: string
    imageUrl: string
    size: string
    isAppraised: boolean
    numCollectors: number
    timeSeries?: {
      average: string
      timestamp: number
    }[]
    latestStats: {
      weekFloorChange: number
      floor: string
      marketCap: string
      totalWeiVolume: string
      average: string
      pastWeekWeiVolume: string
    }
  }
}

export const GET_COLLECTION = gql`
  query GetCollectionById($id: Int!) {
    collectionById(id: $id) {
      name
      description
      isAppraised
      imageUrl
      size
      numCollectors
      timeSeries {
        average
        timestamp
      }
      latestStats {
        weekFloorChange
        floor
        marketCap
        totalWeiVolume
        average
        pastWeekWeiVolume
      }
    }
  }
`

/**
 * Get All Collection Sales
 */

export type GetAllCollectionSalesVars = {
  id?: number
}

export type GetAllCollectionSalesData = {
  collectionById: {
    allSaleEvents?: {
      millisecondsTimestamp: number
      ethFloatPrice: number
      id: string
      asset: {
        tokenId: string
      }
      assetEvent: {
        txToAddress: string
      }
    }[]
  }
}

export const GET_ALL_COLLECTION_SALES = gql`
  query GetAllCollectionSales($id: Int!) {
    collectionById(id: $id) {
      allSaleEvents(windowSize: MONTH) {
        millisecondsTimestamp
        ethFloatPrice
        id
        asset {
          tokenId
        }
        assetEvent {
          txToAddress
        }
      }
    }
  }
`

/**
 * Get Collection Traits
 */
export type GetCollectionTraitsVars = {
  id?: number
}

export type GetCollectionTraitsData = {
  collectionById: {
    traitGroups: {
      traitType: string
      traits: {
        id: number
        value: string
        rarity: number
      }[]
    }[]
  }
}

export const GET_COLLECTION_TRAITS = gql`
  query GetCollectionById($id: Int!) {
    collectionById(id: $id) {
      traitGroups {
        traitType
        traits(limit: 1000, offset: 0) {
          id
          value
          rarity
        }
      }
    }
  }
`
