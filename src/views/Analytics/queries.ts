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

export enum TraitSortOption {
  RARITY,
  FLOOR,
}

export enum OrderDirection {
  DESC,
  ASC
}

export type GetTopCollectionsData = {
  orderedCollectionsByMetricSearch: {
    assetSets: {
      name: string
      id: number
      athAverageDailyWei: {
        value: string
      }
      atlAverageDailyWei: {
        value: string
      }
      athAverageWeeklyWei: {
        value: string
      }
      atlAverageWeeklyWei: {
        value: string
      }
      athVolumeDailyWei: {
        value: string
      }
      atlVolumeDailyWei: {
        value: string
      }
      athVolumeWeeklyWei: {
        value: string
      }
      atlVolumeWeeklyWei: {
        value: string
      }
      athFloor: {
        value: string
      }
      atlFloor: {
        value: string
      }
      latestStats: {
        volume: string
        weekCapChange: number
        pastWeekWeiVolume: string
        floor: number
        pastDayWeiAverage: string
        pastDayWeiVolume: string
      }
      timeSeries?: TimeSeries[]
    }[]
  }
}

export const GET_TOP_COLLECTIONS = gql`
  query GetTopCollections(
    $metric: EOrderedAssetSetMetric!
    $stringifiedCollectionIds: String
    $minTimestamp: Int!
  ) {
    orderedCollectionsByMetricSearch(
      metric: $metric
      stringifiedCollectionIds: $stringifiedCollectionIds
      limit: 5
      windowSize: WEEK
    ) {
      assetSets {
        name
        id
        latestStats {
          volume
        }
        athAverageDailyWei {
          value
        }
        atlAverageDailyWei {
          value
        }
        athAverageWeeklyWei {
          value
        }
        atlAverageWeeklyWei {
          value
        }
        athVolumeDailyWei {
          value
        }
        atlVolumeDailyWei {
          value
        }
        athVolumeWeeklyWei {
          value
        }
        atlVolumeWeeklyWei {
          value
        }
        athFloor {
          value
        }
        atlFloor {
          value
        }
        athFloor {
          value
        }
        atlFloor {
          value
        }
        timeSeries(minTimestamp: $minTimestamp, windowSize: WEEK) {
          timestamp
          average
          volume
          floor
        }
        latestStats {
          volume
          weekCapChange
          pastWeekWeiVolume
          floor
          pastDayWeiAverage
          pastDayWeiVolume
        }
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
  windowSize?: string
}

export type GetCollectionAvgPriceData = {
  orderedCollectionsByMetricSearch: {
    assetSets: {
      id: number
      name?: string
      imageUrl?: string
      latestStats: {
        floor: string
        pastDayWeiAverage: string
        pastDayWeiVolume: string
        pastWeekWeiAverage: string
        pastWeekWeiVolume: string
        pastMonthNumTxs: number
      }
    }[]
  }
}

export const GET_COLLECTION_AVG_PRICE = gql`
  query GetCollectionAvgPrice(
    $metric: EOrderedAssetSetMetric!
    $limit: Int!
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
        latestStats {
          floor
          pastDayWeiAverage
          pastDayWeiVolume
          pastWeekWeiAverage
          pastWeekWeiVolume
          pastMonthNumTxs
        }
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
  orderColumn: string
  orderDirection: string
}

export type GetExploreNFTsData = {
  assetGlobalSearch: {
    count: number
    assets: {
      id: string
      name: string
      contractAddress: string
      previewImageUrl?: string
      mediaUrl: string
      totalSaleCount: number
      priceChangeFromFirstSale: number
      lastSale: {
        timestamp: number
        ethSalePrice: string
      }
      lastAppraisalWeiPrice: string
      lastAppraisalSaleRatio: number
    }[]
  }
}

export const GET_EXPLORE_NFTS = gql`
  query GetExploreNFTs(
    $limit: Int!
    $offset: Int!
    $searchTerm: String
    $collectionId: Int
    $orderColumn: AssetSearchSortOption
    $orderDirection: OrderDirection
  ) {
    assetGlobalSearch(
      limit: $limit
      offset: $offset
      searchTerm: $searchTerm
      collectionId: $collectionId
      orderColumn: $orderColumn
      orderDirection: $orderDirection
    ) {
      count
      assets {
        id
        name
        contractAddress
        previewImageUrl
        mediaUrl
        totalSaleCount
        priceChangeFromFirstSale
        lastSale {
          timestamp
          ethSalePrice
        }
        lastAppraisalWeiPrice
        lastAppraisalSaleRatio
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
  orderColumn: string
  orderDirection: string
  limit: number
  offset: number
  name?: string
}

export type GetExploreCollectionsData = {
  searchCollectionByMetric: {
    count: number
    assetSets: {
      id: number
      name: string
      imageUrl?: string
      latestStats: {
        floor: string
        pastDayWeiAverage: string
        pastWeekWeiVolume: string
        weekFloorChange: number
      }
    }[]
  }
}

export const GET_EXPLORE_COLLECTIONS = gql`
  query GetTopCollections(
    $orderColumn: EAssetSetStatSearchOrder!
    $orderDirection: OrderDirection!
    $limit: Int!
    $offset: Int!
    $name: String
  ) {
    searchCollectionByMetric(
      searchArgs: {
        orderColumn: $orderColumn
        orderDirection: $orderDirection
        limit: $limit
        offset: $offset
        name: $name
      }
    ) {
      count
      assetSets {
        id
        name
        imageUrl
        latestStats {
          floor
          pastDayWeiAverage
          pastWeekWeiVolume
          weekFloorChange
        }
      }
    }
  }
