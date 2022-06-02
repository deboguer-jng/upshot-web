/** @jsxImportSource theme-ui */
import { Box, Flex, FlexProps } from '@theme-ui/components'
import { Breadcrumb, Link } from '@upshot-tech/upshot-ui'
import NextLink from 'next/link'
import React from 'react'
interface BreadcrumbsProps extends FlexProps {
  crumbs: Array<{
    text: string
    link: string
  }>
}

function Breadcrumbs({ crumbs, ...props }: BreadcrumbsProps) {
  return (
    <Flex {...props} sx={{ marginBottom: '10px' }}>
      {crumbs
        ?.filter((crumb) => !!crumb)
        .map((crumb, idx) => (
          <Link href={crumb.link} key={idx} component={NextLink} noHover>
            <Box sx={{ marginRight: 3 }}>
              <Breadcrumb text={crumb.text} />
            </Box>
          </Link>
        ))}
    </Flex>
  )
}

export default Breadcrumbs
