/**
 * Chart series: Demo values
 */
export const chartData = [
  {
    name: 'CryptoPunks',
    data: [...new Array(10)].map((_) => Math.floor(Math.random() * 10 + 1)),
  },
  {
    name: 'Pudgy Penguins',
    data: [...new Array(10)].map((_) => Math.floor(Math.random() * 10 + 1)),
  },
  {
    name: 'Art Blocks',
    data: [...new Array(10)].map((_) => Math.floor(Math.random() * 10 + 1)),
  },
]

/**
 * Collection buttons: Demo items
 */
const names = ['CryptoPunks', 'Meebits', 'Bored Apes']
export const collectionItems = [...new Array(12)].map((_, i) => ({
  text: names[i % names.length],
  subText: (Math.random() * 5 + 5).toFixed(1) + 'ETH',
  src: '/img/demo/' + names[i % names.length] + '.png',
}))
