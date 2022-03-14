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
    rarityRank: number
    priceChangeFromFirstSale: number
    contractAddress: string
    creatorAddress: string
    creatorUsername: string
    creatorAvatar: string
    warningBanner: boolean
    collection?: {
      id: number
      name: string
      imageUrl: string
      size: number
    }
    lastSale?: {
      ethSalePrice: string
      usdSalePrice: string
      confidence: number
      timestamp: number
    }
    lastAppraisalWeiPrice: string
    lastAppraisalUsdPrice: string
    lastAppraisalAt: number
    latestAppraisal?: {
      medianRelativeError: number
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
      type: string
      price: string
      currency: {
        symbol: string
        decimals: number
      }
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
      rarityRank
      priceChangeFromFirstSale
      contractAddress
      creatorAddress
      creatorUsername
      creatorAvatar
      warningBanner
      collection {
        id
        name
        imageUrl
        size
      }
      lastSale {
        ethSalePrice
        usdSalePrice
        confidence
        timestamp
      }
      lastAppraisalWeiPrice
      lastAppraisalUsdPrice
      lastAppraisalAt
      latestAppraisal {
        medianRelativeError
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
        price
        type
        currency {
          symbol
          decimals
        }
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
      }
    }
  }
`
