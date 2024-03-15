import Tabs from "@/app/components/Tabs"
import { useState } from "react"
import styled from "styled-components"

const Title = styled.h2`
  font-size: ${props => props.theme.fontSize.header2};
  color: ${props => props.theme.colors.text1};
  margin-bottom: 10px;
`
const FieldFlex = styled.div`
  display: flex;
  justify-content: space-between;
`

const FieldBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const FieldLabel = styled.div`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.colors.text4};
  line-height: 20px;
`

const FieldValue = styled.div`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.colors.text1};
`

const Button = styled.div`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.colors.primary1};
  line-height: 20px;
  padding: 0 14px;
  background: ${props => props.theme.colors.fill3};
  border-radius: 99px;
  &:hover {
    background: ${props => props.theme.colors.primary1};
    color: ${props => props.theme.colors.text1};
  }
`

const Actions = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  cursor: pointer;
`

const token = 'QLP'

enum TabType {
  Stake = 'stake',
  Unstake = 'unstake'
}

export function AssetsContent() {
  const [tab, setTab] = useState(TabType.Stake as string)
  
  return (
    <Tabs 
      tabs={[
        {
          key: TabType.Stake, 
          title: 'Staking assets', 
          children: '111',
        },
        {
          key: TabType.Unstake, 
          title: 'UnStaked assets',
          children: '222',
        },
      ]}
      tab={tab}
      onTabChange={setTab}
    />
  )
}