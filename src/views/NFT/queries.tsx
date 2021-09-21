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
    previewImageUrl: string
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
    }
    latestAppraisal?: {
      estimatedPrice: string
    }
    firstSale?: {
      estimatedPrice: string
    }
    // avgResalePrice: string
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
      timestamp
      estimatedPrice
    }[]
  }
}

export const GET_ASSET = gql`
  query GetAssetById($id: String!) {
    assetById(id: $id) {
      name
      previewImageUrl
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
      }
      latestAppraisal {
        estimatedPrice
      }
      firstSale {
        estimatedPrice
      }
      # avgResalePrice
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
        timestamp
        estimatedPrice
      }
    }
  }
`
