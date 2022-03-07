/** @jsxImportSource theme-ui */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { Text, TextProps } from 'theme-ui'
import { fetchEns, shortenAddress } from 'utils/address'

interface FormattedENSProps extends TextProps {
  address?: string
}

export const FormattedENS = ({ address, ...props }: FormattedENSProps) => {
  const [formattedAddress, setFormattedAddress] = useState(
    address ? shortenAddress(address, 2, 4) : '-'
  )

  useEffect(() => {
    if (!address) return

    const updateEns = async () => {
      try {
        const { name } = await fetchEns(address, ethers.getDefaultProvider())
        if (!name) return

        setFormattedAddress(name)
      } catch (err) {
        console.error(err)
      }
    }

    updateEns()
  }, [address])

  return <Text {...props}>{formattedAddress}</Text>
}
