import { useLazyQuery } from '@apollo/client'
import {
  GET_META_ASSET,
  GetMetaAssetData,
  GetMetaAssetVars,
} from 'graphql/queries'
import {
  GET_META_COLLECTION,
  GetMetaCollectionData,
  GetMetaCollectionVars,
} from 'graphql/queries'
import {
  GET_META_COLLECTOR,
  GetMetaCollectorData,
  GetMetaCollectorVars,
} from 'graphql/queries'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

interface MetaProps {
  title?: string
  description?: string
  image?: string
  twitterCard?: 'summary_large_image'
  subtitle?: string
}

function Meta({
  title = 'Upshot Analytics',
  description = 'NFTs offer us a vehicle for tokenizing anything, while the explosive growth of DeFi has demonstrated the power of permissionless financial primitives. Upshot is building scalable NFT pricing infrastructure at the intersection of DeFi x NFTs. Through a combination of crowdsourced appraisals and proprietary machine learning algorithms, Upshot provides deep insight into NFT markets and unlocks a wave of exotic new DeFi possibilities.',
  image = 'https://upshot.io/img/opengraph/opengraph_analytics.jpg',
  twitterCard = 'summary_large_image',
  subtitle,
}: MetaProps) {
  const fullTitle = [subtitle, title].filter(Boolean).join(' | ')

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />

      {/* Google */}
      <meta itemProp="name" content={fullTitle} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={image} />

      {/* Facebook */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:card" content={twitterCard} />
    </Head>
  )
}

export default function Metadata() {
  const [subtitle, setSubtitle] = useState<string>()
  const [image, setImage] = useState<string>()
  const parts = useMemo(
    () =>
      typeof window === 'undefined'
        ? []
        : (window.location.pathname || '/').slice(1).split('/'),
    []
  )

  const [getMetaAsset] = useLazyQuery<GetMetaAssetData, GetMetaAssetVars>(
    GET_META_ASSET,
    {
      notifyOnNetworkStatusChange: true,
      onCompleted: (data) => {
        setSubtitle(data?.assetById?.name)
        setImage(data?.assetById?.previewImageUrl)
      },
    }
  )

  const [getMetaCollection] = useLazyQuery<
    GetMetaCollectionData,
    GetMetaCollectionVars
  >(GET_META_COLLECTION, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setSubtitle(data?.collectionById?.name)
      setImage(data?.collectionById?.imageUrl)
    },
  })

  const [getMetaCollector] = useLazyQuery<
    GetMetaCollectorData,
    GetMetaCollectorVars
  >(GET_META_COLLECTOR, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setSubtitle(
        data?.getUser?.addresses?.[0]?.ens ??
          data?.getUser?.addresses?.[0]?.address
      )
    },
  })

  useEffect(() => {
    if (parts[1] === 'collection' && parts[2]) {
      getMetaCollection({ variables: { id: Number(parts[2]) } })
    } else if (parts[1] === 'nft' && parts[2]) {
      getMetaAsset({ variables: { id: [parts[2], parts[3]].join('/') } })
    } else if (parts[1] === 'user' && parts[2]) {
      const address = parts[2].startsWith('0x') ? parts[2] : undefined
      const ens = parts[2].endsWith('.eth') ? parts[2] : undefined

      getMetaCollector({ variables: { address, ens } })
    } else {
      setSubtitle(undefined)
      setImage(undefined)
    }
  }, [getMetaAsset, getMetaCollection, getMetaCollector, parts])

  // Synchronous metadata
  if (parts[0] === 'gmi' && parts[1]) {
    const wallet = parts[1].split('?')[0]

    return (
      <Meta
        subtitle="gmi"
        image={`https://stage.analytics.upshot.io/.netlify/functions/gmi?wallet=${encodeURIComponent(
          wallet
        )}&lastUpdated=${Date.now()}&fileType=.png`}
      />
    )
  } else if (parts[0] === 'waitlist') {
    return <Meta subtitle="Waitlist" />
  } else if (parts[1] === 'search') {
    return <Meta subtitle="Search" />
  } else if (parts[0] === 'faq') {
    return <Meta subtitle="FAQ" />
  }

  // Async metadata
  return <Meta {...{ subtitle, image }} />
}
