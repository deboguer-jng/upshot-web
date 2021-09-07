import { InputRoundedSearch } from '@upshot-tech/upshot-ui'
import { Flex, Icon, Panel } from '@upshot-tech/upshot-ui'
import React, { forwardRef } from 'react'

interface ExplorePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Title for the panel.
   */
  title: string
}

export default forwardRef(function CollectionPanel(
  { title, children, ...props }: ExplorePanelProps,
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
            <Flex variant="text.h3Secondary" sx={{ gap: 2 }}>
              {title}
              <Flex
                color="primary"
                sx={{ justifyContent: 'center', alignItems: 'center', gap: 2 }}
              >
                NFTs
                <Icon icon="arrowDropUserBubble" color="primary" size={12} />
              </Flex>
            </Flex>
          </Flex>
          <Flex sx={{ justifyContent: 'flex-end', alignItems: 'stretch' }}>
            <InputRoundedSearch dark fullWidth hasButton />
          </Flex>
        </Flex>
        {children}
      </Flex>
    </Panel>
  )
})
