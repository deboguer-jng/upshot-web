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
 * Fetch ENS
 *
 * Looks up the ENS name & avatar.
 *
 * @returns Promise<EnsDetails>
 */
export const fetchEns = async (address: string, provider: any) => {
  const ens: EnsDetails = { name: undefined, avatar: undefined }

  if (!provider) return ens

  /* Reverse lookup of ENS name via address */
  try {
    ens.name = await provider.lookupAddress(address)
  } catch (err) {
    console.error(err)
    return ens
  }

  return ens
}
