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
    athAverage: {
      value: string
    }
    atlAverage: {
      value: string
    }
    athFloor: {
      value: string
    }
    atlFloor: {
      value: string
    }
    athVolume: {
      value: string
    }
    atlVolume: {
      value: string
    }
    timeSeries?: TimeSeries[]
  }[]
}

export const GET_TOP_COLLECTIONS = gql`
  query GetTopCollections(
    $metric: EOrderedAssetSetMetric!
    $stringifiedCollectionIds: String
  ) {
    orderedCollectionsByMetricSearch(
      metric: $metric
      stringifiedCollectionIds: $stringifiedCollectionIds
      limit: 3
    ) {
      name
      athAverage {
        value
      }
      atlAverage {
        value
      }
      athFloor {
        value
      }
      atlFloor {
        value
      }
      athVolume {
        value
      }
      atlVolume {
        value
      }
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
  name?: string
}

export type GetCollectionAvgPriceData = {
  orderedCollectionsByMetricSearch: {
    id: number
    name?: string
    imageUrl?: string
    average?: string
  }[]
}

export const GET_COLLECTION_AVG_PRICE = gql`
  query GetCollectionAvgPrice(
    $metric: EOrderedAssetSetMetric!
    $limit: OneToHundredInt!
    $name: String
  ) {
    orderedCollectionsByMetricSearch(
      metric: $metric
      limit: $limit
      name: $name
    ) {
      id
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
  collectionId?: number
}

export type GetExploreNFTsData = {
  assetGlobalSearch: {
    count: number
    assets: {
      id: string
      name: string
      previewImageUrl?: string
      mediaUrl: string
      totalSaleCount: number
      priceChangeFromFirstSale: number
      lastSale: {
        ethSalePrice: string
      }
    }[]
  }
}

export const GET_EXPLORE_NFTS = gql`
  query GetExploreNFTs(
    $limit: OneToHundredInt!
    $offset: Int!
    $searchTerm: String
    $collectionId: Int
  ) {
    assetGlobalSearch(
      limit: $limit
      offset: $offset
      searchTerm: $searchTerm
      collectionId: $collectionId
    ) {
      count
      assets {
        id
        name
        previewImageUrl
        mediaUrl
        totalSaleCount
        priceChangeFromFirstSale
        lastSale {
          ethSalePrice
        }
      }
    }
  }
`

/**
 * Get Top Selling NFTs
 * @see TopSellingNFTs
 */
export type GetTopSalesVars = {
  windowSize: string
  limit: number
  collectionId?: number
}

export type GetTopSalesData = {
  topSales: {
    txFromAddress: string
    txToAddress: string
    txAt: number
    price: string
    asset: {
      id: string
      contractAddress: string
      previewImageUrl?: string
      mediaUrl: string
      rarity: number
    }
  }[]
}

export const GET_TOP_SALES = gql`
  query TopSales(
    $windowSize: ETimeWindow!
    $limit: OneToHundredInt
    $collectionId: Int
  ) {
    topSales(
      windowSize: $windowSize
      limit: $limit
      collectionId: $collectionId
    ) {
      txFromAddress
      txToAddress
      txAt
      price
      asset {
        id
        contractAddress
        previewImageUrl
        mediaUrl
        rarity
      }
    }
  }
`

/**
 * Get 7-day Market Cap Change
 * @see TreeMapMarketCap
 */
export type GetSevenDayMCChangeVars = {
  limit: number
}

export type GetSevenDayMCChangeData = {
  collections: {
    assetSets: {
      name: string
      sevenDayMCChange: number
      totalVolume: string
    }[]
  }
}

export const GET_SEVEN_DAY_MC_CHANGE = gql`
  query SevenDayMCChange($limit: Int) {
    collections(limit: $limit) {
      assetSets {
        name
        sevenDayMCChange
        totalVolume
      }
    }
  }
`

/**
 * Get Top Collectors
 * @see TopCollectors
 */
export type GetTopCollectorsVars = {
  limit: number
}

export type GetTopCollectorsData = {
  getOwnersByWhaleness: {
    count: number
    owners: {
      username: string
      addresses: string[]
      totalAssetAppraisedValue: string
      extraCollections: {
        collectionAssetCounts: {
          count: number
          collection: {
            id: number
            name: string
            imageUrl: string
          }
        }[]
      }
    }[]
  }
}

export const GET_TOP_COLLECTORS = gql`
  query GetTopCollectors($limit: OneToHundredInt!) {
    getOwnersByWhaleness(limit: $limit, offset: 0) {
      count
      owners {
        username
        addresses
        totalAssetAppraisedValue
        extraCollections(limit: 10) {
          collectionAssetCounts {
            collection {
              id
              name
              imageUrl
            }
          }
        }
      }
    }
  }
`

/**
 * Get Collectors
 * @see Collectors
 */
export type GetCollectorsVars = {
  id: number
  limit: number
}

export type GetCollectorsData = {
  getOwnersByWhaleness: {
    count: number
    owners: {
      username: string
      addresses: string[]
      firstAssetPurchaseTime: number
      avgHoldTime: number
      totalAssetAppraisedValue: string
      ownedAssets: {
        count: number
        assets: {
          id: string
          previewImageUrl: string
        }[]
      }
      extraCollections: {
        collectionAssetCounts: {
          count: number
          collection: {
            id: number
            name: string
            imageUrl: string
          }
        }[]
      }
    }[]
  }
}

export const GET_COLLECTORS = gql`
  query GetCollectors($id: Int, $limit: OneToHundredInt!) {
    getOwnersByWhaleness(collectionId: $id, limit: $limit, offset: 0) {
      count
      owners {
        username
        addresses
        firstAssetPurchaseTime
        avgHoldTime
        totalAssetAppraisedValue(collectionId: $id)
        ownedAssets(collectionId: $id, notable: true, limit: 10) {
          count
          assets {
            id
            previewImageUrl
          }
        }
        extraCollections(limit: 10) {
          collectionAssetCounts {
            count
            collection {
              id
              name
              imageUrl
            }
          }
        }
      }
    }
  }
`
