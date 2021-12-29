import AavegotchiPNG from './projectLogos/aavegotchi.png'
import BlackPoolPNG from './projectLogos/blackpool.jpeg'
import ChargedPNG from './projectLogos/charged.png'
import FractionalPNG from './projectLogos/fractional.png'
import GeniePNG from './projectLogos/genie.png'
import NFTfiPNG from './projectLogos/nftfi.png'
import NftxPNG from './projectLogos/nftx.png'
import PawnfiPNG from './projectLogos/pawnfi.png'
import PlaceholderPNG from './projectLogos/placeholder.png'
import PolymarketPNG from './projectLogos/polymarket.png'
import PwnPNG from './projectLogos/pwn-finance.png'
import SolvPNG from './projectLogos/solv.png'
import UniclyPNG from './projectLogos/unicly.png'

/* This array contains the content of the landing page panels under the "Discover" section */

let projects = [
  {
    title: 'Genie',
    description:
      'Buy and sell multiple NFTs across all major markets in a single transaction',
    url: 'https://genie.xyz',
    image: GeniePNG,
    projectType: 'Protocol',
  },
  {
    title: 'Arcade.xyz',
    description: 'Lend and borrow non-fungible assets on-chain',
    url: 'https://www.arcade.xyz',
    projectType: 'Protocol',
  },
  {
    title: 'NFTfi',
    description: 'A simple marketplace for NFT collateralized loans',
    url: 'https://nftfi.com',
    image: NFTfiPNG,
    projectType: 'Protocol',
  },
  {
    title: 'Fractional',
    description: 'Fractional ownership of the world’s most sought after NFTs',
    url: 'https://fractional.art',
    image: FractionalPNG,
    projectType: 'Protocol',
  },
  {
    title: 'PWN',
    description:
      'Leverage NFTs in fixed duration loansHarness the power of nested NFTs',
    url: 'https://pwn.finance',
    image: PwnPNG,
    projectType: 'Protocol',
  },
  {
    title: 'Unic.ly',
    description: 'Combine, fractionalize, and trade NFTs',
    url: 'https://www.unic.ly',
    image: UniclyPNG,
    projectType: 'Protocol',
  },
  {
    title: 'NFTX',
    description: 'The liquidity protocol for NFTs',
    url: 'https://nftx.io',
    image: NftxPNG,
    projectType: 'Protocol',
  },
  {
    title: 'Charged Particles',
    description: 'Harness the power of nested NFTs',
    url: 'https://www.charged.fi',
    image: ChargedPNG,
    projectType: 'Protocol',
  },
  {
    title: 'Polymarket',
    description: 'Trade on NFT information markets',
    url: 'https://polymarket.com',
    image: PolymarketPNG,
    projectType: 'Protocol',
  },
  {
    title: 'Solv',
    description: 'Platform for creating, managing and trading Financial NFTs',
    url: 'https://solv.finance/home',
    image: SolvPNG,
    projectType: 'Protocol',
  },
  {
    title: 'Aavegotchi',
    description: 'DeFi-Staked Crypto Collectibles',
    url: 'https://aavegotchi.com/',
    image: AavegotchiPNG,
    projectType: 'Token',
  },
  {
    title: 'BlackPool',
    description: 'A new fund operating within the NFT industry',
    url: 'https://blackpool.finance/',
    image: BlackPoolPNG,
    projectType: 'DAO',
  },
]

export { projects }
