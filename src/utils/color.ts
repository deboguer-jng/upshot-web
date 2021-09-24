/**
 * Get price change color.
 *
 * @returns green if positive, red if negative.
 */
export const getPriceChangeColor = (val: number) => {
  switch (true) {
    case val > 0:
      return 'green'
    case val < 0:
      return 'red'
    default:
      return 'text'
  }
}
