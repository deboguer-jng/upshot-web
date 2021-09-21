import { useQuery } from '@apollo/client'
import { Flex, Image, Text } from '@upshot-tech/upshot-ui'
import {
  CollectionButton,
  CollectionButtonTemplate,
} from '@upshot-tech/upshot-ui'
import { useState } from 'react'
import { weiToEth } from 'utils/number'

import {
  GET_COLLECTION_AVG_PRICE,
  GetCollectionAvgPriceData,
  GetCollectionAvgPriceVars,
} from '../queries'
import CollectionPanel from './CollectionPanel'

export default function CollectionAvgPricePanel() {
  const [searchTerm, setSearechTerm] = useState('')
  const [searchTermApplied, setSearchTermApplied] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    setSearchTermApplied(searchTerm)
  }

  const { loading, error, data } = useQuery<
    GetCollectionAvgPriceData,
    GetCollectionAvgPriceVars
  >(GET_COLLECTION_AVG_PRICE, {
    errorPolicy: 'all',
    variables: { limit: 12, metric: 'AVERAGE', name: searchTermApplied },
  })

  const title = 'Collection Avg. Price'
  const subtitle = '(Select Collections to change graph)'

  if (error)
    return (
      <CollectionPanel {...{ title, subtitle }}>
        There was an error completing your request.
      </CollectionPanel>
    )

  if (loading)
    return (
      <CollectionPanel {...{ title, subtitle }}>
        {[...new Array(12)].map((_, idx) => (
          <Flex
            key={idx}
            sx={{ alignItems: 'center', color: 'disabled', gap: 2 }}
          >
            <Text>{idx + 1}</Text>
            <CollectionButtonTemplate />
          </Flex>
        ))}
      </CollectionPanel>
    )

  if (!data?.orderedCollectionsByMetricSearch.length)
    return (
      <CollectionPanel {...{ title, subtitle }}>
        No results available.
      </CollectionPanel>
    )

  return (
    <CollectionPanel
      inputProps={{
        value: searchTerm,
        onChange: (e) => setSearechTerm(e.currentTarget.value),
      }}
      onSearch={handleSearch}
      {...{ title, subtitle }}
    >
      {data.orderedCollectionsByMetricSearch.map(
        ({ name, imageUrl, average }, idx) => (
          <Flex
            key={idx}
            sx={{ alignItems: 'center', color: 'disabled', gap: 2 }}
          >
            <Text>{idx + 1}</Text>
            <CollectionButton
              icon={
                <Image
                  alt={`${name} Cover Artwork`}
                  height="100%"
                  width="100%"
                  sx={{ borderRadius: 'circle' }}
                  src={imageUrl}
                />
              }
              text={name ?? 'Unknown'}
              subText={average ? weiToEth(average) : '-'}
            />
          </Flex>
        )
      )}
    </CollectionPanel>
  )
}
