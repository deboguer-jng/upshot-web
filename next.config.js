module.exports = {
  reactStrictMode: true,
  webpack5: true,
  productionBrowserSourceMaps: true,
  async rewrites() {
    return [
      {
        source: '/analytics/nft/:contractAddress/:tokenId',
        destination: '/dashboard/nft/:contractAddress/:tokenId',
      },
      {
        source: '/analytics/collection/:id',
        destination: '/dashboard/collection/:id',
      },
      {
        source: '/analytics/collection/:id/items',
        destination: '/dashboard/collection/:id/items',
      },
      {
        source: '/analytics/user/:address',
        destination: '/dashboard/user/:address',
      },
      {
        source: '/analytics',
        destination: '/dashboard',
      },
      {
        source: '/analytics/search',
        destination: '/dashboard/search',
      },
      {
        source: '/analytics/user/:address/settings',
        destination: '/dashboard/user/:address/settings'
      }
    ]
  },
}
