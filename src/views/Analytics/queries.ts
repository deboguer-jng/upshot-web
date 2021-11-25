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
    assetSets: {
      name: string
      id: number
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
      sevenDayMCChange: number
      volume: string
    }[]
  }
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
      assetSets {
        name
        id
        volume
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
        sevenDayMCChange
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
    assetSets: {
      id: number
      name?: string
      imageUrl?: string
      average?: string
      floor?: string
      volume?: string
    }[]
  }
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
      assetSets {
        id
        name
        imageUrl
        average
        floor
        volume
      }
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
        timestamp: number
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
          timestamp
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
      collection: {
        id: number
      }
    }
  }[]
}

/**
 * Get top collections for explore panel
 * @see TopCollectionsChart
 */

export type GetExploreCollectionsVars = {
  metric: string
  limit: number
  offset: number
}

export type GetExploreCollectionsData = {
  orderedCollectionsByMetricSearch: {
    count: number
    assetSets: {
      id: number
      name: string
      imageUrl?: string
      average: string
      floor: string
      totalVolume: string
      sevenDayFloorChange: number
    }[]
  }
}

export const GET_EXPLORE_COLLECTIONS = gql`
  query GetTopCollections(
    $metric: EOrderedAssetSetMetric!
    $limit: OneToHundredInt!
    $offset: Int!
  ) {
    orderedCollectionsByMetricSearch(
      metric: $metric
      limit: $limit
      offset: $offset
    ) {
      count
      assetSets {
        id
        name
        imageUrl
        average
        floor
        totalVolume
        sevenDayFloorChange
      }
    }
  }
`

export const GET_TOP_SALES = gql`
  query TopSales(
    $windowSize: ETimeWindow!
    $limit: OneToHundredInt!
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
        collection {
          id
        }
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
      id: number
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
        id
        name
        sevenDayMCChange
        totalVolume
      }
    }
  }
`

/**
 * Get Top Collectors
 * @see Top Collectors
 */
export type GetTopCollectorsVars = {
  limit: number
  offset: number
}

export type GetTopCollectorsData = {
  getOwnersByWhaleness: {
    count: number
    owners: {
      username: string
      addresses: string[]
      ownedAssets: {
        assets: {
          id: string
          name: string
          creatorAddress: string
          creatorUsername: string
          rarity
          latestAppraisal: {
            estimatedPrice: number
          }
          previewImageUrl: string | undefined
          mediaUrl: string
          tokenId
          contractAddress: string
          collection: {
            id: number
            name: string
          }
        }
      }
    }[]
  }[]
}

export const GET_TOP_COLLECTORS = gql`
  query GetTopCollectors($limit: OneToHundredInt!, $offset: Int) {
    getOwnersByWhaleness(limit: $limit, offset: $offset) {
      count
      owners {
        username
        addresses
        ownedAssets(notable: true, limit: 10, offset: 0) {
          assets {
            id
            name
            creatorAddress
            creatorUsername
            rarity
            latestAppraisal {
              estimatedPrice
            }
            mediaUrl
            tokenId
            contractAddress
            collection {
              id
              name
            }
            previewImageUrl
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
  id?: number
  limit: number
  assetId?: String
}

export type GetCollectorsData = {
  getOwnersByWhaleness: {
    count: number
    owners: {
      username: string
      addresses: string[]
      firstAssetPurchaseTime: number
      avgHoldTime: number
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
  query GetCollectors($id: Int, $limit: OneToHundredInt!, $assetId: String) {
    getOwnersByWhaleness(
      collectionId: $id
      limit: $limit
      offset: 0
      assetId: $assetId
    ) {
      count
      owners {
        username
        addresses
        firstAssetPurchaseTime
        avgHoldTime
        ownedAssets(collectionId: $id, notable: true, limit: 10) {
          count
          assets {
            id
            previewImageUrl
          }
        }
        extraCollections(limit: 10, collectionId: $id) {
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

/**
 * Get Previous Owners
 * @see Previous Owners
 */
export type GetPreviousOwnersVars = {
  id?: number
  limit: number
  assetId?: String
}

export type GetPreviousOwnersData = {
  getOwnersByWhaleness: {
    count: number
    owners: {
      username: string
      addresses: string[]
      firstAssetPurchaseTime: number
      avgHoldTime: number
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

export const GET_PREVIOUS_OWNERS = gql`
  query GetPreviousOwners(
    $id: Int
    $limit: OneToHundredInt!
    $assetId: String
  ) {
    getOwnersByWhaleness(limit: $limit, offset: 0, assetId: $assetId) {
      count
      owners {
        username
        addresses
        firstAssetPurchaseTime(collectionId: $id)
        avgHoldTime(collectionId: $id)
        ownedAssets(collectionId: $id, notable: true, limit: 10) {
          count
          assets {
            id
            previewImageUrl
          }
        }
        extraCollections(limit: 10, collectionId: $id) {
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
