import { useLazyQuery, useMutation } from '@apollo/client'
import { useWeb3React } from '@web3-react/core'
import {
  LOG_EVENT,
  LogEventData,
  LogEventVars,
  SIGN_IN,
  SignInData,
  SignInVars,
} from 'graphql/mutations'
import {
  GET_NONCE,
  GetNonceData,
  GetNonceVars,
} from 'graphql/queries'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'redux/hooks'
import {
  selectAuthToken,
  setAuthToken,
} from 'redux/reducers/web3'
import { getAuthPayload } from 'utils/auth'
import { logEvent } from 'utils/googleAnalytics'

export function useAuth(): [boolean, Function] {
  const { library, account } = useWeb3React()
  const dispatch = useAppDispatch()
  const authToken = useSelector(selectAuthToken)
  const [ isAuthed, setIsAuthed ] = useState<boolean>(account && authToken);

  const [logUpshotEvent] = useMutation<LogEventData, LogEventVars>(LOG_EVENT, {
    onError: (err) => {
      console.error(err)
    },
  })

  const [signIn, {data: signInData, error: signInError}] = useMutation<SignInData, SignInVars>(SIGN_IN)

  const [getNonce, {data: nonceData, error: nonceError}] = useLazyQuery<GetNonceData, GetNonceVars>(GET_NONCE)
 
  const triggerAuth = async (successFn: Function) => {
    /**
     * We require an active web3 connection to manage settings.
     * The settings button is only visible if it exists, but for
     * type checking, we will bail on this handler if there is no account.
     */
    if (!account) return console.error('no address')

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
      await getNonce({ variables: { userAddress: account } })

      if (nonceError) return console.log(nonceError)

      const signer = library.getSigner(account)
      let signature

      try {
        const payload = getAuthPayload({
          address: account,
          nonce: nonceData?.getNonce?.nonce,
        })
        signature = await signer.signMessage(payload)
      } catch (err) {
        console.error(err)
      }

      if (!signature) return console.error('no signature')

      logEvent('auth', 'signature', account)
      logUpshotEvent({
        variables: {
          timestamp: Math.floor(Date.now() / 1000),
          address: account,
          type: 'signature',
        },
      })

      await signIn({
        variables: {
          userAddress: account,
          signature: signature
        },
      })

      if (signInError) return console.error(signInError)

      if (!signInData?.signIn?.authToken) return
      dispatch(setAuthToken(signInData.signIn.authToken))
    }

    if (account && (authToken || signInData?.signIn?.authToken)) successFn()
  }
  
  return [isAuthed, triggerAuth]
}