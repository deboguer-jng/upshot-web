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
    ceil: string
    floor: string
    size: string
    average: string
    volume: string
    totalVolume: string
    marketCap: string
    numCollectors: number
    timeSeries?: {
      average: string
      timestamp: number
    }[]
    latestStats: {
      weekFloorChange: number
    }
  }
}

export const GET_COLLECTION = gql`
  query GetCollectionById($id: Int!) {
    collectionById(id: $id) {
      name
      description
      imageUrl
      ceil
      floor
      size
      average
      volume
      totalVolume
      marketCap
      numCollectors
      timeSeries {
        average
        timestamp
      }
      latestStats {
        weekFloorChange
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
