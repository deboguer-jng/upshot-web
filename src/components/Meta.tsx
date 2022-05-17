import Head from 'next/head'

interface MetaProps {
  title?: string
  description?: string
  image?: string
  twitterCard?: 'summary_large_image'
  subtitle?: string
}

export default function Meta({
  title = 'Upshot Analytics',
  description = 'NFTs offer us a vehicle for tokenizing anything, while the explosive growth of DeFi has demonstrated the power of permissionless financial primitives. Upshot is building scalable NFT pricing infrastructure at the intersection of DeFi x NFTs. Through a combination of crowdsourced appraisals and proprietary machine learning algorithms, Upshot provides deep insight into NFT markets and unlocks a wave of exotic new DeFi possibilities.',
  image = 'https://upshot.io/img/opengraph/opengraph_analytics.jpg',
  twitterCard = 'summary_large_image',
  subtitle,
}: MetaProps) {
  return (
    <Head>
      <title>
        {subtitle}
        {!!subtitle ? ' | ' : null}
        {title}
      </title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />

      {/* Google */}
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={image} />

      {/* Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:card" content={twitterCard} />
    </Head>
  )
}
