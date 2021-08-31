import { Button, Flex } from '@upshot-tech/upshot-ui'
import { useState } from 'react'

export default function ButtonTabs() {
  const [selected, setSelected] = useState(0)

  return (
    <Flex sx={{ gap: 4 }}>
      {[
        'Average Price',
        'Total Volume',
        'List To Sale Time',
        'Floor Price',
      ].map((children, idx) => (
        <Button
          key={idx}
          type={selected === idx ? 'primary' : 'secondary'}
          onClick={() => setSelected(idx)}
          {...{ children }}
        />
      ))}
    </Flex>
  )
}