`

export const GET_TOP_SALES = gql`
  query TopSales($windowSize: ETimeWindow!, $limit: Int!, $collectionId: Int) {
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
 * Gets top collections for the treemap
 * @see TreeMap
 */
export type GetTreemapCollectionsVars = {
  limit: number
}

export type GetTreemapCollectionsData = {
  orderedCollectionsByMetricSearch: {
    assetSets: {
      id: number
      name: string
      latestStats: {
        totalWeiVolume: string
        weekCapChange: number
      }
    }[]
  }
}

export const GET_TREEMAP_COLLECTIONS = gql`
  query GetTreeMapCollections($limit: Int!) {
    orderedCollectionsByMetricSearch(
      limit: $limit
      metric: VOLUME
      windowSize: WEEK
    ) {
      assetSets {
        id
        name
        latestStats {
          totalWeiVolume
          weekCapChange
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
  assetId?: string
  offset: number
  searchTerm?: string
}

export type GetCollectorsData = {
  getOwnersByWhaleness: {
    count: number
    owners: {
      id: number
      username: string
      ownedAppraisalValue: {
        appraisalWei: string
      }
      mostRecentBuy: {
        assetId: string
        asset: {
          name: string
        }
      }
      addresses: { address: string; ens: string }[]
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
            ownerAssetsInCollection: {
              count: number
              assets: {
                id: string
                previewImageUrl: string
              }
            }
          }
        }[]
      }
    }[]
  }
}

export const GET_COLLECTORS = gql`
  query GetCollectors(
    $id: Int
    $limit: Int!
    $offset: Int!
    $assetId: String
    $searchTerm: String
  ) {
    getOwnersByWhaleness(
      collectionId: $id
      limit: $limit
      offset: $offset
      assetId: $assetId
      searchTerm: $searchTerm
    ) {
      count
      owners {
        ownedAppraisalValue {
          appraisalWei
        }
        mostRecentBuy {
          assetId
          asset {
            name
          }
        }
        id
        username
        addresses {
          address
          ens
        }
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
              ownerAssetsInCollection(limit: 20) {
                count
                assets {
                  id
                  previewImageUrl
                }
              }
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
  assetId?: string
  offset: number
}

export type GetPreviousOwnersData = {
  getOwnersByWhaleness: {
    count: number
    owners: {
      id: number
      username: string
      addresses: { address: string; ens: string }[]
      firstAssetPurchaseTime: number
      avgHoldTime: number
      ownedAssets: {
        count: number
        assets: {
          id: string
          previewImageUrl: string
        }[]
      }
      ownedAppraisalValue: {
        appraisalWei: string
      }
      extraCollections: {
        collectionAssetCounts: {
          count: number
          collection: {
            id: number
            name: string
            imageUrl: string
            ownerAssetsInCollection: {
              count: number
              assets: {
                id: string
                previewImageUrl: string
              }[]
            }
          }
        }[]
      }
    }[]
  }
}

export const GET_PREVIOUS_OWNERS = gql`
  query GetPreviousOwners(
    $id: Int
    $limit: Int!
    $assetId: String
    $offset: Int!
  ) {
    getOwnersByWhaleness(limit: $limit, offset: $offset, assetId: $assetId) {
      count
      owners {
        id
        username
        addresses {
          address
          ens
        }
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
              ownerAssetsInCollection(limit: 20) {
                count
                assets {
                  id
                  previewImageUrl
                }
              }
            }
          }
        }
      }
    }
  }
`

export type GetUserOwnedAssetsVars = {
  userId?: number
  collectionId?: number
}

export type GetUserOwnedAssetsData = {
  getUser: {
    ownedAssets: {
      count: number
      assets: {
        id: number
        previewImageUrl: string
      }[]
    }
  }
}

export const GET_USER_OWNED_ASSETS = gql`
  query GetUserOwnedAssets($userId: Int!, $collectionId: Int!) {
    getUser(userId: $userId) {
      ownedAssets(collectionId: $collectionId, limit: 20, notable: true) {
        count
        assets {
          id
          previewImageUrl
        }
      }
    }
  }
`

/**
 * Get ungrouped traits
 */

 export type TraitSearchVars = {
  limit?: number
  offset?: number
  searchTerm?: string
  traitType?: string
  collectionId: number
  orderColumn?: string
  orderDirection?: string
}

export type TraitSearchData = {
  traitSearch: {
    count?: number
    traits?: {
      id: number
      description?: string
      traitType?: string
      displayType?: string
      collectionId?: number
      value?: string
      maxValue?: string
      rarity?: number
      floor?: string
      floorUsd?: string
      image?: string
    }[]
  }
}

export const TRAIT_SEARCH = gql`
  query TraitSearch(
    $limit: Int = 10
    $offset: Int = 0
    $searchTerm: String
    $traitType: String
    $collectionId: Int!
    $orderColumn: TraitSearchSortOption
    $orderDirection: OrderDirection) {
    traitSearch(
      limit: $limit
      offset: $offset
      searchTerm: $searchTerm
      traitType: $traitType
      collectionId: $collectionId
      orderColumn: $orderColumn
      orderDirection: $orderDirection
    ) {
      count
      traits {
        id
        traitType
        displayType
        maxValue
        collectionId
        value
        maxValue
        rarity
        floor
        floorUsd
        image
      }
    }
  }
`