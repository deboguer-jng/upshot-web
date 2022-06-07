import { useQuery } from '@apollo/client'
import styled from '@emotion/styled'
import {
  Button,
  Checkbox,
  InputRounded,
  useTheme,
} from '@upshot-tech/upshot-ui'
import { useAuth } from 'hooks/auth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAppSelector } from 'redux/hooks'
import { selectAddress } from 'redux/reducers/web3'
import { Flex, Label, Text } from 'theme-ui'

import {
  GetUserProfileData,
  GetUserProfileVars,
  GET_PROFILE,
} from '../User/queries'

interface EnabledAlertsType {
  collectionsFloorInc: boolean
  collectionsFloorDec: boolean
  collectionsVolInc: boolean
  collectionsVolDec: boolean
  collectionsSigSales: boolean
  collectorsMints: boolean
  collectorsBuys: boolean
  collectorsSells: boolean
  nftPriceChange: boolean
  nftAppraisalChange: boolean
  nftDealAlerts: boolean
  nftListed: boolean
  nftSold: boolean
}

const enabledAlertsDefault: EnabledAlertsType = {
  collectionsFloorInc: true,
  collectionsFloorDec: true,
  collectionsVolInc: false,
  collectionsVolDec: false,
  collectionsSigSales: false,
  collectorsMints: false,
  collectorsBuys: true,
  collectorsSells: true,
  nftPriceChange: false,
  nftAppraisalChange: true,
  nftDealAlerts: true,
  nftListed: false,
  nftSold: true,
}

interface AlertValsType {
  collectionsFloorInc: number
  collectionsFloorDec: number
  collectionsVolInc: number
  collectionsVolDec: number
  collectionsSigSalesAboveFloor: number
  collectionsSigSalesLimit: number
  collectorsMints: number
  collectorsBuysMin: number
  collectorsBuysLimit: number
  collectorsSellsMin: number
  collectorsSellsLimit: number
  nftPriceChange: number
  nftAppraisalChange: number
  nftDealAlerts: number
}

const alertDefaults: AlertValsType = {
  collectionsFloorInc: 5,
  collectionsFloorDec: 5,
  collectionsVolInc: 5,
  collectionsVolDec: 5,
  collectionsSigSalesAboveFloor: 150,
  collectionsSigSalesLimit: 0,
  collectorsMints: 5,
  collectorsBuysMin: 5,
  collectorsBuysLimit: 5,
  collectorsSellsMin: 5,
  collectorsSellsLimit: 5,
  nftPriceChange: 5,
  nftAppraisalChange: 5,
  nftDealAlerts: 10,
}

const InputContainer = styled(Flex)`
  align-items: center;
  gap: 15px;
`

const InputLabel = styled(Text)`
  width: 85px;
`

const SettingGroup = styled(Flex)`
  padding-bottom: 15px;
  flex-direction: column;
  gap: 10px;
`

