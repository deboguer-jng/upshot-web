export const GMI_LABELS = {
  0: 'ngmi',
  1: 'Tourist',
  2: 'Part Degen',
  3: 'Full Degen',
  4: 'Based',
  5: 'Based God',
}

// Returns the raw label index for a gmi score.
export const gmiIndex = (gmi: number) => {
  if (gmi < 100) return 0
  if (gmi < 400) return 1
  if (gmi < 700) return 2
  if (gmi < 900) return 3
  if (gmi < 975) return 4
  return 5
}

// Returns a label for a given gmi score.
export const gmiLabel = (gmi: number) => GMI_LABELS[gmiIndex(gmi)]

// Returns [isTopPercentRank, percentRank]
export const gmiPercentRank = (percentile: number) => {
  if (!percentile) return [false, 0.1]

  if (percentile < 0.1) return [true, 0.1]
  if (percentile < 0.5) return [true, 0.5]
  if (percentile < 1) return [true, 1]
  if (percentile < 2.5) return [true, 2.5]
  if (percentile < 5) return [true, 5]
  if (percentile < 10) return [true, 10]
  if (percentile < 15) return [true, 15]
  if (percentile < 20) return [true, 20]
  if (percentile < 25) return [true, 25]
  if (percentile < 30) return [true, 30]
  if (percentile < 35) return [true, 35]
  if (percentile < 40) return [true, 40]
  if (percentile < 45) return [true, 45]
  if (percentile < 50) return [true, 50]
  if (percentile < 55) return [false, 50]
  if (percentile < 60) return [false, 45]
  if (percentile < 65) return [false, 40]
  if (percentile < 70) return [false, 35]
  if (percentile < 75) return [false, 30]
  if (percentile < 80) return [false, 25]
  if (percentile < 85) return [false, 20]
  if (percentile < 80) return [false, 15]
  if (percentile < 95) return [false, 10]
  if (percentile < 97.5) return [false, 5]
  if (percentile < 99) return [false, 2.5]
  if (percentile < 99.5) return [false, 1]
  if (percentile < 99.9) return [false, 0.5]
  return [false, 0.1]
}
