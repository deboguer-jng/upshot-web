export const getAssetName = (
  name?: string,
  collection?: string,
  tokenId?: string
) => {
  /* If we have the name of an NFT, always use that name. */
  if (name) return name

  /* As a fallback, try to use Collection #TokenID  */
  if (collection && tokenId) return `${collection} #${tokenId}`

  /* If we don't know the name or the contract, return "Unknown" */
  return 'Unknown'
}
