/** @jsxImportSource theme-ui */
import { Box, Flex, FlexProps } from '@theme-ui/components'
import { Breadcrumb } from '@upshot-tech/upshot-ui'
import Link from 'next/link'
import React from 'react'

interface BreadcrumbsProps extends FlexProps {
  crumbs: Array<{
    text: string
    link: string
  }>
}

function Breadcrumbs({ crumbs, ...props }: BreadcrumbsProps) {
  return (
    <Flex {...props}>
      {crumbs
        ?.filter((crumb) => !!crumb)
        .map((crumb, idx) => (
          <Link href={crumb.link} key={idx} passHref>
            <Box sx={{ marginRight: 3 }}>
              <Breadcrumb text={crumb.text} />
            </Box>
          </Link>
        ))}
    </Flex>
  )
}

export default Breadcrumbs
