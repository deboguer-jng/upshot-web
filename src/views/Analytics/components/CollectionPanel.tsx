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
          columns={[1, 1, 2, 4]}
          sx={{ columnGap: '32px', rowGap: '16px' }}
          {...{ children }}
        />
      </Flex>
    </Panel>
  )
})
