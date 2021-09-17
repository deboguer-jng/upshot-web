import { ethers } from 'ethers'

/**
 * Wei to Eth
 *
 * @param {string} wei
 * @param {number} decimals
 * @param {boolean} showPrefix
 * @returns {string}
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
 * Tries to parse a non-NaN user-provided form input string
 * to ether.
 *
 * @param {string}
 * @returns {string?} parsed ether
 */
export const parseEthString = (numStr: string, decimals: number = 4) => {
  let eth

  try {
    const wei = ethers.utils.parseEther(numStr)
    eth = weiToEth(wei.toString(), decimals, false)
  } catch (err) {}

  return eth
}
