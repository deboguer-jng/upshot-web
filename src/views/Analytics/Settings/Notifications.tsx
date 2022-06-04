import { useMutation, useQuery } from '@apollo/client'
import styled from '@emotion/styled'
import { createSerializableStateInvariantMiddleware } from '@reduxjs/toolkit'
import { 
  Button,
  Checkbox,
  Container, 
  Icon, 
  InputRounded,
  SettingsMenuItem,
  SettingsPanel,
  Spinner,
  SpinnerBoxTemplate,
  TextareaRounded,
  useTheme
} from '@upshot-tech/upshot-ui'
import { useAuth } from 'hooks/auth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAppSelector } from 'redux/hooks'
import { selectAddress, selectEns } from 'redux/reducers/web3'
import { Avatar, Box, Flex, Label, Link, Text } from 'theme-ui'

import { GetUserProfileData, GetUserProfileVars, GET_PROFILE } from '../User/queries'

const InputLabel = styled(Label)`

`

export default function NotificationsSettings() {
  const { theme } = useTheme()
  const router = useRouter()
  const address = useAppSelector(selectAddress)
  const {isAuthed, triggerAuth} = useAuth();
  
  const [saveEnabled, setSaveEnabled] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    if (!isAuthed) triggerAuth({onError: () => router.push('/analytics')})
  }, [])

  const handleSave = () => {}
  const handleReset = () => {}

  const {
    loading: getProfileLoading,
    error,
    data: initProfileData,
  } = useQuery<GetUserProfileData, GetUserProfileVars>(GET_PROFILE, {
    errorPolicy: 'all',
    variables: {
      address: address,
    },
    skip: !address,
    onCompleted: (data) => {}
  })

  return (
    <Flex sx={{flexDirection: 'column', gap: '30px'}}>
      <Text>Select which notifications you would like to recieve</Text>
      <Flex sx={{gap: '50px'}}>
        <Flex sx={{flexDirection: 'column', gap: '10px'}}>
          <Text>Collections</Text>
          <Label><Checkbox />Floor Increase</Label>
          <Label>Threshold <InputRounded dark={true} suffix='%' /></Label>

          <Label><Checkbox />Floor Decrease</Label>
          <Label>Threshold <InputRounded dark={true} suffix='%' /></Label>

          <Label><Checkbox />Volume Increase</Label>
          <Label>Threshold <InputRounded dark={true} suffix='%' /></Label>

          <Label><Checkbox />Volume Decrease</Label>
          <Label>Threshold <InputRounded dark={true} suffix='%' /></Label>

          <Label><Checkbox />Significant Sales</Label>
          <Label>Above Floor <InputRounded dark={true} suffix='%' /></Label>
          <Label>Daily Limit <InputRounded dark={true} suffix='alerts' /></Label>
        </Flex>
        <Flex sx={{flexDirection: 'column', gap: '10px'}}>
          <Text>Collectors</Text>
          <Label><Checkbox />Mints</Label>
          <Label>Min. Tokens <InputRounded dark={true} suffix='tokens' /></Label>

          <Label><Checkbox />Buys</Label>
          <Label>Min. Tokens <InputRounded dark={true} suffix='tokens' /></Label>
          <Label>Daily Limit <InputRounded dark={true} suffix='tokens' /></Label>

          <Label><Checkbox />Sells</Label>
          <Label>Min. Tokens <InputRounded dark={true} suffix='tokens' /></Label>
          <Label>Daily Limit <InputRounded dark={true} suffix='tokens' /></Label>
        </Flex>
        <Flex sx={{flexDirection: 'column', gap: '10px'}}>
          <Text>NFTs</Text>
          <Label><Checkbox />Price Change</Label>
          <Label>Price Change <InputRounded dark={true} suffix='%' /></Label>

          <Label><Checkbox />Appraisal Change</Label>
          <Label>Appraisal Change <InputRounded dark={true} suffix='%' /></Label>

          <Label><Checkbox />Deal Alerts</Label>
          <Label>Under- priced <InputRounded dark={true} suffix='%' /></Label>

          <Label><Checkbox />Listed</Label>
          <Label><Checkbox />Sold</Label>
        </Flex>
      </Flex>
      <Flex>
        <Label><Checkbox />Receive email alert notifications</Label>
        <InputRounded 
          dark={true} 
          sx={{padding: '16px'}} 
          placeholder='Email address' 
          onChange={e => setEmail(e.currentTarget.value)} />
      </Flex>
      <Flex>
        <Button 
          sx={{width: 150}}
          onClick={handleSave} 
          capitalize={true} 
          disabled={!saveEnabled} >
          {/* { updateUserLoading ? (<Spinner />) : 'Save Changes' } */}
          Save Changes
        </Button>
        <Button 
          variant='secondary'
          onClick={handleReset}>
          Reset
        </Button>
      </Flex>
    </Flex>
  )
}
