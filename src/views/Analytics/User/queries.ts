import { gql } from '@apollo/client'

export type GetUserProfileVars = { address: string }
export type GetUserProfileData = {
  getUser: {
    id: number
    username: string
    displayName: string
    bio: string
    avatar: string
    addresses: {
      address: string
      ens: string
      gmi: number
    }[]
  }
}
export const GET_PROFILE = gql`
  query GetProfile($address: String) {
    getUser(address: $address) {
      id
      username
      displayName
      bio
      avatar
      addresses {
        address
        ens
      }
    }
  }
`

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
    id: number
    ownedAppraisalValue: {
      appraisalWei: string
      appraisalUsd: string
    }
    firstAssetPurchaseTime: number
    bio: string
    displayName: string
    numAssets: number
    addresses: {
      address: string
      ens: string
      gmi: number
    }[]
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
      id
      ownedAppraisalValue {
        appraisalWei
        appraisalUsd
      }
      firstAssetPurchaseTime
      bio
      displayName
      numAssets
      addresses {
        address
        ens
        gmi
      }
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

export type GetAllOwnedCollectionsWrapperVars = {
  dbCount: number | null
  userAddress: string | undefined
  userId: number | undefined
  limit: number
  offset: number
}

export type GetAllOwnedCollectionsWrapperData = {
  getAllOwnedCollectionsWrapper: {
    nextOffset: number
    extraCollections?: {
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
              mediaUrl?: string
              name?: string
              description?: string
            }[]
          }
        }
      }[]
    }
    unsupportedCollections?: {
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
}

export const GET_ALL_OWNED_COLLECTIONS_WRAPPER = gql`
  query getAllOwnedCollectionsWrapper(
    $dbCount: Int
    $userAddress: String!
    $userId: Int!
    $limit: Int!
    $offset: Int
  ) {
    getAllOwnedCollectionsWrapper(
      dbCount: $dbCount
      userId: $userId
      userAddress: $userAddress
      # collectionId: null,
      limit: $limit
      offset: $offset
    ) {
      nextOffset
      extraCollections {
        count
        collectionAssetCounts {
          count
          ownedAppraisedValue
          collection {
            id
            name
            imageUrl
            isAppraised
            ownerAssetsInCollection(limit: $limit, userAddress: $userAddress) {
              count
              assets {
                id
                contractAddress
                mediaUrl
                name
                description
              }
            }
          }
        }
      }
      unsupportedCollections {
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
    id: number
    txHistory: {
      count: number
      events: {
        id: number
        type: string
        txAt: number
        txFromAddress: string
        txToAddress: string
        txToUser: {
          addresses: {
            address: string
            ens: string
          }[]
        }
        txFromUser: {
          addresses: {
            address: string
            ens: string
          }[]
        }
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
      id
      txHistory(limit: $txLimit, offset: $txOffset) {
        count
        events {
          id
          type
          txAt
          txFromAddress
          txToAddress
          txToUser {
            addresses {
              address
              ens
            }
          }
          txFromUser {
            addresses {
              address
              ens
            }
          }
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
