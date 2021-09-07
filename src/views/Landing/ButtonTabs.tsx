import { Button, Flex } from '@upshot-tech/upshot-ui'
import { useState } from 'react'

export default function ButtonTabs() {
  const [selected, setSelected] = useState(0)

  return (
    <Flex sx={{ gap: 2, flexWrap: 'wrap' }}>
      {[
        'Average Price',
        'Total Volume',
        'List To Sale Time',
        'Floor Price',
      ].map((children, idx) => (
        <Button
          key={idx}
          variant={selected === idx ? 'primary' : 'secondary'}
          color="primary"
          onClick={() => setSelected(idx)}
          {...{ children }}
        />
      ))}
    </Flex>
  )
}
