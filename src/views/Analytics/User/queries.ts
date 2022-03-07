import { gql } from '@apollo/client'

/**
 * Get collector stats
 * @see /user
 */
export type GetCollectorVars = {
  collectionLimit: number
  collectionOffset: number
  assetLimit: number
  assetOffset: number
  userId?: number
  address?: string
}

export type GetCollectorData = {
  getUser: {
    totalAssetAppraisedValueUsd: string
    totalAssetAppraisedValueWei: string
    firstAssetPurchaseTime: number
    bio: string
    numAssets: number
    warningBanner: boolean
    extraCollections: {
      count: number
      collectionAssetCounts: {
        count: number
        ownedAppraisedValue: string
        collection: {
          id: number
          name: string
          imageUrl: string
          isAppraised: boolean
          ownerAssetsInCollection: {
            count: number
            assets: {
              id: string
              contractAddress: string
              previewImageUrl?: string
              mediaUrl?: string
              name?: string
              description?: string
            }[]
          }
        }
      }[]
    }
    mostRecentSell: {
      txAt: number
    }
    mostRecentBuy: {
      txAt: number
    }
    avgHoldTime: number
  }
}

export const GET_COLLECTOR = gql`
  query GetCollector(
    $userId: Int
    $address: String
    $collectionLimit: Int!
    $collectionOffset: Int!
    $assetLimit: Int!
    $assetOffset: Int!
  ) {
    getUser(userId: $userId, address: $address) {
      totalAssetAppraisedValueUsd
      totalAssetAppraisedValueWei
      firstAssetPurchaseTime
      bio
      numAssets
      warningBanner
      extraCollections(limit: $collectionLimit, offset: $collectionOffset) {
        count
        collectionAssetCounts {
          count
          ownedAppraisedValue
          collection {
            id
            name
            imageUrl
            isAppraised
            ownerAssetsInCollection(
              limit: $assetLimit
              offset: $assetOffset
              userAddress: $address
            ) {
              count
              assets {
                id
                contractAddress
                previewImageUrl
                mediaUrl
                name
                description
              }
            }
          }
        }
      }
      mostRecentSell {
        txAt
      }
      mostRecentBuy {
        txAt
      }
      avgHoldTime
    }
  }
`

export type GetCollectorTxHistoryVars = {
  txLimit: number
  txOffset: number
  userId?: number
  address?: string
}

export type GetCollectorTxHistoryData = {
  getTxHistory: {
    txHistory: {
      count: number
      events: {
        type: string
        txAt: number
        txFromAddress: string
        txToAddress: string
        txHash: string
        price: string
        asset: {
          id: number
          name: string
        }
        currency: {
          symbol: string
          decimals: number
        }
      }[]
    }
  }
}

export const GET_COLLECTOR_TX_HISTORY = gql`
  query GetCollector(
    $userId: Int
    $address: String
    $txLimit: Int!
    $txOffset: Int!
  ) {
    getTxHistory: getUser(userId: $userId, address: $address) {
      txHistory(limit: $txLimit, offset: $txOffset) {
        count
        events {
          type
          txAt
          txFromAddress
          txToAddress
          txHash
          price
          asset {
            id
            name
          }
          currency {
            symbol
            decimals
          }
        }
      }
    }
  }
`

/**
 * Get Collection Assets
 */

export type GetCollectionAssetsVars = {
  userAddress?: string
  id: number
  limit: number
  offset: number
}

export type GetCollectionAssetsData = {
  collectionById: {
    ownerAssetsInCollection: {
      count: number
      assets: {
        id: string
        name?: string
        description?: string
        previewImageUrl?: string
        mediaUrl?: string
        lastAppraisalWeiPrice?: string
        lastAppraisalUsdPrice?: string
        contractAddress: string
      }[]
    }
  }
}

export const GET_COLLECTION_ASSETS = gql`
  query GetCollectionAssets(
    $userAddress: String
    $id: Int!
    $limit: Int!
    $offset: Int!
  ) {
    collectionById(id: $id) {
      ownerAssetsInCollection(
        userAddress: $userAddress
        limit: $limit
        offset: $offset
      ) {
        count
        assets {
          id
          name
          description
          previewImageUrl
          mediaUrl
          lastAppraisalWeiPrice
          lastAppraisalUsdPrice
          contractAddress
        }
      }
    }
  }
`

/**
 * Get unsupported collections
 */
export type GetUnsupportedCollectionsVars = {
  userAddress?: string
  limit?: number
  offset?: number
}

export type GetUnsupportedCollectionsData = {
  getUnsupportedCollectionPage: {
    nextOffset: number
    slugsWithNullFloors: string
    collections: {
      imageUrl: string
      osCollectionSlug: string
      floorEth: number
      floorUsd: number
      name: string
      address: string
      numOwnedAssets: number
    }[]
  }
}

export const GET_UNSUPPORTED_COLLECTIONS = gql`
  query GetUnsupportedCollections(
    $userAddress: String!
    $limit: Int!
    $offset: Int
  ) {
    getUnsupportedCollectionPage(
      userAddress: $userAddress
      limit: $limit
      offset: $offset
    ) {
      nextOffset
      slugsWithNullFloors
      collections {
        imageUrl
        osCollectionSlug
        floorEth
        floorUsd
        name
        address
        numOwnedAssets
      }
    }
  }
`

/**
 * Get unsupported floors
 */
export type GetUnsupportedFloorsVars = {
  stringifiedSlugs?: string
}

export type GetUnsupportedFloorsData = {
  getUnsupportedFloors: {
    floorEth: number
    floorUsd: number
  }[]
}

export const GET_UNSUPPORTED_FLOORS = gql`
  query GetUnsupportedFloors($stringifiedSlugs: String!) {
    getUnsupportedFloors(stringifiedSlugs: $stringifiedSlugs) {
      floorEth
      floorUsd
    }
  }
`

/**
 * Get unsupported assets
 */
export type GetUnsupportedAssetsVars = {
  userAddress?: string
  osCollectionSlug?: string
  limit?: number
  offset?: number
}

export type GetUnsupportedAssetsData = {
  getUnsupportedAssetPage: {
    nextOffset: number
    assets: {
      address: string
      tokenId: string
      name: string
      imageUrl: string
    }[]
  }
}

export const GET_UNSUPPORTED_ASSETS = gql`
  query GetUnsupportedAssets(
    $userAddress: String!
    $osCollectionSlug: String!
    $limit: Int
    $offset: Int
  ) {
    getUnsupportedAssetPage(
      userAddress: $userAddress
      osCollectionSlug: $osCollectionSlug
      limit: $limit
      offset: $offset
    ) {
      nextOffset
      assets {
        address
        name
        tokenId
        imageUrl
      }
    }
  }
`

/**
 * Get unsupported aggregate collection stats
 */
export type GetUnsupportedAggregateCollectionStatsVars = {
  userAddress?: string
}

export type GetUnsupportedAggregateCollectionStatsData = {
  getUnsupportedAggregateCollectionStats: {
    floorEth: number
    floorUsd: number
    numUniqueCollections: number
    numAssets: number
  }
}

export const GET_UNSUPPORTED_AGGREGATE_COLLECTION_STATS = gql`
  query GetUnsupportedAggregateCollectionStats($userAddress: String!) {
    getUnsupportedAggregateCollectionStats(userAddress: $userAddress) {
      floorEth
      floorUsd
      numUniqueCollections
      numAssets
    }
  }
`
