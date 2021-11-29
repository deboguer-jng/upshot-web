/** @jsxImportSource theme-ui */
import React from 'react'
import { Box, Flex } from '@theme-ui/components'
import { Breadcrumb } from '@upshot-tech/upshot-ui'
import Link from 'next/link'

interface BreadcrumbsProps {
  crumbs: Array<{
    text: string
    link: string
  }>
}

function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  return (
    <Flex>
      {crumbs
        ?.filter((crumb) => !!crumb)
        .map((crumb) => (
          <Link href={crumb.link}>
            <Box sx={{ marginRight: 3 }}>
              <Breadcrumb text={crumb.text} />
            </Box>
          </Link>
        ))}
    </Flex>
  )
}

export default Breadcrumbs
