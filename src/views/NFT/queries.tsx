import { gql } from '@apollo/client'

/**
 * Get Asset
 */

export type GetAssetVars = {
  id: string
}

export type GetAssetData = {
  assetById: {
    name: string
    tokenId: string
    previewImageUrl?: string
    mediaUrl: string
    rarity: number
    priceChangeFromFirstSale: number
    contractAddress: string
    creatorAddress: string
    creatorUsername: string
    creatorAvatar: string
    collection?: {
      name: string
      imageUrl: string
    }
    lastSale?: {
      ethSalePrice: string
      usdSalePrice: string
      confidence: number
      timestamp: number
    }
    latestAppraisal?: {
      ethSalePrice: string
      usdSalePrice: string
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
      ethSalePrice: string
      assetEvent: {
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
      tokenId
      previewImageUrl
      mediaUrl
      rarity
      priceChangeFromFirstSale
      contractAddress
      creatorAddress
      creatorUsername
      creatorAvatar
      collection {
        name
        imageUrl
      }
      lastSale {
        ethSalePrice
        usdSalePrice
        confidence
        timestamp
      }
      latestAppraisal {
        ethSalePrice
        usdSalePrice
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
        ethSalePrice
        assetEvent {
          txAt
          txFromAddress
          txToAddress
        }
      }
    }
  }
`
