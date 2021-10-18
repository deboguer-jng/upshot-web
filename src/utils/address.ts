import { ethers } from 'ethers'

/**
 * Shorten address
 *
 * @returns a shortened checksummed wallet address.
 */
export function shortenAddress(
  address: string,
  charsLeft = 4,
  charsRight = 4
): string {
  let parsed = ''

  try {
    parsed = ethers.utils.getAddress(address)
  } catch (err) {}

  return `${parsed.slice(0, charsLeft + 2)}...${parsed.slice(-charsRight)}`
}

/**
 * Format username.
 *
 * @returns A shortened address if the username is an address. Otherwise, the username.
 */
export const formatUsername = (username: string) => {
  if (username.slice(0, 2) !== '0x') return username

  try {
    const parsed = ethers.utils.getAddress(username)
    return shortenAddress(parsed)
  } catch (err) {}

  return username
}
