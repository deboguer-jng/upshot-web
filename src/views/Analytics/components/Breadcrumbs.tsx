/** @jsxImportSource theme-ui */
import React from 'react'
import Link from 'next/link'
import { Breadcrumb } from '@upshot-tech/upshot-ui'
import { Flex } from '@theme-ui/components'

interface BreadcrumbsProps {
  crumbs: Array<{
    text: string
    link: string
  }>
}

function Breadcrumbs ({
  crumbs
}: BreadcrumbsProps) {
  return (
    <Flex>
      {crumbs?.filter(crumb => !!crumb).map(crumb => (
        <Link href={crumb.link}>
          <Breadcrumb text={crumb.text} sx={{marginRight: 3}} />
        </Link>
      ))}
    </Flex>
  )
}

export default Breadcrumbs
