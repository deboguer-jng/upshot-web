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
