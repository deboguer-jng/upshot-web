/** @jsxImportSource theme-ui */
import { Box, Flex, FlexProps } from '@theme-ui/components'
import { Breadcrumb, Link } from '@upshot-tech/upshot-ui'
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
          <Link href={crumb.link} key={idx} noHover>
            <Box sx={{ marginRight: 3 }}>
              <Breadcrumb text={crumb.text} />
            </Box>
          </Link>
        ))}
    </Flex>
  )
}

export default Breadcrumbs
