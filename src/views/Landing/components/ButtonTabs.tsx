import { Button, Flex } from '@upshot-tech/upshot-ui'
import { useState } from 'react'

export const METRICS = {
  VOLUME: 'Total Volume',
  AVERAGE: 'Average Price',
  FLOOR: 'Floor Price',
}

export type METRIC = keyof typeof METRICS

interface ButtonTabsProps {
  onChange?: (tab: METRIC) => void
}

export default function ButtonTabs({ onChange }: ButtonTabsProps) {
  const [selected, setSelected] = useState(0)

  const handleChange = (idx: number) => {
    setSelected(idx)
    onChange?.(Object.keys(METRICS)[idx] as METRIC)
  }

  return (
    <Flex sx={{ gap: 4, flexWrap: 'wrap' }}>
      {Object.values(METRICS).map((children, idx) => (
        <Button
          key={idx}
          variant="primary"
          toggled={selected === idx}
          onClick={() => handleChange(idx)}
          {...{ children }}
        />
      ))}
    </Flex>
  )
}
