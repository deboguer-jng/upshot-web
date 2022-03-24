/**
 * The order direction is manually corrected for fields
 * we've formatted to other values at the frontend (e.g.
 * timestamps are requested in ASC order for DESC durations
 * after calculating NOW - timestamp.)
 */
export const getOrderDirection = (col: string, isAscending: boolean) => {
  const reversedColumns = ['LAST_SALE_DATE', 'LIST_TIMESTAMP']

  if (reversedColumns.includes(col)) return !isAscending ? 'ASC' : 'DESC'

  return isAscending ? 'ASC' : 'DESC'
}
