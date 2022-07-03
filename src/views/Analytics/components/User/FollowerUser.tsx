import { useQuery } from '@apollo/client'
import { Button, FollowerModal, Modal } from '@upshot-tech/upshot-ui'
import makeBlockie from 'ethereum-blockies-base64'
import { useState } from 'react'
import { extractEns, shortenAddress } from 'utils/address'

import {
  GET_USER_FOLLOW_DATA,
  GetUserFollowData,
  GetUserFollowDataVar,
} from '../../User/queries'

export default function FollowerUser({
  userId,
  displayName,
}: {
  userId: number
  displayName
}) {
  const [open, setOpen] = useState(false)

  const { loading: userFollowLoading, data: userFollowData } = useQuery<
    GetUserFollowData,
    GetUserFollowDataVar
  >(GET_USER_FOLLOW_DATA, {
    variables: { userId },
  })

  const onFollowSelect = (value: number) => {
  }
  let formatFollowers: any = []
  let formatFollowings: any = []
  const getNameFromAddresses = (
    addresses: { address: string; ens: string }[]
  ) => {
    return (
      extractEns(addresses, addresses[0]?.address) ||
      shortenAddress(addresses[0]?.address)
    )
  }

  //format user followers and followings user  data
  if (!userFollowLoading) {
    const followings: any[] = userFollowData?.usersFollowedByUser || []
    const followers: any[] = userFollowData?.usersFollowingUser || []

    formatFollowings = followings.map((user) => ({
      id: user.id,
      address: getNameFromAddresses(user.addresses),
      img: makeBlockie(user.addresses[0].address),
    }))

    formatFollowers = followers.map((user) => ({
      id: user.id,
      address: getNameFromAddresses(user.addresses),
      img: makeBlockie(user.addresses[0].address),
      isFollowing:
        followings.filter((followingUser) => user.id === followingUser.id)
          .length > 0,
    }))
  }
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(!open)}>
        {' '}
        + Follow{' '}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        {!userFollowLoading ? (
          <FollowerModal
            onFollow={onFollowSelect}
            onClose={() => setOpen(false)}
            userAddress={displayName}
            follower={formatFollowers}
            following={formatFollowings}
          />
        ) : (
          ''
        )}
      </Modal>
    </>
  )
}
