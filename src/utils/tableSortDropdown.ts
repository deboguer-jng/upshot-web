export const genSortOptions = (
  columns: {}
) => {
  let sortOptions: string[] = []
  for (let key in columns) {
    sortOptions.push(columns[key] + ': low to high')
    sortOptions.push(columns[key] + ': high to low')
  }
  return sortOptions
}

export const handleChangeNFTColumnSortRadio = (
  value: string,
  columns: {},
  handleChangeSelection: (colIdx: number, order?: 'asc' | 'desc') => void
) => {
  const index = genSortOptions(columns).indexOf(value)
  /* it maps 0, 1 -> 0
  2, 3 -> 1
  4, 5 -> 2 */
  const columnIndex = Math.floor(index / 2)
  const order = index % 2 === 0 ? 'asc' : 'desc'
  handleChangeSelection(columnIndex, order)
}

export const getDropdownValue = (
  selectedColumn: number,
  sortAscending: boolean,
  columns: {},
) => {
  /* it maps 0, 1 -> 0
  0 -> 0
  1 -> 2
  2 -> 4
  3 -> 6 */
  const selectedColAsc = selectedColumn * 2
  const orderModifier = sortAscending === true ? 0 : 1

  const selectedValue = genSortOptions(columns)[selectedColAsc + orderModifier]
  return selectedValue
}