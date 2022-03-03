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