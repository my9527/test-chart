"use client";
import styled from "styled-components";
import Tabs from "../components/Tabs";
import { useState } from "react";
import dynamic from "next/dynamic";
const OverviewPage = dynamic(() => import('./components/Overview'))
const VIPLevel = dynamic(() => import('./components/VIPLevel'))

const Wrapper = styled.div`
  height: calc(100vh - 50px);
  background: ${props => props.theme.colors.fill1};
`

const Content = styled.div`
  width: 1420px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`
enum ETabType {
  Overview = 'overview',
  VIPLevel = 'vip-level',
  Position = 'position',
  History = 'history'
}

const PortfolioPage = () => {
  const [tab, setTab] = useState(ETabType.Overview as string)

  return (
    <Wrapper>
      <Content>
        <Tabs 
          tabs={[
            {
              key: ETabType.Overview,
              title: 'Overview',
              children: <OverviewPage />,
            },
            {
              key: ETabType.VIPLevel,
              title: 'VIP Level',
              children: <VIPLevel />,
            },
            {
              key: ETabType.Position,
              title: 'Position',
              children: <div>position</div>,
            },
            {
              key: ETabType.History,
              title: 'History',
              children: <div>history</div>,
            }
          ]}
          tab={tab}
          onTabChange={setTab}
        />
      </Content>
    </Wrapper>
  )
}

export default PortfolioPage;