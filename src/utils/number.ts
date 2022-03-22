import { formatNumber } from '@upshot-tech/upshot-ui'
import { ethers } from 'ethers'

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
    eth = formatNumber(wei.toString(), { fromWei: true, decimals })
  } catch (err) {}

  return eth
}

/**
 * Get price change label.
 *
 * @returns + prefixed percent if positive, - prefixed percent if negative.
 */
export const getPriceChangeLabel = (val: number | null) => {
  if (val === undefined || val === null) return '-'

  const percentChange = val.toFixed(2) + '%'
  return val > 0 ? '+' + percentChange : percentChange
}

/**
 * Get underpriced/overpriced label.
 *
 * @returns (underpriced) appended if underpriced, - (overpriced) appended if overpriced.
 */
export const getUnderOverPricedLabel = (val: number | null) => {
  if (val === undefined || val === null) return '-'

  const percentChange = Math.abs(val).toFixed(2) + '%'
  return val > 0
    ? percentChange + ' (underpriced)'
    : percentChange + ' (overpriced)'
}
