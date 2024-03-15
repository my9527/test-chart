import { motion } from "framer-motion"
import { useState } from "react"
import styled from "styled-components"
import ArrowDownIcon from "@/app/assets/stake/arrow-down.svg"
import Image from "next/image"
import { BuySellInput } from "./BuySellInput"

enum TradeType {
  Buy = 'buy',
  Sell = 'sell'
}

const Title = styled.h2`
  font-size: ${props => props.theme.fontSize.header2};
  color: ${props => props.theme.colors.text4};
`

const ImageWrapper = styled.div`
  margin: 10px 0;
  text-align: center;
`

const Header = styled.div`
  display: flex;
`

const TabPanel = styled.div<{ active: boolean }>`
  flex-grow: 1;
  text-align: center;
  line-height: 55px;
  background: ${props => props.active ? 'unset' : props.theme.colors.fill3};
  cursor: pointer;
  position: relative;
`

const Content = styled.div`
  padding: 20px 35px 15px;
`

const Button = styled(motion.div)`
  font-size: ${props => props.theme.fontSize.header2};
  color: ${props => props.theme.colors.text1};
  line-height: 40px;
  width: 200px;
  background: linear-gradient(90deg, #634AFF 0%, #7E73FF 100%);
  border-radius: 999px;
  text-align: center;
  cursor: pointer;
  margin: 0 auto;
`

const FlexBox = styled.div<{ justify?: string }>`
  display: flex;
  justify-content: ${props => props.justify || "flex-start"};
  align-items: center;
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
  margin: 20px 0;
`

const Hilight = styled.div<{ active: boolean }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 2px;
  width: 100%;
  background: ${props => props.active ? props.theme.colors.primary1 : 'transparent'};
`

const token = 'QLP'
export function BuySellContent() {
  const [type, setType] = useState<TradeType.Buy | TradeType.Sell>(TradeType.Buy)
  const [position, setPosition] = useState('0')
  const [receive, setReceive] = useState('0')

  const lists = [
    {
      type: TradeType.Buy,
      title: `Buy ${token}`,
      btnText: "Buy"
    },
    {
      type: TradeType.Sell,
      title: `Sell ${token}`,
      btnText: "Sell"
    }
  ]

  const current = lists.find(item => item.type === type)

  const handleTabChange = (v: TradeType.Buy | TradeType.Sell) => () => {
    setType(v)
  }

  return (
    <>
      <Header>
        {
          lists.map(i => (
            <TabPanel key={i.type} active={i.type === type} onClick={handleTabChange(i.type)}>
              <Title>{i.title}</Title>
              <Hilight active={i.type === type} />
            </TabPanel>
          ))
        }
      </Header>
      <Content>
        <BuySellInput
          title="Your Position" 
          balance="123,123,123.00"
          currency="USDX"
          action={{
            text: 'Max',
            onClick: () => {},
          }}
          value={position}
          onChange={e => setPosition(e.target.value)}
        />
        <ImageWrapper><Image alt="" src={ArrowDownIcon} width={40} height={40} /></ImageWrapper>
        <BuySellInput 
          title="Your receive" 
          balance="123,123,123.00"
          currency={token}
          value={receive}
          onChange={e => setReceive(e.target.value)}
        />
        <Form>
          <Label>{`1 ${token} = 1.00 USDX`}</Label>
          <FlexBox justify="space-between">
            <Label>Fees</Label>
            <Value>-</Value>
          </FlexBox>
          <FlexBox justify="space-between">
            <Label>{`Est. ${token} received`}</Label>
            <Value>123,123.00</Value>
          </FlexBox>
        </Form>
        <Button whileTap={{ scale: 1.1 }}>{current?.btnText}</Button>
      </Content>
    </>
  )
}