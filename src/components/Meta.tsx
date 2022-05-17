import Head from 'next/head'

interface MetaProps {
  title?: string
  description?: string
  image?: string
  twitterCard?: 'summary_large_image'
}

export default function Meta({
  title,
  description,
  image,
  twitterCard = 'summary_large_image',
}: MetaProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Google */}
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      {!!image && <meta itemProp="image" content={image} />}

      {/* Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {!!image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {!!image && (
        <>
          <meta name="twitter:image" content={image} />
          <meta name="twitter:card" content={twitterCard} />
        </>
      )}
    </Head>
  )
}
