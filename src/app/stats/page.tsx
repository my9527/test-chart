"use client";
import styled from "styled-components";
import Tabs from "../components/Tabs";
import { useState } from "react";
import dynamic from "next/dynamic";
const OverviewPage = dynamic(() => import('./components/Overview'))
const Leaderboard = dynamic(() => import('./components/Leaderboard'))

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

const PortfolioPage = () => {
  const [tab, setTab] = useState('leaderboard')

  return (
    <Wrapper>
      <Content>
        <Tabs 
          tabs={[
            {
              key: 'leaderboard',
              title: 'Leaderboard',
              children: <Leaderboard />,
            },
            {
              key: 'overview',
              title: 'Overview',
              children: <OverviewPage />,
            },
          ]}
          tab={tab}
          onTabChange={setTab}
        />
      </Content>
    </Wrapper>
  )
}

export default PortfolioPage;