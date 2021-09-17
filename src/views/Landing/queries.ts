import { gql } from '@apollo/client'

/**
 * Get top collections
 * @see TopCollectionsChart
 */
export type GetTopCollectionsVars = {}

export type TimeSeries = {
  timestamp: number
  average: string
  marketCap: string
  floor: string
}

export type GetTopCollectionsData = {
  orderedCollectionsByMetricSearch: {
    name: string
    timeSeries: TimeSeries[]
  }[]
}

export const GET_TOP_COLLECTIONS = gql`
  query GetTopCollections($metric: EOrderedAssetSetMetric!) {
    orderedCollectionsByMetricSearch(metric: $metric, limit: 3) {
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
 * @see CollectionAvgPricePanel
 */
export type GetCollectionAvgPriceVars = {
  metric: string
  limit: number
}

export type GetCollectionAvgPriceData = {
  orderedCollectionsByMetricSearch: {
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
    orderedCollectionsByMetricSearch(metric: $metric, limit: $limit) {
      name
      imageUrl
      average
    }
  }
`

/**
 * Explore NFTs
 * @see ExplorePanel
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

/**
 * Top Selling NFTs
 * @see TopSellingNFTs
 */
export type GetTopSalesVars = {
  windowSize: string
  limit: number
}

export type GetTopSalesData = {
  topSales: {
    txFromAddress: string
    txToAddress: string
    txAt: number
    asset: {
      previewImageUrl: string
      latestMarketPrice: string
      rarity: number
    }
  }[]
}

export const GET_TOP_SALES = gql`
  query TopSales($windowSize: ETimeWindow!, $limit: OneToHundredInt) {
    topSales(windowSize: $windowSize, limit: $limit) {
      txFromAddress
      txToAddress
      txAt
      asset {
        previewImageUrl
        latestMarketPrice
        rarity
      }
    }
  }
`
