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
    firstAssetPurchaseTime: number
    bio: string
    extraCollections: {
      count: number
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
              previewImageUrl?: string
              name?: string
              description?: string
            }[]
          }
        }[]
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
      type: string
      txAt: number
      txFromAddress: string
      txToAddress: string
      txHash: string
      price: string
      currency: {
        symbol: string
        decimals: number
      }
    }[]
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
  ) {
    getUser(userId: $userId, address: $address) {
      totalAssetAppraisedValueUsd
      firstAssetPurchaseTime
      bio
      extraCollections(limit: $collectionLimit, offset: $collectionOffset) {
        count
        collectionAssetCounts {
          count
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
                previewImageUrl
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
      txHistory {
        type
        txAt
        txFromAddress
        txToAddress
        txHash
        price
        currency {
          symbol
          decimals
        }
      }
    }
  }
`
