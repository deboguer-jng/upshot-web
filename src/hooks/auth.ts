import { useLazyQuery, useMutation } from '@apollo/client'
import { useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { ethers } from 'ethers'
import {
  LOG_EVENT,
  LogEventData,
  LogEventVars,
  SIGN_IN,
  SignInData,
  SignInVars,
} from 'graphql/mutations'
import { GET_NONCE, GetNonceData, GetNonceVars } from 'graphql/queries'
import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import {
  DialogModals,
  setDialogModalState,
  setShowConnectModal,
} from 'redux/reducers/layout'
import {
  selectAddress,
  selectAuthToken,
  setAuthToken,
  setUserId,
} from 'redux/reducers/web3'
import { getAuthPayload } from 'utils/auth'
import { logEvent } from 'utils/googleAnalytics'

export interface useAuthType {
  isAuthed: boolean
  isSigning: boolean
  triggerAuth: Function
}

export function useAuth(): useAuthType {
  const { library, connector } = useWeb3React()
  const dispatch = useAppDispatch()
  const authToken = useSelector(selectAuthToken)
  const address = useAppSelector(selectAddress)
  const [isAuthed, setIsAuthed] = useState<boolean>(!!(address && authToken))
  const [isSigning, setIsSigning] = useState<boolean>(false)

  const [logUpshotEvent] = useMutation<LogEventData, LogEventVars>(LOG_EVENT, {
    onError: (err) => {
      console.error(err)
    },
  })

  const [signIn] = useMutation<SignInData, SignInVars>(SIGN_IN)

  const [getNonce] = useLazyQuery<GetNonceData, GetNonceVars>(GET_NONCE)

  const triggerAuth = useCallback(
    async (params: { onComplete?: Function; onError?: Function }) => {
      /**
       * We require an active web3 connection to manage settings.
       * The settings button is only visible if it exists, but for
       * type checking, we will bail on this handler if there is no address.
       */
      if (!address) return params?.onError?.('no address')

      /**
       * If there's no auth token, we'll run through the sequential flow.
       *
       * 1. We first request a nonce for the active user address.
       *
       * 2. Once we have the nonce, we ask the user to sign it.
       *
       * 3. Once we have the signature, we send that to the backend in exchange
       * for an authToken, which is cached to redux and added to all graphQL headers.
       */
      if (!authToken) {
        dispatch(setDialogModalState(DialogModals.SIGN_MESSAGE))

        const { data: nonceData, error: nonceError } = await getNonce({
          variables: { userAddress: address },
        })

        if (nonceError) return params?.onError?.(nonceError)

        if (
          (!library && !(connector instanceof WalletConnectConnector)) ||
          (connector instanceof WalletConnectConnector &&
            !connector?.walletConnectProvider)
        )
          return dispatch(setShowConnectModal(true))
        else dispatch(setShowConnectModal(false))

        const signer = library.getSigner(address)
        let signature

        try {
          const payload = getAuthPayload({
            address: address,
            nonce: nonceData?.getNonce?.nonce,
          })
          if (
            connector instanceof WalletConnectConnector &&
            connector?.walletConnectProvider
          )
            signature = await (
              connector as WalletConnectConnector
            ).walletConnectProvider.connector.signPersonalMessage([
              ethers.utils.hexlify(ethers.utils.toUtf8Bytes(payload)),
              address,
            ])
          else signature = await library.getSigner(address).signMessage(payload)
        } catch (err) {
          console.error(err)
        }

        dispatch(setDialogModalState(null))

        if (!signature) return params?.onError?.('no signature')

        logEvent('auth', 'signature', address)
        logUpshotEvent({
          variables: {
            timestamp: Math.floor(Date.now() / 1000),
            address: address,
            type: 'signature',
          },
        })

        const { data: signInData } = await signIn({
          variables: {
            userAddress: address,
            signature,
          },
        })

        if (!signInData?.signIn?.authToken)
          return params?.onError?.('no auth token')

        dispatch(setAuthToken(signInData.signIn.authToken))
        dispatch(setUserId(signInData.signIn.id))

        const authed = !!(address && signInData.signIn.authToken)
        setIsAuthed(authed)

        if (authed) return params?.onComplete?.()
      }

      if (address && authToken) params?.onComplete?.()
      else params?.onError?.('auth failed')
    },
    [address, authToken, getNonce, signIn, library, connector, setIsSigning]
  )

  return { isAuthed, isSigning, triggerAuth }
}
