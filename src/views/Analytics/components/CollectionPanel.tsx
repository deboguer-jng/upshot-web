import { useTheme } from '@emotion/react'
import { InputRoundedSearch } from '@upshot-tech/upshot-ui'
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
  const arrayGroups = childrenArray.reduce((all, one, i) => {
    const ch = Math.floor(i / 4)
    all[ch] = [].concat(all[ch] || [], one as any)
    return all
  }, [])

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
          <Flex sx={{ justifyContent: 'flex-end', alignItems: 'stretch' }}>
            <form onSubmit={onSearch}>
              <InputRoundedSearch
                dark
                fullWidth
                hasButton
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
            gridAutoColumns: 293,
            gridAutoFlow: 'column',
            overflowX: 'auto',
            gridTemplateRows: '1fr',
            paddingBottom: '12px',
          }}
          css={theme.scroll.thin}
        >
          {(arrayGroups as Array<HTMLElement>).map((subArray, index) => (
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
          ))}
        </Grid>
      </Flex>
    </Panel>
  )
})
