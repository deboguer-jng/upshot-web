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

export const gmiPercentRank = (percentile: number) => {
  if (!percentile) return 100

  if (percentile < 0.1) return 0.1
  if (percentile < 0.5) return 0.5
  if (percentile < 1) return 1
  if (percentile < 2.5) return 2.5
  if (percentile < 5) return 5
  if (percentile < 10) return 10
  if (percentile < 15) return 15
  if (percentile < 20) return 20
  if (percentile < 25) return 25
  if (percentile < 30) return 30
  if (percentile < 35) return 35
  if (percentile < 40) return 40
  if (percentile < 45) return 45
  if (percentile < 50) return 50
  if (percentile < 55) return 55
  if (percentile < 60) return 60
  if (percentile < 65) return 65
  if (percentile < 70) return 70
  if (percentile < 75) return 75
  if (percentile < 80) return 80
  if (percentile < 85) return 85
  if (percentile < 90) return 90
  if (percentile < 95) return 95
  if (percentile < 99) return 99
  return 100
}
