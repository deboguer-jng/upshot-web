import { useLazyQuery } from '@apollo/client'
import { Navbar } from '@upshot-tech/upshot-ui'
import {
  GET_NAV_BAR_COLLECTIONS,
  GetNavBarCollectionsData,
  GetNavBarCollectionsVars,
} from 'graphql/queries'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

export const Nav = () => {
  const router = useRouter()
  const [navSearchTerm, setNavSearchTerm] = useState('')
  const [getNavCollections, { data: navCollectionsData }] = useLazyQuery<
    GetNavBarCollectionsData,
    GetNavBarCollectionsVars
  >(GET_NAV_BAR_COLLECTIONS)

  const handleNavKeyUp = () => {
    if (navCollectionsData?.collections?.assetSets?.length) return

    getNavCollections({ variables: { limit: 1000 } })
  }

  const handleSearchSuggestionChange = (item) => {
    router.push(`/analytics/search?collection=${encodeURIComponent(item.name)}`)
  }

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault()

    router.push(`/analytics/search?query=${encodeURIComponent(navSearchTerm)}`)
  }

  const suggestions = useMemo(() => {
    const suggestions = navCollectionsData?.collections?.assetSets ?? []

    return suggestions.filter(({ name }) =>
      name.toLowerCase().includes(navSearchTerm.toLowerCase())
    )
  }, [navCollectionsData, navSearchTerm])

  return (
    <Navbar
      searchValue={navSearchTerm}
      onSearchValueChange={(e) => setNavSearchTerm(e.currentTarget.value)}
      onSearch={handleNavSearch}
      onLogoClick={() => router.push('/analytics')}
      onSearchSuggestionChange={handleSearchSuggestionChange}
      onSearchKeyUp={handleNavKeyUp}
      searchSuggestions={suggestions}
    />
  )
}
