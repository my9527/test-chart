"use client";
import { FC, useState } from "react";
import styled from "styled-components";
import Tabs from "@/app/components/Tabs";
import dynamic from "next/dynamic";
// import PoolContent from "./components/Pool";
// import StakingContent from "./components/Staking";

const PoolContent = dynamic(() => import("./components/Pool"), {
  ssr: false,
});
const StakingContent = dynamic(() => import("./components/Staking"), {
  ssr: false,
});

enum StakeTabType {
  Pool = 'pool',
  Staking = 'staking'
}

const Wrapper = styled.div`
  background-color: ${props => props.theme.colors.fill1};
  padding: 50px 0;
  height: calc(100vh - 50px);
`

const Content = styled.div`
  width: 1420px;
  margin: 0 auto;
`

const Title = styled.h2`
  font-size: 30px;
  color: ${(props) => props.theme.colors.text1};
  margin-bottom: 28px;
`


const token = 'QLP'
const Stake: FC = () => {
  const [tab, setTab] = useState(StakeTabType.Pool as string)

  return (
    <Wrapper>
      <Content>
        <Title>{ tab === StakeTabType.Pool ? token : 'Stake for extra profit' }</Title>
        <Tabs
          tabs={[
            {
              key: StakeTabType.Pool, 
              title: "pool", 
              children: <PoolContent /> 
            }, 
            { 
              key: StakeTabType.Staking, 
              title: 'staking', 
              children: <StakingContent /> 
            }
          ]} 
          tab={tab}
          onTabChange={setTab}
        />
      </Content>
    </Wrapper>
  )
};
export default Stake;
