import { ethers } from 'ethers'
const BN = ethers.BigNumber

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

/**
 * Format currency with decimals + symbol.
 */
export const formatCurrencyUnits = (
  amount: string,
  decimals: number = 18,
  precision: number = 4
) => {
  const denom = BN.from(10).pow(decimals)
  const pow = BN.from(10).pow(precision)
  const val = BN.from(amount).mul(pow).div(denom).toNumber()

  return (val / 10 ** precision).toFixed(precision)
}

/**
 * Get price change label.
 *
 * @returns + prefixed percent if positive, - prefixed percent if negative.
 */
export const getPriceChangeLabel = (val: number | null) => {
  if (val === null) return '-'

  const percentChange = val.toFixed(2) + '%'
  return val > 0 ? '+' + percentChange : percentChange
}
