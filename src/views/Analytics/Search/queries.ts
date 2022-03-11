import { gql } from '@apollo/client'

/**
 * Search Assets
 * @see Search
 */
export type GetAssetsSearchVars = {
  limit: number
  offset: number
  searchTerm?: string
  collectionId?: number
  collectionName?: string
  tokenId?: string
  traits?: string
  traitIds?: number[]
  minPrice?: string
  maxPrice?: string
  traitFilterJoin?: string
  listed?: boolean
}

export type GetAssetsSearchData = {
  assetGlobalSearch: {
    count: number
    assets: {
      id: string
      name: string
      tokenId: string
      previewImageUrl?: string
      mediaUrl: string
      lastSale?: {
        ethSalePrice: string
      }
      collection?: {
        name: string
        id: number
      }
      collectionId: number
      contractAddress: string
      creatorUsername: string
      creatorAddress: string
      rarity: number
    }[]
  }
}

export const GET_ASSETS_SEARCH = gql`
  query GetAssetsSearch(
    $searchTerm: String
    $collectionId: Int
    $collectionName: String
    $tokenId: String
    $traits: String
    $traitIds: [Int]
    $limit: Int!
    $minPrice: String
    $maxPrice: String
    $offset: Int
    $traitFilterJoin: AndOr
    $listed: Boolean
  ) {
    assetGlobalSearch(
      limit: $limit
      offset: $offset
      minPrice: $minPrice
      maxPrice: $maxPrice
      searchTerm: $searchTerm
      collectionId: $collectionId
      collectionName: $collectionName
      traits: $traits
      traitIds: $traitIds
      tokenId: $tokenId
      traitFilterJoin: $traitFilterJoin
      listed: $listed
    ) {
      count
      assets {
        id
        name
        tokenId
        collection {
          name
          id
        }
        previewImageUrl
        mediaUrl
        lastSale {
          ethSalePrice
        }
        contractAddress
        creatorUsername
        creatorAddress
        rarity
      }
    }
  }
`
/**
 * Trait Statistics
 * @see TraitStats
 */
export type GetTraitStatsVars = {
  traitIds?: number[]
}

export type GetTraitStatsData = {
  traitStats: {
    traits: {
      value: string
      traitType: string
      rarity: number
      floor: string
    }[]
  }
}

export const GET_TRAIT_STATS = gql`
  query GetTraitStats($traitIds: [Int]) {
    traitStats(traitIds: $traitIds) {
      traits {
        value
        traitType
        rarity
        floor
      }
    }
  }
`
