import { InputRoundedSearch } from '@upshot-tech/upshot-ui'
import { Flex, Grid, Panel, Text } from '@upshot-tech/upshot-ui'
import React, { forwardRef } from 'react'

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
            <Flex variant="text.h1Secondary" sx={{ gap: 2 }}>
              {title}
            </Flex>
            <Text color="grey-500" sx={{ fontSize: 2 }}>
              {subtitle}
            </Text>
          </Flex>
          <Flex sx={{ justifyContent: 'flex-end', alignItems: 'stretch' }}>
            <form onSubmit={onSearch}>
              <InputRoundedSearch
                dark
                fullWidth
                hasButton
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
