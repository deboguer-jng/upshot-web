import { ethers } from 'ethers'

type EnsDetails = { name?: string; avatar?: string }

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
 * Extract ENS
 *
 * Extract ENS from addresses array
 *
 * @returns string
 */
export const extractEns = (
   addresses: {address: string, ens: string}[] | undefined,
   address: string
) => {
  if (typeof addresses === 'undefined')
    return null
  for (let index = 0; index < address.length; index++) {
    if (addresses[index].address === address)
      return addresses[index].ens
  }
  return null
}
