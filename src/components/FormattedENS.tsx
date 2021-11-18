import { Text } from '@upshot-tech/upshot-ui'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { fetchEns, shortenAddress } from 'utils/address'

export const FormattedENS = ({ address }: { address?: string }) => {
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

  return <Text>{formattedAddress}</Text>
}
