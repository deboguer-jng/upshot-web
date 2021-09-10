/**
 * Chart series
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
 * Collection buttons
 */
const names = ['CryptoPunks', 'Meebits', 'Bored Apes']
export const collectionItems = [...new Array(12)].map((_, i) => ({
  text: names[i % names.length],
  subText: (Math.random() * 5 + 5).toFixed(1) + 'ETH',
  src: '/img/demo/collection/' + names[i % names.length] + '.png',
}))

/**
 * Mini NFT Cards
 */
export const cardItems = [...new Array(12)].map((_, i) => ({
  image: '/img/demo/cards/' + (i % 6) + '.png',
}))

/**
 * Transaction table
 */
export const transactionHistory = [...new Array(12)].map((_) => ({
  date: Date.now(),
  sender: '0x0',
  recipient: '0x0',
  price: '3.50',
}))
