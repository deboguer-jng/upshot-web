import { ethers } from 'ethers'

/**
 * Shorten address
 *
 * @param {string} wallet
 * @param {number?} charsLeft
 * @param {number?} charsRight
 * @returns {string} Shortened address
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
