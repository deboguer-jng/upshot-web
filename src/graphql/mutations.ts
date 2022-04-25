import { gql } from '@apollo/client'

/**
 * Log Event
 * @see views/Layout
 */
export type LogEventVars = {
  timestamp: number
  address: string
  type: string
  value?: string
}

export type LogEventData = {
  logEvent: {
    type: string
    value: string
    address: string
    timestamp: number
  }
}

export const LOG_EVENT = gql`
  mutation LogEvent(
    $timestamp: Int!
    $address: String!
    $type: String!
    $value: String
  ) {
    logEvent(
      timestamp: $timestamp
      address: $address
      type: $type
      value: $value
    ) {
      type
      value
      address
      timestamp
    }
  }
`
