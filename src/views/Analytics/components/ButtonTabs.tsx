import { useBreakpointIndex } from '@upshot-tech/upshot-ui'
import { Button, Flex, SliderFade } from '@upshot-tech/upshot-ui'
import { useState } from 'react'

export const METRICS = {
  VOLUME: 'Weekly Volume',
  FLOOR: 'Floor Price',
  AVERAGE: 'Average Price',
}

export type METRIC = keyof typeof METRICS

interface ButtonTabsProps {
  onChange?: (tab: METRIC) => void
}

export default function ButtonTabs({ onChange }: ButtonTabsProps) {
  const [selected, setSelected] = useState(0)
  const isMobile = useBreakpointIndex() <= 1

  const handleChange = (idx: number) => {
    setSelected(idx)
    onChange?.(Object.keys(METRICS)[idx] as METRIC)
  }

  const renderButtons = () => {
    return (
      <>
        {Object.values(METRICS)
          .map((children, idx) => (
            <Button
              key={idx}
              variant="primary"
              toggled={selected === idx}
              onClick={() => handleChange(idx)}
              {...{ children }}
            />
          ))}
      </>
    )
  }

  return (
    <>
      {isMobile ? (
        <SliderFade>
          <Flex
            sx={{
              gap: 4,
              width: 'fit-content',
              justifyContent: ['center', 'center', 'flex-start'],
              padding: '0.25rem',
            }}
          >
            {renderButtons()}
          </Flex>
        </SliderFade>
      ) : (
        <Flex
          sx={{
            gap: 4,
            flexWrap: 'wrap',
            justifyContent: ['center', 'center', 'flex-start'],
          }}
        >
          {renderButtons()}
        </Flex>
      )}
    </>
  )
}
