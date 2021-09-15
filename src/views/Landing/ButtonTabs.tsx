import { Button, Flex } from '@upshot-tech/upshot-ui'
import { useState } from 'react'

export const METRICS = {
  AVERAGE: 'Average Price',
  VOLUME: 'Total Volume',
  FLOOR: 'Floor Price',
}

export type METRIC = keyof typeof METRICS

interface ButtonTabsProps {
  onChange?: (tab: METRIC) => void
}

export default function ButtonTabs({ onChange }: ButtonTabsProps) {
  console.log('TABS')
  const [selected, setSelected] = useState(0)

  const handleChange = (idx: number) => {
    setSelected(idx)
    onChange?.(Object.keys(METRICS)[idx] as METRIC)
    console.log(idx)
  }

  return (
    <Flex sx={{ gap: 2, flexWrap: 'wrap' }}>
      {Object.values(METRICS).map((children, idx) => (
        <Button
          key={idx}
          variant={selected === idx ? 'primary' : 'secondary'}
          color="primary"
          onClick={() => handleChange(idx)}
          {...{ children }}
        />
      ))}
    </Flex>
  )
}
