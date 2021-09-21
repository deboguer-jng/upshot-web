import { gql } from '@apollo/client'

/**
 * Get Asset
 * @see NFT
 */

/**
 * Collection Avg. Price
 * @see CollectionAvgPricePanel
 */
export type GetAssetVars = {
  id: string
}

export type GetAssetData = {
  assetById: {
    name: string
    previewImageUrl?: string
    mediaUrl: string
    rarity: number
    priceChangeFromFirstSale: number
    creatorAddress: string
    creatorUsername: string
    creatorAvatar: string
    collection?: {
      name: string
      imageUrl: string
    }
    lastSale?: {
      ethSalePrice: string
      currencyPriceInUSDT: {
        closePrice: string
      }
      confidence: number
      timestamp: number
    }
    latestAppraisal?: {
      ethSalePrice: string
      currencyPriceInUSDT: {
        closePrice: string
      }
      confidence: number
      timestamp: number
    }
    firstSale?: {
      estimatedPrice: string
    }
    avgResalePrice: string
    traits: {
      displayType: string
      traitType: string
      value: string
    }[]
    appraisalHistory: {
      timestamp
      estimatedPrice
    }[]
    txHistory: {
      assetEvent: {
        ethPrice: string
        txAt: number
        txFromAddress: string
        txToAddress: string
      }
    }[]
  }
}

export const GET_ASSET = gql`
  query GetAssetById($id: String!) {
    assetById(id: $id) {
      name
      previewImageUrl
      mediaUrl
      rarity
      priceChangeFromFirstSale
      creatorAddress
      creatorUsername
      creatorAvatar
      collection {
        name
        imageUrl
      }
      lastSale {
        ethSalePrice
        currencyPriceInUSDT {
          closePrice
        }
        confidence
        timestamp
      }
      latestAppraisal {
        ethSalePrice
        currencyPriceInUSDT {
          closePrice
        }
        confidence
        timestamp
      }
      firstSale {
        estimatedPrice
      }
      avgResalePrice
      traits {
        displayType
        traitType
        value
      }
      appraisalHistory {
        timestamp
        estimatedPrice
      }
      txHistory {
        assetEvent {
          ethPrice
          txAt
          txFromAddress
          txToAddress
        }
      }
    }
  }
`
