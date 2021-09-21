import { gql } from '@apollo/client'

/**
 * Search Assets
 * @see Search
 */
export type GetAssetsSearchVars = {
  limit: number
  offset: number
  searchTerm?: string
  minPrice?: string
  maxPrice?: string
}

export type GetAssetsSearchData = {
  assetGlobalSearch: {
    count: number
    assets: {
      id: string
      name: string
      previewImageUrl: string
      lastSale?: {
        ethSalePrice: string
      }
      creatorUsername: string
      creatorAddress: string
      rarity: number
    }[]
  }
}

export const GET_ASSETS_SEARCH = gql`
  query GetAssetsSearch(
    $searchTerm: String
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
    ) {
      count
      assets {
        id
        name
        previewImageUrl
        lastSale {
          ethSalePrice
        }
        creatorUsername
        creatorAddress
        rarity
      }
    }
  }
`
