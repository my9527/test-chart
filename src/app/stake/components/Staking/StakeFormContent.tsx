import { motion } from "framer-motion"
import { useState } from "react"
import styled, { keyframes } from "styled-components"
import Duration from "./StakeDuration"
import BalanceInput from "../BalanceInput"
import { TwoTabs } from "@/app/components/TwoTabs"
import Button from "@/app/components/LinearGradientButton"
import FlexBox from '@/app/components/FlexBox'
import Image from "next/image"

enum TradeCoin {
  Token = 'QLP',
  Coin = 'QCoin'
}

const Content = styled.div`
  padding: 24px 35px 0;
`

const Label = styled.div`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.colors.text4};
  margin-right: 16px;
`

const DurationText = styled.div`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.colors.text1};
  white-space: nowrap;
`

const HDivider = styled.div`
  width: 1px;
  background: ${props => props.theme.colors.border1};
  height: 80px;
`

const Divider = styled.div<{ mt?: string}>`
  height: 1px;
  background: ${props => props.theme.colors.border1};
  margin-top: ${props => props.mt || "unset"};
`

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 14px 0;
`

const SelectArea = styled.div`
  display: flex;
  margin: 24px 0;
  gap: 20px;
`

const Maturity = styled.div`
  position: relative;
  width: 74px;
  height: 74px;
  margin-left: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const breath_light = keyframes`
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
`
const MaturityBg = styled.div`
  position: absolute;
  border-radius: 999px;
  background: ${props => props.theme.colors.primary3};
  filter: blur(15px);
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  animation: ${breath_light} 2s ease-in-out infinite;
`
const MaturityText = styled.strong`
  color: ${props => props.theme.colors.text1};
  z-index: 1;
  font-size: ${props => props.theme.fontSize.header0};
`

export function StakeFormContent() {
  const [tab, setTab] = useState(TradeCoin.Token as string)
  const [amount, setAmout] = useState('')
  const [duration, setDuration] = useState('')

  const multiplier = Number(duration) ? (Number(duration) / 30).toFixed(2) : '1.00'

  const stakeDisabled = !amount || !duration
  return (
    <>
      <TwoTabs
        tabs={[
          {
            key: TradeCoin.Token,
            title: '$QLP',
            subTitle: 'APR: 100.33%'
          },
          {
            key: TradeCoin.Coin,
            title: '$Qcoin',
            subTitle: 'APR: 147.33%',
            disabled: true,
          },
        ]}
        activeTab={tab}
        onTabChange={setTab}
      />
      <Content>
        <BalanceInput
          title="Stake Amount" 
          balance="123,123,123.00"
          currency={'QLP'}
          action={{
            text: 'Max',
            onClick: () => {},
          }}
          value={amount}
          onChange={setAmout}
        />
        <Divider mt="20px" />
        <SelectArea>
          <DurationText>Stake Duration</DurationText>
          <Duration value={duration} onChange={setDuration} />
          <HDivider />
          <Maturity>
            <MaturityBg />
            <MaturityText>{`${multiplier}x`}</MaturityText>
          </Maturity>
        </SelectArea>
        <Divider />
        <Form>
          <FlexBox justifyContent="space-between">
            <Label>Score</Label>
            <Label>123,123,123.00</Label>
          </FlexBox>
          <FlexBox justifyContent="space-between">
            <Label>Maturity</Label>
            <Label>26 Mar 2024</Label>
          </FlexBox>
        </Form>
        <FlexBox justifyContent="center"><Button disabled={stakeDisabled}>Stake</Button></FlexBox>
      </Content>
    </>
  )
}