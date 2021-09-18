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
    rarity: string
    priceChangeFromFirstSale: string
    latestMarketPrice: string
    latestAppraisedPrice: string
    firstSale: {
      estimatedPrice: string
    }
    // avgResalePrice: string
    // traits: {
    //   displayType: string
    //   traitType: string
    //   value: string
    // }[]
    txHistory: {
      timestamp: number
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
      latestMarketPrice
      latestAppraisedPrice
      firstSale {
        estimatedPrice
      }
      # avgResalePrice
      # traits {
      #   displayType
      #   traitType
      #   value
      # }
      txHistory {
        timestamp
      }
    }
  }
`
