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
// SettingsGroup.defaultProps = { columns: ['1fr', '1fr', '1fr'] }
const NumberInput = styled(InputRounded)``
NumberInput.defaultProps = { dark: true, type: 'number' }

interface AlertValsType {
  priceChange: boolean
  priceChangeVal: number
  appraisalChange: boolean
  appraisalChangeVal: number
  dealAlert: boolean
  underPricedVal: number
  sold: boolean
  listed: boolean
}
const alertDefaultVal: AlertValsType = {
  priceChange: true,
  priceChangeVal: 2,
  appraisalChange: true,
  appraisalChangeVal: 2,
  dealAlert: true,
  underPricedVal: 2,
  sold: true,
  listed: true,
}
const address = '0x5Af0D9827E0c53E4799BB226655A1de152A425a5'
const id = 2222
const data = [
  {
    name: '"Milady 0 #2222"',
    following: true,
    imageSrc: 'https://www.miladymaker.net/milady/2222.png',
    type: 'nft',
    link: `/analytics/nft/${address}/${id}`,
    alertInfo: alertDefaultVal,
  },
]

function SettingsContent({ data }) {
  const [alertVals, setAlertVals] = useState<AlertValsType>(data)

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
              checked={alertVals.priceChange}
              onChange={(e) => {
                handleInputChange('priceChange', e.target.checked)
              }}
            />
            Price Change
          </Label>
          <InputContainer>
            <InputLabel variant="small">Price Change</InputLabel>
            <NumberInput
              value={alertVals?.priceChangeVal}
              onChange={(e) => {
                handleInputChange('priceChangeVal', e.target.value)
              }}
              suffix="%"
              sx={{ flex: 1 }}
              disabled={!alertVals.priceChange}
            />
          </InputContainer>

          <Label>
            <Checkbox
              checked={alertVals.appraisalChange}
              onChange={(e) => {
                handleInputChange('appraisalChange', e.target.checked)
              }}
            />
            Appraisal Change
          </Label>
          <InputContainer>
            <InputLabel variant="small">Appraisal Change</InputLabel>
            <NumberInput
              value={alertVals?.appraisalChangeVal}
              onChange={(e) => {
                handleInputChange('priceChangeVal', e.target.value)
              }}
              suffix="%"
              sx={{ flex: 1 }}
              disabled={!alertVals.appraisalChange}
            />
          </InputContainer>
        </Setting>
        <Setting>
          <Label>
            <Checkbox
              checked={alertVals.dealAlert}
              onChange={(e) => {
                handleInputChange('dealAlert', e.target.checked)
              }}
            />
            Deal alerts
          </Label>
          <InputContainer>
            <InputLabel variant="small">Under-priced</InputLabel>
            <NumberInput
              value={alertVals?.underPricedVal}
              onChange={(e) => {
                handleInputChange('underPricedVal', e.target.value)
              }}
              suffix="tokens"
              disabled={!alertVals.dealAlert}
              sx={{ flex: 1 }}
            />
          </InputContainer>
        </Setting>
        <Setting>
          <Label>
            <Checkbox
              checked={alertVals.sold}
              onChange={(e) => {
                handleInputChange('sold', e.target.checked)
              }}
            />
            Sold
          </Label>
          <Label>
            <Checkbox
              checked={alertVals.listed}
              onChange={(e) => {
                handleInputChange('listed', e.target.checked)
              }}
            />
            Listed
          </Label>
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
export default function NFTAlertSettings() {
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
            link={item.link}
            imageSrc={item.imageSrc}
            key={index}
          >
            <SettingsContent data={item.alertInfo} />
          </AlertSettingAccordion>
        )
      })}
    </Flex>
  )
}
