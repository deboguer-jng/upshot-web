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
  minPrice?: string
  maxPrice?: string
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
    $limit: Int!
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
      collectionId: $collectionId
      collectionName: $collectionName
      traits: $traits
      tokenId: $tokenId
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
