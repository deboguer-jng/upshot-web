import { gql } from '@apollo/client'

/**
 * Get NavBar collections
 * @see NavBar onFocus() handler
 */
export type GetNavBarCollectionsVars = {}

export type GetNavBarCollectionsData = {
  collections: {
    assetSets: {
      id: number
      name: string
    }[]
  }
}

export const GET_NAV_BAR_COLLECTIONS = gql`
  query GetNavBarCollections($limit: Int!) {
    collections(limit: $limit) {
      assetSets {
        id
        name
      }
    }
  }
`

/**
 * Get Waitlist status
 * @see /views/Waitlist
 */
export type GetWaitListVars = {
  address: string
}

export type GetWaitListData = {
  getUser: {
    isBeta: boolean
  }
}

export const GET_WAIT_LIST = gql`
  query GetWaitList($address: String) {
    getUser(address: $address) {
      isBeta
    }
  }
`

/**
 * Get gmi score
 * @see /gmi
 */
export type GetGmiVars = {
  address: string
  ens: string
}

export type GetGmiData = {
  getUser: {
    addresses: {
      address: string
      gmi: number
      volume: string
      startAt: number
      numTxs: number
      unrealizedGain: number
      realizedGain: number
      numAssetsOwned: number
      numBlueChipsOwned: number
      numCollectionsOwned: number
    }[]
  }
}

export const GET_GMI = gql`
  query GetGmi($address: String, $ens: String) {
    getUser(address: $address, ens: $ens) {
      addresses {
        address
        gmi
        volume
        startAt
        numTxs
        unrealizedGain
        realizedGain
        numAssetsOwned
        numBlueChipsOwned
        numCollectionsOwned
      }
    }
  }
`
