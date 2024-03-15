import { motion } from "framer-motion"
import { useState } from "react"
import styled from "styled-components"
import Duration from "./StakeDuration"
import BalanceInput from "@/app/components/BalanceInput"
import { TwoTabs } from "@/app/components/TwoTabs"

enum TradeCoin {
  Token = 'QLP',
  Coin = 'QCoin'
}

const Content = styled.div`
  padding: 25px 35px 0;
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

const Divider = styled.div<{ mt?: string}>`
  height: 1px;
  background: ${props => props.theme.colors.border1};
  margin-top: ${props => props.mt || "unset"};
`

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0;
`

const SelectArea = styled.div`
  display: flex;
  margin: 20px 0;
  gap: 20px;
`

export function StakeFormContent() {
  const [tab, setTab] = useState(TradeCoin.Token as string)
  const [amount, setAmout] = useState('')
  const [duration, setDuration] = useState('')


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
            subTitle: 'APR: 147.33%'
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
          <span>Stake Duration</span>
          <Duration value={duration} onChange={setDuration} />
        </SelectArea>
        <Divider />
        <Form>
          <FlexBox justify="space-between">
            <Label>Score</Label>
            <Label>123,123,123.00</Label>
          </FlexBox>
          <FlexBox justify="space-between">
            <Label>Maturity</Label>
            <Label>26 Mar 2024</Label>
          </FlexBox>
        </Form>
        <Button whileTap={{ scale: 1.1 }}>Stake</Button>
      </Content>
    </>
  )
}