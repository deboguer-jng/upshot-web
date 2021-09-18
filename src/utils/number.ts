import { ethers } from 'ethers'

/**
 * Wei to Eth
 *
 * @returns wei converted to a truncated ether
 * string with an optional 'Ξ' prefix.
 */
export const weiToEth = (
  wei: string,
  decimals: number = 4,
  showPrefix: boolean = true
) => {
  let eth

  try {
    eth = parseFloat(ethers.utils.formatEther(wei)).toFixed(decimals)
  } catch (err) {
    return eth
  }

  return showPrefix ? 'Ξ' + eth : eth
}

/**
 * Parse Eth String
 *
 * @returns truncated ether value if the input
 * is able to be parsed.
 */
export const parseEthString = (ethUnsafe: string, decimals: number = 4) => {
  let eth

  try {
    // Attempt to parse the unsafe ether input.
    const wei = ethers.utils.parseEther(ethUnsafe)

    // If successful, format the value.
    eth = weiToEth(wei.toString(), decimals, false)
  } catch (err) {}

  return eth
}
