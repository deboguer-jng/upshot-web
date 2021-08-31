import { CollectionButton, Panel } from '@upshot-tech/upshot-ui'
import { Flex, Grid, Icon, Image, Text } from '@upshot-tech/upshot-ui'

import { collectionItems } from './constants'

interface Props {
  /**
   * Title for the panel.
   */
  title: string
  /**
   * Helper text for the panel.
   */
  subtitle: string
}

export default function CollectionPanel({ title, subtitle }: Props) {
  return (
    <Panel>
      <Flex sx={{ flexDirection: 'column', gap: 4 }}>
        <Flex sx={{ flexDirection: 'column' }}>
          <Flex variant="text.h3Secondary" sx={{ gap: 2 }}>
            {title}
            <Flex
              color="primary"
              sx={{ justifyContent: 'center', alignItems: 'center', gap: 2 }}
            >
              High to Low
              <Icon icon="arrowDropUserBubble" color="primary" size={12} />
            </Flex>
          </Flex>
          <Text color="grey-500" sx={{ fontSize: 2 }}>
            {subtitle}
          </Text>
        </Flex>

        <Grid columns={[1, 1, 2, 3]}>
          {collectionItems.map(({ text, subText, src }, idx) => (
            <Flex
              key={idx}
              sx={{
                alignItems: 'center',
                color: 'disabled',
                gap: 2,
              }}
            >
              <Text>{idx + 1}</Text>
              <CollectionButton
                icon={
                  <Image
                    alt={`${text} Cover Artwork`}
                    height="100%"
                    width="100%"
                    sx={{ borderRadius: 'circle' }}
                    {...{ src }}
                  />
                }
                {...{ text, subText }}
              />
            </Flex>
          ))}
        </Grid>
      </Flex>
    </Panel>
  )
}
