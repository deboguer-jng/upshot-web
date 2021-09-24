import { gql } from '@apollo/client'

/**
 * Search Assets
 * @see Search
 */
export type GetAssetsSearchVars = {
  limit: number
  offset: number
  searchTerm?: string
  collectionName?: string
  tokenId?: string
  traits?: string
  minPrice?: string
  maxPrice?: string
}

export type GetAssetsSearchData = {
  assetGlobalSearch: {
    count: number
    assets: {
      id: string
      name: string
      previewImageUrl?: string
      mediaUrl: string
      lastSale?: {
        ethSalePrice: string
      }
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
    $collectionName: String
    $tokenId: String
    $traits: String
    $limit: OneToHundredInt!
    $minPrice: String
    $maxPrice: String
    $offset: Int
  ) {
    assetGlobalSearch(
      limit: $limit
      offset: $offset
      minPrice: $minPrice
      maxPrice: $maxPrice
      searchTerm: $searchTerm
      collectionName: $collectionName
      traits: $traits
      tokenId: $tokenId
    ) {
      count
      assets {
        id
        name
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