export default function NotificationsSettings() {
  const { theme } = useTheme()
  const router = useRouter()
  const address = useAppSelector(selectAddress)
  const { isAuthed, triggerAuth } = useAuth()

  const [saveEnabled, setSaveEnabled] = useState<boolean>(false)
  const [emailEnabled, setEmailEnabled] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [enabledAlerts, setEnabledAlerts] =
    useState<EnabledAlertsType>(enabledAlertsDefault)
  const [alertVals, setAlertVals] = useState<AlertValsType>(alertDefaults)

  useEffect(() => {
    if (!isAuthed) triggerAuth({ onError: () => router.push('/analytics') })
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
    onCompleted: (data) => {},
  })

  const handleCheckboxChange = (alertKey: keyof EnabledAlertsType) => {
    const currState: boolean = enabledAlerts[alertKey]
    setEnabledAlerts({ ...enabledAlerts, [alertKey]: !currState })
  }

  const handleInputChange = (alertKey: keyof AlertValsType, val: string) => {
    setAlertVals({ ...alertVals, [alertKey]: parseFloat(val) })
  }

  return (
    <Flex sx={{ flexDirection: 'column', gap: '30px' }}>
      <Text>Select which notifications you would like to recieve</Text>
      <Flex sx={{ gap: '65px' }}>
        <Flex sx={{ flexDirection: 'column', gap: '10px' }}>
          <Text variant="large">Collections</Text>
          <SettingGroup>
            <Label>
              <Checkbox
                checked={enabledAlerts.collectionsFloorInc}
                onChange={e => handleCheckboxChange('collectionsFloorInc')}
              />
              Floor Increase
            </Label>
            <InputContainer>
              <InputLabel>Threshold</InputLabel>
              <InputRounded
                onChange={e => handleInputChange('collectionsFloorInc', e.currentTarget.value)}
                value={alertVals.collectionsFloorInc}
                dark={true}
                prefix="+"
                suffix="%"
                disabled={!enabledAlerts.collectionsFloorInc}
              />
            </InputContainer>
          </SettingGroup>

          <SettingGroup>
            <Label>
              <Checkbox
                checked={enabledAlerts.collectionsFloorDec}
                onChange={e => handleCheckboxChange('collectionsFloorDec')}
              />
              Floor Decrease
            </Label>
            <InputContainer>
              <InputLabel>Threshold</InputLabel>
              <InputRounded
                onChange={e => handleInputChange('collectionsFloorDec', e.currentTarget.value)}
                value={alertVals.collectionsFloorDec}
                dark={true}
                prefix="-"
                suffix="%"
                disabled={!enabledAlerts.collectionsFloorDec}
              />
            </InputContainer>
          </SettingGroup>

          <SettingGroup>
            <Label>
              <Checkbox
                checked={enabledAlerts.collectionsVolInc}
                onChange={e => handleCheckboxChange('collectionsVolInc')}
              />
              Volume Increase
            </Label>
            <InputContainer>
              <InputLabel>Threshold</InputLabel>
              <InputRounded
                onChange={e => handleInputChange('collectionsVolInc', e.currentTarget.value)}
                value={alertVals.collectionsVolInc}
                dark={true}
                prefix="+"
                suffix="%"
                disabled={!enabledAlerts.collectionsVolInc}
              />
            </InputContainer>
          </SettingGroup>

          <SettingGroup>
            <Label>
              <Checkbox
                checked={enabledAlerts.collectionsVolDec}
                onChange={e => handleCheckboxChange('collectionsVolDec')}
              />
              Volume Decrease
            </Label>
            <InputContainer>
              <InputLabel>Threshold</InputLabel>
              <InputRounded
                onChange={e => handleInputChange('collectionsVolDec', e.currentTarget.value)}
                value={alertVals.collectionsVolDec}
                dark={true}
                prefix="-"
                suffix="%"
                disabled={!enabledAlerts.collectionsVolDec}
              />
            </InputContainer>
          </SettingGroup>

          <SettingGroup>
            <Label>
              <Checkbox
                checked={enabledAlerts.collectionsSigSales}
                onChange={e => handleCheckboxChange('collectionsSigSales')}
              />
              Significant Sales
            </Label>
            <InputContainer>
              <InputLabel>Above Floor</InputLabel>
              <InputRounded
                onChange={e => handleInputChange('collectionsSigSalesAboveFloor', e.currentTarget.value)}
                value={alertVals.collectionsSigSalesAboveFloor}
                dark={true}
                prefix="+"
                suffix="%"
                disabled={!enabledAlerts.collectionsSigSales}
              />
            </InputContainer>
            <InputContainer>
              <InputLabel>Daily Limit</InputLabel>
              <InputRounded
                onChange={e => handleInputChange('collectionsSigSalesLimit', e.currentTarget.value)}
                value={alertVals.collectionsSigSalesLimit}
                dark={true}
                suffix="alerts"
                disabled={!enabledAlerts.collectionsSigSales}
              />
            </InputContainer>
          </SettingGroup>
        </Flex>
        <Flex sx={{ flexDirection: 'column', gap: '10px' }}>
          <Text variant="large">Collectors</Text>

          <SettingGroup>
            <Label>
              <Checkbox
                checked={enabledAlerts.collectorsMints}
                onChange={e => handleCheckboxChange('collectorsMints')}
              />
              Mints
            </Label>
            <InputContainer>
              <InputLabel>Min. Tokens</InputLabel>
              <InputRounded
                onChange={e => handleInputChange('collectorsMints', e.currentTarget.value)}
                value={alertVals.collectorsMints}
                dark={true}
                suffix="tokens"
                disabled={!enabledAlerts.collectorsMints}
              />
            </InputContainer>
          </SettingGroup>

          <SettingGroup>
            <Label>
              <Checkbox
                checked={enabledAlerts.collectorsBuys}
                onChange={e => handleCheckboxChange('collectorsBuys')}
              />
              Buys
            </Label>
            <InputContainer>
              <InputLabel>Min. Tokens</InputLabel>
              <InputRounded
                onChange={e => handleInputChange('collectorsBuysMin', e.currentTarget.value)}
                value={alertVals.collectorsBuysMin}
                dark={true}
                suffix="tokens"
                disabled={!enabledAlerts.collectorsBuys}
              />
            </InputContainer>
            <InputContainer>
              <InputLabel>Daily Limit</InputLabel>
              <InputRounded
                onChange={e => handleInputChange('collectorsBuysLimit', e.currentTarget.value)}
                value={alertVals.collectorsBuysLimit}
                dark={true}
                suffix="tokens"
                disabled={!enabledAlerts.collectorsBuys}
              />
            </InputContainer>
          </SettingGroup>

          <SettingGroup>
            <Label>
              <Checkbox
                checked={enabledAlerts.collectorsSells}
                onChange={e => handleCheckboxChange('collectorsSells')}
              />
              Sells
            </Label>
            <InputContainer>
              <InputLabel>Min. Tokens</InputLabel>
              <InputRounded
                onChange={e => handleInputChange('collectorsSellsMin', e.currentTarget.value)}
                value={alertVals.collectorsSellsMin}
                dark={true}
                suffix="tokens"
                disabled={!enabledAlerts.collectorsSells}
              />
            </InputContainer>
            <InputContainer>
              <InputLabel>Daily Limit</InputLabel>
              <InputRounded
                onChange={e => handleInputChange('collectorsSellsLimit', e.currentTarget.value)}
                value={alertVals.collectorsSellsLimit}
                dark={true}
                suffix="tokens"
                disabled={!enabledAlerts.collectorsSells}
              />
            </InputContainer>
          </SettingGroup>
        </Flex>
        <Flex sx={{ flexDirection: 'column', gap: '10px' }}>
          <Text variant="large">NFTs</Text>

          <SettingGroup>
            <Label>
              <Checkbox
                checked={enabledAlerts.nftPriceChange}
                onChange={e => handleCheckboxChange('nftPriceChange')}
              />
              Price Change
            </Label>
            <InputContainer>
              <InputLabel>Price Change</InputLabel>
              <InputRounded
                onChange={e => handleInputChange('nftPriceChange', e.currentTarget.value)}
                value={alertVals.nftPriceChange}
                dark={true}
                prefix="+/-"
                suffix="%"
                disabled={!enabledAlerts.nftPriceChange}
              />
            </InputContainer>
          </SettingGroup>

          <SettingGroup>
            <Label>
              <Checkbox
                checked={enabledAlerts.nftAppraisalChange}
                onChange={e => handleCheckboxChange('nftAppraisalChange')}
              />
              Appraisal Change
            </Label>
            <InputContainer>
              <InputLabel>Appraisal Change</InputLabel>
              <InputRounded
                onChange={e => handleInputChange('nftAppraisalChange', e.currentTarget.value)}
                value={alertVals.nftAppraisalChange}
                dark={true}
                prefix="+/-"
                suffix="%"
                disabled={!enabledAlerts.nftAppraisalChange}
              />
            </InputContainer>
          </SettingGroup>

          <SettingGroup>
            <Label>
              <Checkbox
                checked={enabledAlerts.nftDealAlerts}
                onChange={e => handleCheckboxChange('nftDealAlerts')}
              />
              Deal Alerts
            </Label>
            <InputContainer>
              <InputLabel>Under- priced</InputLabel>
              <InputRounded
                onChange={e => handleInputChange('nftDealAlerts', e.currentTarget.value)}
                value={alertVals.nftDealAlerts}
                dark={true}
                suffix="%"
                disabled={!enabledAlerts.nftDealAlerts}
              />
            </InputContainer>
          </SettingGroup>

          <Label paddingBottom='10px'>
            <Checkbox
              checked={enabledAlerts.nftListed}
              onChange={e => handleCheckboxChange('nftListed')}
            />
            Listed
          </Label>
          <Label>
            <Checkbox
              checked={enabledAlerts.nftSold}
              onChange={e => handleCheckboxChange('nftSold')}
            />
            Sold
          </Label>
        </Flex>
      </Flex>
      <Flex>
        <Label sx={{width: 'auto', alignItems: 'center', paddingRight: '15px'}}>
          <Checkbox checked={emailEnabled} onChange={e => setEmailEnabled(!emailEnabled)}/>
          Receive email alert notifications
        </Label>
        <InputRounded
          dark={true}
          sx={{ padding: '16px' }}
          placeholder="Email address"
          onChange={e => setEmail(e.currentTarget.value)}
          disabled={!emailEnabled}
        />
      </Flex>
      <Flex>
        <Button
          sx={{ width: 150 }}
          onClick={handleSave}
          capitalize={true}
          disabled={!saveEnabled}
        >
          {/* { updateUserLoading ? (<Spinner />) : 'Save Changes' } */}
          Save Changes
        </Button>
        <Button variant="secondary" onClick={handleReset}>
          Reset
        </Button>
      </Flex>
    </Flex>
  )
}
