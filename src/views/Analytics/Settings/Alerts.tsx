import { useQuery } from '@apollo/client'
import styled from '@emotion/styled'
import {
  Button,
  Checkbox,
  InputRounded,
  transientOptions,
  useBreakpointIndex,
  useTheme,
} from '@upshot-tech/upshot-ui'
import { useAuth } from 'hooks/auth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAppSelector } from 'redux/hooks'
import { selectAddress } from 'redux/reducers/web3'
import { Box, Flex, Grid, Label, Text } from 'theme-ui'

import {
  GET_PROFILE,
  GetUserProfileData,
  GetUserProfileVars,
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

interface AlertThresholds {
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

const alertThresholdDefaults: AlertThresholds = {
  collectionsFloorInc: 5,
  collectionsFloorDec: 5,
  collectionsVolInc: 5,
  collectionsVolDec: 5,
  collectionsSigSalesAboveFloor: 3,
  collectionsSigSalesLimit: 3,
  collectorsMints: 5,
  collectorsBuysMin: 5,
  collectorsBuysLimit: 3,
  collectorsSellsMin: 5,
  collectorsSellsLimit: 3,
  nftPriceChange: 5,
  nftAppraisalChange: 5,
  nftDealAlerts: 10,
}

const InputContainer = styled(Grid, transientOptions)`
  align-items: center;
  gap: 15px;
  grid-template-columns: auto 1fr;
`

const InputLabel = styled(Text, transientOptions)`
  width: 60px;
  font-size: 14px;
`

const SettingsHeader = styled(Text, transientOptions)`
  padding-bottom: 20px;
`
SettingsHeader.defaultProps = { variant: 'large' }

const Setting = styled(Flex, transientOptions)`
  padding-bottom: 15px;
  flex-direction: column;
  gap: 10px;
`

const SettingsGroup = styled(Grid, transientOptions)`
  column-gap: 30px;
`
SettingsGroup.defaultProps = { columns: ['1fr', '1fr 1fr', '1fr 1fr', '1fr'] }

const SettingsContainer = styled(Flex, transientOptions)`
  flex-direction: column;
  gap: 10px;
`
const NumberInput = styled(InputRounded, transientOptions)``
NumberInput.defaultProps = { dark: true, type: 'number' }

export default function AlertsSettings() {
  const { theme } = useTheme()
  const breakpointIndex = useBreakpointIndex()
  const router = useRouter()
  const address = useAppSelector(selectAddress)
  const { isAuthed, triggerAuth } = useAuth()

  const [saveEnabled, setSaveEnabled] = useState<boolean>(false)
  const [emailEnabled, setEmailEnabled] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [enabledAlerts, setEnabledAlerts] =
    useState<EnabledAlertsType>(enabledAlertsDefault)
  const [alertVals, setAlertVals] = useState<AlertThresholds>(
    alertThresholdDefaults
  )

  useEffect(() => {
    if (!isAuthed) triggerAuth({ onError: () => router.push('/analytics') })
  }, [])

  const handleSave = () => {}
  const handleReset = () => {
    setEnabledAlerts(enabledAlertsDefault)
    setAlertVals(alertThresholdDefaults)
  }

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

  const handleInputChange = (alertKey: keyof AlertThresholds, val: string) => {
    setAlertVals({ ...alertVals, [alertKey]: parseFloat(val) })
  }

  return (
    <Flex sx={{ flexDirection: 'column', gap: '30px' }}>
      <Text>Select which alerts you would like to receive</Text>
      <Flex
        sx={{
          columnGap: [0, 0, 0, '25px', '45px', '65px'],
          rowGap: '30px',
          flexDirection: breakpointIndex <= 2 ? 'column' : 'row',
        }}
      >
        <SettingsContainer>
          <SettingsHeader>Collections</SettingsHeader>

          <SettingsGroup>
            <Setting>
              <Label>
                <Checkbox
                  checked={enabledAlerts.collectionsFloorInc}
                  onChange={(e) => handleCheckboxChange('collectionsFloorInc')}
                />
                Floor Increase
              </Label>
              <InputContainer>
                <InputLabel variant="small">Threshold</InputLabel>
                <NumberInput
                  onChange={(e) =>
                    handleInputChange(
                      'collectionsFloorInc',
                      e.currentTarget.value
                    )
                  }
                  value={alertVals.collectionsFloorInc}
                  prefix="+"
                  suffix="%"
                  disabled={!enabledAlerts.collectionsFloorInc}
                  sx={{ flex: 1 }}
                />
              </InputContainer>
            </Setting>

            <Setting>
              <Label>
                <Checkbox
                  checked={enabledAlerts.collectionsFloorDec}
                  onChange={(e) => handleCheckboxChange('collectionsFloorDec')}
                />
                Floor Decrease
              </Label>
              <InputContainer>
                <InputLabel>Threshold</InputLabel>
                <NumberInput
                  onChange={(e) =>
                    handleInputChange(
                      'collectionsFloorDec',
                      e.currentTarget.value
                    )
                  }
                  value={alertVals.collectionsFloorDec}
                  prefix="-"
                  suffix="%"
                  disabled={!enabledAlerts.collectionsFloorDec}
                />
              </InputContainer>
            </Setting>

            <Setting>
              <Label>
                <Checkbox
                  checked={enabledAlerts.collectionsVolInc}
                  onChange={(e) => handleCheckboxChange('collectionsVolInc')}
                />
                Volume Increase
              </Label>
              <InputContainer>
                <InputLabel>Threshold</InputLabel>
                <NumberInput
                  onChange={(e) =>
                    handleInputChange(
                      'collectionsVolInc',
                      e.currentTarget.value
                    )
                  }
                  value={alertVals.collectionsVolInc}
                  prefix="+"
                  suffix="%"
                  disabled={!enabledAlerts.collectionsVolInc}
                />
              </InputContainer>
            </Setting>

            <Setting>
              <Label>
                <Checkbox
                  checked={enabledAlerts.collectionsVolDec}
                  onChange={(e) => handleCheckboxChange('collectionsVolDec')}
                />
                Volume Decrease
              </Label>
              <InputContainer>
                <InputLabel>Threshold</InputLabel>
                <NumberInput
                  onChange={(e) =>
                    handleInputChange(
                      'collectionsVolDec',
                      e.currentTarget.value
                    )
                  }
                  value={alertVals.collectionsVolDec}
                  prefix="-"
                  suffix="%"
                  disabled={!enabledAlerts.collectionsVolDec}
                />
              </InputContainer>
            </Setting>

            <Setting>
              <Label>
                <Checkbox
                  checked={enabledAlerts.collectionsSigSales}
                  onChange={(e) => handleCheckboxChange('collectionsSigSales')}
                />
                Significant Sales
              </Label>
              <InputContainer>
                <InputLabel>Above Floor</InputLabel>
                <NumberInput
                  onChange={(e) =>
                    handleInputChange(
                      'collectionsSigSalesAboveFloor',
                      e.currentTarget.value
                    )
                  }
                  value={alertVals.collectionsSigSalesAboveFloor}
                  prefix="+"
                  suffix="%"
                  disabled={!enabledAlerts.collectionsSigSales}
                />
              </InputContainer>
              <InputContainer>
                <InputLabel>Daily Limit</InputLabel>
                <NumberInput
                  onChange={(e) =>
                    handleInputChange(
                      'collectionsSigSalesLimit',
                      e.currentTarget.value
                    )
                  }
                  value={alertVals.collectionsSigSalesLimit}
                  suffix="alerts"
                  disabled={!enabledAlerts.collectionsSigSales}
                />
              </InputContainer>
            </Setting>
          </SettingsGroup>
        </SettingsContainer>
        <SettingsContainer>
          <SettingsHeader>Collectors</SettingsHeader>

          <SettingsGroup>
            <Setting>
              <Label>
                <Checkbox
                  checked={enabledAlerts.collectorsMints}
                  onChange={(e) => handleCheckboxChange('collectorsMints')}
                />
                Mints
              </Label>
              <InputContainer>
                <InputLabel>Min. Tokens</InputLabel>
                <NumberInput
                  onChange={(e) =>
                    handleInputChange('collectorsMints', e.currentTarget.value)
                  }
                  value={alertVals.collectorsMints}
                  suffix="tokens"
                  disabled={!enabledAlerts.collectorsMints}
                />
              </InputContainer>
            </Setting>

            <Setting>
              <Label>
                <Checkbox
                  checked={enabledAlerts.collectorsBuys}
                  onChange={(e) => handleCheckboxChange('collectorsBuys')}
                />
                Buys
              </Label>
              <InputContainer>
                <InputLabel>Min. Tokens</InputLabel>
                <NumberInput
                  onChange={(e) =>
                    handleInputChange(
                      'collectorsBuysMin',
                      e.currentTarget.value
                    )
                  }
                  value={alertVals.collectorsBuysMin}
                  suffix="tokens"
                  disabled={!enabledAlerts.collectorsBuys}
                />
              </InputContainer>
              <InputContainer>
                <InputLabel>Daily Limit</InputLabel>
                <NumberInput
                  onChange={(e) =>
                    handleInputChange(
                      'collectorsBuysLimit',
                      e.currentTarget.value
                    )
                  }
                  value={alertVals.collectorsBuysLimit}
                  suffix="tokens"
                  disabled={!enabledAlerts.collectorsBuys}
                />
              </InputContainer>
            </Setting>

            <Setting>
              <Label>
                <Checkbox
                  checked={enabledAlerts.collectorsSells}
                  onChange={(e) => handleCheckboxChange('collectorsSells')}
                />
                Sells
              </Label>
              <InputContainer>
                <InputLabel>Min. Tokens</InputLabel>
                <NumberInput
                  onChange={(e) =>
                    handleInputChange(
                      'collectorsSellsMin',
                      e.currentTarget.value
                    )
                  }
                  value={alertVals.collectorsSellsMin}
                  suffix="tokens"
                  disabled={!enabledAlerts.collectorsSells}
                />
              </InputContainer>
              <InputContainer>
                <InputLabel>Daily Limit</InputLabel>
                <NumberInput
                  onChange={(e) =>
                    handleInputChange(
                      'collectorsSellsLimit',
                      e.currentTarget.value
                    )
                  }
                  value={alertVals.collectorsSellsLimit}
                  suffix="tokens"
                  disabled={!enabledAlerts.collectorsSells}
                />
              </InputContainer>
            </Setting>
          </SettingsGroup>
        </SettingsContainer>
        <SettingsContainer>
          <SettingsHeader>NFTs</SettingsHeader>
          <SettingsGroup>
            <Setting>
              <Label>
                <Checkbox
                  checked={enabledAlerts.nftPriceChange}
                  onChange={(e) => handleCheckboxChange('nftPriceChange')}
                />
                Price Change
              </Label>
              <InputContainer>
                <InputLabel>Price Change</InputLabel>
                <NumberInput
                  onChange={(e) =>
                    handleInputChange('nftPriceChange', e.currentTarget.value)
                  }
                  value={alertVals.nftPriceChange}
                  prefix="+/-"
                  suffix="%"
                  disabled={!enabledAlerts.nftPriceChange}
                />
              </InputContainer>
            </Setting>

            <Setting>
              <Label>
                <Checkbox
                  checked={enabledAlerts.nftAppraisalChange}
                  onChange={(e) => handleCheckboxChange('nftAppraisalChange')}
                />
                Appraisal Change
              </Label>
              <InputContainer>
                <InputLabel>Appraisal Change</InputLabel>
                <NumberInput
                  onChange={(e) =>
                    handleInputChange(
                      'nftAppraisalChange',
                      e.currentTarget.value
                    )
                  }
                  value={alertVals.nftAppraisalChange}
                  prefix="+/-"
                  suffix="%"
                  disabled={!enabledAlerts.nftAppraisalChange}
                />
              </InputContainer>
            </Setting>

            <Setting>
              <Label>
                <Checkbox
                  checked={enabledAlerts.nftDealAlerts}
                  onChange={(e) => handleCheckboxChange('nftDealAlerts')}
                />
                Deal Alerts
              </Label>
              <InputContainer>
                <InputLabel>Under- priced</InputLabel>
                <NumberInput
                  onChange={(e) =>
                    handleInputChange('nftDealAlerts', e.currentTarget.value)
                  }
                  value={alertVals.nftDealAlerts}
                  suffix="%"
                  disabled={!enabledAlerts.nftDealAlerts}
                />
              </InputContainer>
            </Setting>

            <Box>
              <Label paddingBottom="10px">
                <Checkbox
                  checked={enabledAlerts.nftListed}
                  onChange={(e) => handleCheckboxChange('nftListed')}
                />
                Listed
              </Label>
              <Label>
                <Checkbox
                  checked={enabledAlerts.nftSold}
                  onChange={(e) => handleCheckboxChange('nftSold')}
                />
                Sold
              </Label>
            </Box>
          </SettingsGroup>
        </SettingsContainer>
      </Flex>
      <Flex>
        <Label
          sx={{ width: 'auto', alignItems: 'center', paddingRight: '15px' }}
        >
          <Checkbox
            checked={emailEnabled}
            onChange={(e) => setEmailEnabled(!emailEnabled)}
          />
          Receive email alert notifications
        </Label>
        <InputRounded
          sx={{ padding: '16px' }}
          placeholder="Email address"
          onChange={(e) => setEmail(e.currentTarget.value)}
          disabled={!emailEnabled}
          value={email}
          type="email"
          dark
        />
      </Flex>
      <Flex sx={{ gap: '10px', alignItems: 'center' }}>
        <Button
          sx={{ width: 150, marginTop: '10px' }}
          onClick={handleSave}
          capitalize={true}
          disabled={!saveEnabled}
        >
          {/* { updateUserLoading ? (<Spinner />) : 'Save Changes' } */}
          Save Changes
        </Button>
        <Flex sx={{ flexDirection: 'column' }}>
          <Button
            variant="plain"
            onClick={handleReset}
            sx={{ paddingBottom: 0, paddingTop: '15px' }}
            capitalize={true}
          >
            Reset
          </Button>
          <Text variant="small" sx={{ paddingLeft: '13px' }}>
            Reset all changes
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
