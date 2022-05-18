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
  address?: string
  ens?: string
}

export type GetGmiData = {
  getUser: {
    addresses: {
      address: string
      ens: string
      gmi: number
      volume: string
      startAt: number
      numTxs: number
      unrealizedGain: string
      realizedGain: string
      numAssetsOwned: number
      numBlueChipsOwned: number
      numCollectionsOwned: number
      totalGainPercent: number
      gmiPercentile: number
    }[]
  }
}

export const GET_GMI = gql`
  query GetGmi($address: String, $ens: String) {
    getUser(address: $address, ens: $ens) {
      addresses {
        address
        ens
        gmi
        volume
        startAt
        numTxs
        unrealizedGain
        realizedGain
        numAssetsOwned
        numBlueChipsOwned
        numCollectionsOwned
        totalGainPercent
        gmiPercentile
      }
    }
  }
`

/**
 * Get collection metadata
 * @see Meta
 */
export type GetMetaCollectionVars = {
  id: number
}

export type GetMetaCollectionData = {
  collectionById: {
    name?: string
    imageUrl?: string
  }
}

export const GET_META_COLLECTION = gql`
  query GetMetaCollection($id: Int!) {
    collectionById(id: $id) {
      name
      imageUrl
    }
  }
`

/**
 * Get asset metadata
 * @see Meta
 */
export type GetMetaAssetVars = {
  id: string
}

export type GetMetaAssetData = {
  assetById: {
    name?: string
    previewImageUrl?: string
  }
}

export const GET_META_ASSET = gql`
  query GetMetaAsset($id: String!) {
    assetById(id: $id) {
      name
      previewImageUrl
    }
  }
`

/**
 * Get collector metadata
 * @see Meta
 */
export type GetMetaCollectorVars = {
  address?: string
  ens?: string
}

export type GetMetaCollectorData = {
  getUser: {
    addresses: {
      address: string
      ens: string
    }[]
  }
}

export const GET_META_COLLECTOR = gql`
  query GetMetaCollector($address: String, $ens: String) {
    getUser(address: $address, ens: $ens) {
      addresses {
        address
        ens
      }
    }
  }
`
