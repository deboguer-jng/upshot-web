import { IconButton, Panel, useTheme } from '@upshot-tech/upshot-ui'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { usePopper } from 'react-popper'

export default function AlertSettingsModal(props) {
  const { theme } = useTheme()
  const [open, setOpen] = useState(false)
  const elRef = useRef<HTMLButtonElement>(null)
  const popperRef = useRef<HTMLDivElement>(null)
  const { styles, attributes } = usePopper(elRef.current, popperRef.current, {
    placement: 'auto',
    modifiers: [
      {
        name: 'overflow',
        options: {
          preventOverflow: true,
        },
      },
      {
        name: 'offset',
        options: {
          offset: [0, 20],
        },
      },
    ],
  })

  useEffect(() => {
    document.addEventListener('click', (e) => {
      if ((e.target as HTMLDivElement).classList.contains('popperButton'))
        return
    })
  }, [])

  // console.log(open, 'open');
  return (
    <>
      <IconButton ref={elRef} onClick={() => setOpen(!open)}>
        <Image src="/img/arch.svg" width={20} height={20} alt="alert icon" />
      </IconButton>
      <div
        ref={popperRef}
        style={{
          ...styles.popper,
          ...{
            zIndex: theme.zIndex.nav + 3,
          },
        }}
        {...attributes.popper}
      >
        {open && (
          <Panel
            sx={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: 2,
              maxWidth: '400px',
              gap: 4,
            }}
            className="alertModal"
          >
            {props.children}
          </Panel>
        )}
      </div>
    </>
  )
}
