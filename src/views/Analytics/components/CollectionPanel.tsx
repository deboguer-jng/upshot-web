import { useTheme } from '@emotion/react'
import { InputRoundedSearch, useBreakpointIndex } from '@upshot-tech/upshot-ui'
import { Flex, Grid, Panel, Text } from '@upshot-tech/upshot-ui'
import React, { forwardRef, useState } from 'react'

interface CollectionPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Title for the panel.
   */
  title: string
  /**
   * Helper text for the panel.
   */
  subtitle: string
  /**
   * Search input props
   */
  inputProps?: {
    ref: React.Ref<HTMLInputElement>
  }
  /**
   * Search form submission
   */
  onSearch?: (e: React.FormEvent | React.MouseEvent) => void
}

const splitArray = (arr) => {
  let i
  let j
  let temporary = []
  const array = new Array<Array<HTMLElement>>()
  let chunk = 5
  for (i = 0, j = arr.length; i < j; i += chunk) {
    temporary = arr.slice(i, i + chunk)
    array.push(temporary)
    // do whatever
  }
  return array
}

export default forwardRef(function CollectionPanel(
  {
    title,
    subtitle,
    children,
    inputProps,
    onSearch,
    ...props
  }: CollectionPanelProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  /**
   * Auto apply search filter with 500ms timeout.
   */
  const [autoFilter, setAutoFilter] = useState<any>()
  const theme = useTheme()
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  const handleChange = (e: React.ChangeEvent) => {
    if (autoFilter) {
      clearTimeout(autoFilter)
      setAutoFilter(undefined)
    }

    setAutoFilter(
      setTimeout(() => {
        onSearch?.(e)
      }, 500)
    )
  }

  const childrenArray = React.Children.toArray(children)

  const searchStyle = isMobile
    ? {}
    : { justifyContent: 'flex-end', alignItems: 'stretch' }

  return (
    <Panel {...{ ref, ...props }}>
      <Flex sx={{ flexDirection: 'column', gap: 4 }}>
        <Flex
          sx={{
            justifyContent: 'space-between',
            flexDirection: ['column', 'column', 'row'],
            gap: 2,
          }}
        >
          <Flex sx={{ flexDirection: 'column' }}>
            <Flex
              variant="text.h1Secondary"
              sx={{ gap: 2, lineHeight: '2rem' }}
            >
              {title}
            </Flex>
            <Text
              color="grey-500"
              sx={{ fontSize: 2, marginTop: '2px', marginBottom: '4px' }}
            >
              {subtitle}
            </Text>
          </Flex>
          <Flex sx={searchStyle}>
            <form style={isMobile ? { width: '100%' } : {}} onSubmit={onSearch}>
              <InputRoundedSearch
                dark
                fullWidth
                variant="search"
                onChange={handleChange}
                buttonProps={{
                  type: 'button',
                  onClick: onSearch,
                }}
                {...inputProps}
              />
            </form>
          </Flex>
        </Flex>
        <Grid
          sx={{
            gridAutoColumns: [null, null, 282],
            gridAutoFlow: [null, null, 'column'],
            overflowX: ['hidden', 'hidden', 'auto'],
            overflowY: ['auto', 'auto', 'hidden'],
            gridTemplateRows: [null, null, '1fr'],
            paddingBottom: '12px',
            paddingRight: [2, 2, null],
            gap: '20px',
            height: [300, 300, 'auto'],
          }}
          css={theme.scroll.thin}
        >
          {(splitArray(childrenArray) as Array<Array<HTMLElement>>).map(
            (subArray, index) => (
              <Grid
                key={index}
                sx={{
                  columnGap: '32px',
                  rowGap: '16px',
                  gridTemplateRows: 'repeat(4, 1fr)',
                }}
              >
                {subArray}
              </Grid>
            )
          )}
        </Grid>
      </Flex>
    </Panel>
  )
})
