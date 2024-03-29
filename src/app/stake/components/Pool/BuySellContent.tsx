import { motion } from "framer-motion"
import { useState } from "react"
import styled from "styled-components"
import ArrowDownIcon from "@/app/assets/stake/arrow-down.svg"
import Image from "next/image"
import { TwoTabs } from "@/app/components/TwoTabs"
import BalanceInput from "../BalanceInput"
import Button from '@/app/components/LinearGradientButton'
import FlexBox from '@/app/components/FlexBox'

enum TradeType {
  Buy = 'buy',
  Sell = 'sell'
}

const ImageWrapper = styled.div`
  margin: 10px auto;
  text-align: center;
  width: 40px;
  height: 40px;
`

const Content = styled.div`
  padding: 20px 35px 15px;
`

const Label = styled.div`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.colors.text4};
  margin-right: 16px;
`

const Value = styled.div`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.colors.text1};
`

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 18px 0;
`

const token = 'QLP'
export function BuySellContent() {
  const [type, setType] = useState(TradeType.Buy as string)
  const [position, setPosition] = useState('')
  const [receive, setReceive] = useState('')


  return (
    <>
      <TwoTabs
        tabs={[
          {
            key: TradeType.Buy,
            title: `Buy ${token}`,
          },
          {
            key: TradeType.Sell,
            title: `Sell ${token}`,
          },
        ]}
        activeTab={type}
        onTabChange={setType}
      />
      <Content>
        <BalanceInput
          title="Your Position" 
          balance="123,123,123.00"
          currency="USDX"
          action={{
            text: 'Max',
            onClick: () => {},
          }}
          value={position}
          onChange={setPosition}
        />
        <ImageWrapper><Image alt="" src={ArrowDownIcon} width={40} height={40} /></ImageWrapper>
        <BalanceInput 
          title="Your receive" 
          balance="123,123,123.00"
          currency={token}
          value={receive}
          onChange={setReceive}
        />
        <Form>
          <Label>{`1 ${token} = 1.00 USDX`}</Label>
          <FlexBox justifyContent="space-between">
            <Label>Fees</Label>
            <Value>-</Value>
          </FlexBox>
          <FlexBox justifyContent="space-between">
            <Label>{`Est. ${token} received`}</Label>
            <Value>123,123.00</Value>
          </FlexBox>
        </Form>
        <FlexBox justifyContent="center"><Button>{type === TradeType.Sell ? 'Sell' : 'Buy'}</Button></FlexBox>
      </Content>
    </>
  )
}