import { useMutation, useQuery } from '@apollo/client'
import { Button, FollowerModal, Modal } from '@upshot-tech/upshot-ui'
import makeBlockie from 'ethereum-blockies-base64'
import {
  FOLLOW_USER,
  FollowUserData,
  FollowUserVars,
  UNFOLLOW_USER,
  UnFollowUserData,
  UnFollowUserVars,
} from 'graphql/mutations'
import {
  GET_USER_FOLLOW_DATA,
  GetUserFollowData,
  GetUserFollowDataVar,
} from 'graphql/queries'
import { useCallback, useEffect, useState } from 'react'
import { extractEns, shortenAddress } from 'utils/address'

export default function FollowerUser({
  userId,
  displayName,
}: {
  userId: number
  displayName
}) {
  const [open, setOpen] = useState(false)

  const {
    loading: userFollowLoading,
    data,
    refetch,
  } = useQuery<GetUserFollowData, GetUserFollowDataVar>(GET_USER_FOLLOW_DATA, {
    variables: { userId },
    errorPolicy: 'all',
    fetchPolicy: 'no-cache',
  })
  const [userFollowData, setUserFollowData] = useState(data)

  const [unfollowUser] = useMutation<UnFollowUserData, UnFollowUserVars>(
    UNFOLLOW_USER
  )
  const [followUser] = useMutation<FollowUserData, FollowUserVars>(FOLLOW_USER)

  useEffect(() => {
    if (data) {
      setUserFollowData(data)
    }
  }, [data])
  const getNameFromAddresses = (
    addresses: { address: string; ens: string }[]
  ) => {
    return (
      extractEns(addresses, addresses[0]?.address) ||
      shortenAddress(addresses[0]?.address)
    )
  }

  const getFormattedFollowers = useCallback(() => {
    const followings: any[] = userFollowData?.usersFollowedByUser || []
    const followers: any[] = userFollowData?.usersFollowingUser || []
    const formatFollowers = followers.map((user) => ({
      id: user.id,
      address: getNameFromAddresses(user.addresses),
      img: makeBlockie(user.addresses[0].address),
      isFollowing:
        followings.filter((followingUser) => user.id === followingUser.id)
          .length > 0,
    }))

    return formatFollowers
  }, [userFollowData])
  const getFormattedFollowings = useCallback(() => {
    const followings: any[] = userFollowData?.usersFollowedByUser || []
    const formatFollowings = followings.map(
      (user) => ({
        id: user.id,
        address: getNameFromAddresses(user.addresses),
        img: makeBlockie(user.addresses[0].address),
      }),
      [userFollowData]
    )

    return formatFollowings
  }, [userFollowData])
  const handleFollowUser = async (id: number) => {
    const { data } = await followUser({
      variables: {
        userId: id,
      },
      onCompleted: (data) => {
        const followings: any[] = userFollowData?.usersFollowedByUser || []
        const followers: any[] = userFollowData?.usersFollowingUser || []
        const userFollowed = followers.find((user) => user.id === id)
        const updatedFollowings = [...followings, userFollowed]

        setUserFollowData({
          usersFollowedByUser: updatedFollowings,
          usersFollowingUser: followers,
        })
      },
      onError: (err) => {
        console.error(err)
      },
    })
  }
  const handleUnFollow = async (id: number) => {
    const { data } = await unfollowUser({
      variables: {
        userId: id,
      },
      onCompleted: (data) => {
        const followings: any[] = userFollowData?.usersFollowedByUser || []
        const followers: any[] = userFollowData?.usersFollowingUser || []
        const updatedFollowings = followings.filter((user) => user.id !== id)

        setUserFollowData({
          usersFollowedByUser: updatedFollowings,
          usersFollowingUser: followers,
        })
      },
      onError: (err) => {
        console.error(err)
      },
    })
  }
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(!open)}>
        {' '}
        + Follow{' '}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <FollowerModal
          onFollow={handleFollowUser}
          onUnFollow={handleUnFollow}
          onClose={() => setOpen(false)}
          userAddress={displayName}
          follower={getFormattedFollowers()}
          following={getFormattedFollowings()}
        />
      </Modal>
    </>
  )
}
