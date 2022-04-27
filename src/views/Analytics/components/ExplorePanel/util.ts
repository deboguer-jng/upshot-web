import { GetExploreNFTsVars } from '../../queries'

/**
 * The order direction is manually corrected for fields
 * we've formatted to other values at the frontend (e.g.
 * timestamps are requested in ASC order for DESC durations
 * after calculating NOW - timestamp.)
 */
export const getOrderDirection = (col: string, isAscending: boolean) => {
  const reversedColumns = ['LAST_SALE_DATE', 'LIST_TIMESTAMP', 'RARITY']

  if (reversedColumns.includes(col)) return !isAscending ? 'ASC' : 'DESC'

  return isAscending ? 'ASC' : 'DESC'
}

/**
 * Checks if the GlobalAssetSearch has a filter applied (which affects)
 * the total returned asset count.
 */
export const lacksGlobalAssetFilters = (variables: GetExploreNFTsVars) => {
  const queryArgs = Object.keys(variables).filter((arg) => variables[arg])

  const isUnfiltered =
    ['limit', 'offset', 'searchTerm', 'orderColumn', 'orderDirection'].filter(
      (val) => queryArgs.includes(val)
    ).length === queryArgs.length

  return isUnfiltered
}
