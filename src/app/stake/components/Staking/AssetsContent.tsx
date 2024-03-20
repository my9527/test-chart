import Tabs from "@/app/components/Tabs"
import { useState } from "react"
import styled from "styled-components"
import Table from "@/app/components/Table"
import Button from "@/app/components/Button"

const Text = styled.div`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.colors.text1};
  align-self: center;
`
const PrimaryText = styled.span`
  color: ${props => props.theme.colors.primary1};
`

const Content = styled.div`
  overflow: auto;
  flex-grow: 1;
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
          children: <StakeAssets />,
        },
        {
          key: TabType.Unstake, 
          title: 'UnStaked assets',
          children: <UnstakedAssets />,
        },
      ]}
      tab={tab}
      onTabChange={setTab}
    />
  )
}


function StakeAssets () {
  const data = [
    {
      token: 'QLP',
      amount: '123,123.00',
      duration: '1M',
      score: '123,123',
      maturity: '26 Mar 2024',
    },
    {
      token: 'QLP',
      amount: '123,123.00',
      duration: '1M',
      score: '123,123',
      maturity: '26 Mar 2024',
    },
    {
      token: 'QLP',
      amount: '123,123.00',
      duration: '1M',
      score: '123,123',
      maturity: '26 Mar 2024',
    },
    {
      token: 'QLP',
      amount: '123,123.00',
      duration: '1M',
      score: '123,123',
      maturity: '26 Mar 2024',
    },
    {
      token: 'QLP',
      amount: '123,123.00',
      duration: '1M',
      score: '123,123',
      maturity: '26 Mar 2024',
    }
  ]

  const columns = [
    {
      title: 'Token',
      dataKey: 'token',
      primary: true,
    },
    {
      title: 'Amount',
      dataKey: 'amount',
    },
    {
      title: 'Duration',
      dataKey: 'duration',
    },
    {
      title: 'Score',
      dataKey: 'score'
    },
    {
      title: 'Maturity',
      dataKey: 'maturity'
    },
    {
      title: 'Action',
      render: () => {
        return (
          <Button secondary padding="5px 24px">Claim</Button>
        )
      }
    }
  ]
  return (
    <Content>
      <Table
        data={data}
        columns={columns}
        bodyCellHeight={35}
      />
    </Content>
  )
}



function UnstakedAssets () {
  const data = [
    {
      token: 'QLP',
      amount: '123,123.00',
      claimed: '123',
      total: '123,123',
      unstakeDate: '123,123',
      maturity: '26 Mar 2024',
    }
  ]

  const columns = [
    {
      title: 'Token',
      dataKey: 'token',
      primary: true,
    },
    {
      title: 'Amount',
      dataKey: 'amount',
    },
    {
      title: 'Claimed/Total',
      dataKey: 'claimTotal',
      render: (row: {[key: string]: any}) => {
        return (
          <Text>{row.claimed}/<PrimaryText>{row.total}</PrimaryText></Text>
        )
      }
    },
    {
      title: 'Unstake date',
      dataKey: 'unstakeDate'
    },
    {
      title: 'Maturity',
      dataKey: 'maturity'
    },
    {
      title: 'Action',
      render: () => {
        return (
          <Button secondary padding="5px 24px">Unstake</Button>
        )
      }
    }
  ]
  return (
    <Content>
      <Table
        data={data}
        columns={columns}
        bodyCellHeight={35}
      />
    </Content>
  )
}