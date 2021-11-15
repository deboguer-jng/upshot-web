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
      id: number
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
      rarity: number
    }[]
    appraisalHistory: {
      timestamp
      estimatedPrice
    }[]
    txHistory: {
      ethSalePrice: string
      price: number
      currency: {
        name: string
      }[]
      txAt: number
      txFromAddress: string
      txToAddress: string
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
        id
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
        rarity
      }
      appraisalHistory {
        timestamp
        estimatedPrice
      }
      txHistory {
        ethSalePrice
        price
        currency {
          name
        }
        txAt
        txFromAddress
        txToAddress
      }
    }
  }
`
