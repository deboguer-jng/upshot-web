import styled from '@emotion/styled'
import {
  AlertSettingAccordion,
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  Icon,
  InputRounded,
  Text,
} from '@upshot-tech/upshot-ui'
import makeBlockie from 'ethereum-blockies-base64'
import React, { useState } from 'react'
import { Label } from 'theme-ui'

const Setting = styled(Flex)`
  padding-bottom: 15px;
  flex-direction: column;
  gap: 10px;
  flexgrow: 1;
`
const InputContainer = styled(Grid)`
  align-items: center;
  gap: 15px;
  grid-template-columns: auto 1fr;
`

const InputLabel = styled(Text)`
  width: 60px;
  font-size: 14px;
`
const SettingsGroup = styled(Grid)`
  column-gap: 30px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`
const NumberInput = styled(InputRounded)``
NumberInput.defaultProps = { dark: true, type: 'number' }

interface EnableAlertType {
  mints: boolean
  buys: boolean
  sells: boolean
}

const enableAlertsDefault: EnableAlertType = {
  mints: true,
  buys: true,
  sells: true,
}
interface AlertValsType {
  mints: boolean
  buys: boolean
  sells: boolean
  mintsMinSpent: number
  buysTokens: number
  buysLimit: number
  sellsTokens: number
  sellsLimit: number
}
const alertDefaultVal: AlertValsType = {
  mints: true,
  buys: true,
  sells: true,
  mintsMinSpent: 12,
  buysTokens: 1,
  buysLimit: 5,
  sellsTokens: 12,
  sellsLimit: 12,
}
const address = '0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459'
const data = [
  {
    name: 'Pranksy',
    following: true,
    imageSrc: makeBlockie(address),
    type: 'collector',
    link: `/analytics/user/${address}`,
    alertInfo: alertDefaultVal,
  },
]

function SettingsContent({ ...data }: AlertValsType | undefined) {
  const [alertVals, setAlertVals] = useState<AlertValsType>({ ...data })

  const handleInputChange = (
    alertKey: keyof AlertValsType,
    val: string | boolean
  ) => {
    setAlertVals({
      ...alertVals,
      [alertKey]: typeof val === 'string' ? parseFloat(val) : val,
    })
  }
  const handleSave = () => {}
  const handleReset = () => {
    setAlertVals(alertDefaultVal)
  }
  return (
    <Flex sx={{ flexDirection: 'column', gap: '10px' }}>
      <SettingsGroup>
        <Setting>
          <Label>
            <Checkbox
              checked={alertVals.mints}
              onChange={(e) => {
                handleInputChange('mints', e.target.checked)
              }}
            />
            Mints
          </Label>
          <InputContainer>
            <InputLabel variant="small">Min. Spent</InputLabel>
            <NumberInput
              value={alertVals?.mintsMinSpent}
              onChange={(e) => {
                handleInputChange('mintsMinSpent', e.target.value)
              }}
              suffix="ETH"
              sx={{ flex: 1 }}
              disabled={!alertVals.mints}
            />
          </InputContainer>
        </Setting>
        <Setting>
          <Label>
            <Checkbox
              checked={alertVals.buys}
              onChange={(e) => {
                handleInputChange('buys', e.target.checked)
              }}
            />
            Buys
          </Label>
          <InputContainer>
            <InputLabel variant="small">Min. Tokens</InputLabel>
            <NumberInput
              value={alertVals?.buysTokens}
              onChange={(e) => {
                handleInputChange('buysTokens', e.target.value)
              }}
              suffix="tokens"
              disabled={!alertVals.buys}
              sx={{ flex: 1 }}
            />
          </InputContainer>
          <InputContainer>
            <InputLabel variant="small">Daily Limit</InputLabel>
            <NumberInput
              value={alertVals?.buysLimit}
              onChange={(e) => {
                handleInputChange('buysLimit', e.target.value)
              }}
              suffix="alerts"
              disabled={!alertVals.buys}
              sx={{ flex: 1 }}
            />
          </InputContainer>
        </Setting>
        <Setting>
          <Label>
            <Checkbox
              checked={alertVals.sells}
              onChange={(e) => {
                handleInputChange('sells', e.target.checked)
              }}
            />
            Sells
          </Label>
          <InputContainer>
            <InputLabel variant="small">Min. Tokens</InputLabel>
            <NumberInput
              value={alertVals?.sellsTokens}
              onChange={(e) => {
                handleInputChange('sellsTokens', e.target.value)
              }}
              suffix="tokens"
              disabled={!alertVals.sells}
              sx={{ flex: 1 }}
            />
          </InputContainer>
          <InputContainer>
            <InputLabel variant="small">Daily Limit</InputLabel>
            <NumberInput
              value={alertVals?.sellsLimit}
              onChange={(e) => {
                handleInputChange('sellsLimit', e.target.value)
              }}
              suffix="alerts"
              disabled={!alertVals.sells}
              sx={{ flex: 1 }}
            />
          </InputContainer>
        </Setting>
      </SettingsGroup>
      <Flex
        sx={{
          gap: '10px',
          alignItems: 'center',
          justifyContent: 'right',
        }}
      >
        <Button
          sx={{ width: 150, marginTop: '10px' }}
          capitalize={true}
          disabled={true}
        >
          Save Changes
        </Button>
        <Flex sx={{ flexDirection: 'column' }}>
          <Button
            variant="plain"
            sx={{ paddingBottom: 0, paddingTop: '15px' }}
            capitalize={true}
            onClick={() => handleReset()}
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
export default function CollectorAlertSettings() {
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {data.map((item, index) => {
        return (
          <AlertSettingAccordion
            name={item.name}
            following={item.following}
            imageSrc={item.imageSrc}
            link={item.link}
            key={index}
          >
            <SettingsContent data={item.alertInfo} />
          </AlertSettingAccordion>
        )
      })}
    </Flex>
  )
}
