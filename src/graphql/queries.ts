import { gql } from '@apollo/client'

/**
 * Get top collections
 * @see Landing Chart
 */
export type GetTopCollectionsVars = {}

export type TimeSeries = {
  timestamp: number
  average: string
  marketCap: string
  floor: string
}

export type GetTopCollectionsData = {
  orderedCollectionsByMetricOrSearch: {
    name: string
    timeSeries: TimeSeries[]
  }[]
}

export const GET_TOP_COLLECTIONS = gql`
  query GetTopCollections($metric: EOrderedAssetSetMetric!) {
    orderedCollectionsByMetricOrSearch(metric: $metric, limit: 3) {
      name
      timeSeries {
        timestamp
        average
        marketCap
        floor
      }
    }
  }
`

/**
 * Collection Avg. Price
 * @see Landing Collection Avg. Price panel
 */
export type GetCollectionAvgPriceVars = {
  metric: string
  limit: number
}

export type GetCollectionAvgPriceData = {
  orderedCollectionsByMetricOrSearch: {
    name?: string
    imageUrl?: string
    average?: string
  }[]
}

export const GET_COLLECTION_AVG_PRICE = gql`
  query GetCollectionAvgPrice(
    $metric: EOrderedAssetSetMetric!
    $limit: OneToHundredInt!
  ) {
    orderedCollectionsByMetricOrSearch(metric: $metric, limit: $limit) {
      name
      imageUrl
      average
    }
  }
`

/**
 * Explore NFTs
 * @see Landing Explore Panel
 */
export type GetExploreNFTsVars = {
  limit: number
  offset: number
  searchTerm: string
}

export type GetExploreNFTsData = {
  assetGlobalSearch: {
    count: number
    assets: {
      name: string
      previewImageUrl: string
      totalSaleCount: number
      priceChangeFromFirstSale: number
      latestMarketPrice: string
    }[]
  }
}

export const GET_EXPLORE_NFTS = gql`
  query GetExploreNFTs(
    $limit: OneToHundredInt!
    $offset: Int!
    $searchTerm: String
  ) {
    assetGlobalSearch(limit: $limit, offset: $offset, searchTerm: $searchTerm) {
      count
      assets {
        name
        previewImageUrl
        totalSaleCount
        priceChangeFromFirstSale
      }
    }
  }
`
