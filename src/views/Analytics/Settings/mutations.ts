import { gql } from '@apollo/client'

/**
 * Update user
 * @see views/Analytics/Settings
 */
export type UpdateUserVars = {
  username?: string
  displayName?: string
  tagline?: string
  bio?: string
  avatar?: string
  coverImage?: string
  email?: string
  allowNewsletter?: boolean
  allowAccountUpdate?: boolean
  isBeta?: boolean
}

export type UpdateUserData = {
  updateUser?: {
    id: number
    username: string
    displayName: string
    tagline: string
    bio: string
    avatar: string
    coverImage: string
    email: string
    allowNewsletter: boolean
    allowAccountUpdate: boolean
    isBeta: boolean
  }
}

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $username: String
    $displayName: String
    $tagline: String
    $bio: String
    $avatar: String
    $coverImage: String
    $email: String
    $allowNewsletter: Boolean
    $allowAccountUpdate: Boolean
    $isBeta: Boolean
  ) {
    updateUser(
      username: $username
      displayName: $displayName
      tagline: $tagline
      bio: $bio
      avatar: $avatar
      coverImage: $coverImage
      email: $email
      allowNewsletter: $allowNewsletter
      allowAccountUpdate: $allowAccountUpdate
      isBeta: $isBeta
    ) {
      id
      username
      displayName
      tagline
      bio
      avatar
      coverImage
      email
      allowNewsletter
      allowAccountUpdate
      isBeta
    }
  }
`