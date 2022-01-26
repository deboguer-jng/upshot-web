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
  txLimit: number
  txOffset: number
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
    extraCollections: {
      count: number
      collectionAssetCounts: {
        count: number
        ownedAppraisedValue: string
        collection: {
          id: number
          name: string
          imageUrl: string
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
          id: string
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

export const GET_COLLECTOR = gql`
  query GetCollector(
    $userId: Int
    $address: String
    $collectionLimit: OneToHundredInt!
    $collectionOffset: Int!
    $assetLimit: OneToHundredInt!
    $assetOffset: Int!
    $txLimit: OneToHundredInt!
    $txOffset: Int!
  ) {
    getUser(userId: $userId, address: $address) {
      totalAssetAppraisedValueUsd
      totalAssetAppraisedValueWei
      firstAssetPurchaseTime
      bio
      numAssets
      extraCollections(limit: $collectionLimit, offset: $collectionOffset) {
        count
        collectionAssetCounts {
          count
          ownedAppraisedValue
          collection {
            id
            name
            imageUrl
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
    $limit: OneToHundredInt!
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
 * Get unsupported assets
 */
export type GetUnsupportedAssetsVars = {
  address?: string
}

export type GetUnsupportedAssetsData = {
  getUnsupportedAssetPage: {
    assets: {
      name: string
      address: string
      imageUrl: string
    }[]
  }
}

export const GET_UNSUPPORTED_ASSETS = gql`
  query GetUnsupportedAssets($address: String!) {
    getUnsupportedAssetPage(userAddress: $address) {
      assets {
        name
        address
        imageUrl
      }
    }
  }
`

/**
 * Get unsupported floors
 */
export type GetUnsupportedFloorsVars = {
  collectionAddresses?: string
}

export type GetUnsupportedFloorsData = {
  getUnsupportedFloors: {
    address: string
    floorEth: string
    floorUsd: string
  }[]
}

export const GET_UNSUPPORTED_FLOORS = gql`
  query GetUnsupportedFloors($collectionAddresses: String!) {
    getUnsupportedFloors(collectionAddresses: $collectionAddresses) {
      address
      floorEth
      floorUsd
    }
  }
`
