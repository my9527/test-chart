"use client";
import { FC, useState } from "react";
import styled from "styled-components";
import Tabs from "@/app/components/Tabs";
import dynamic from "next/dynamic";
import FlexBox from "../components/FlexBox";
import SimpleText from "../components/SimpleText";
import { DepositModal } from "../components/Header/DepositModal";
import StakeGuideModal from "./components/StakeGuideModal";
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
  overflow-y: auto;
`

const Content = styled.div`
  width: 1420px;
  margin: 0 auto;
`

const Title = styled.h2`
  font-size: 30px;
  color: ${(props) => props.theme.colors.text1};
`

const Header = styled.div`
  margin-bottom: 28px;
`

const APRTag = styled.div`
  color: ${(props) => props.theme.colors.primary1};
  padding: 2px 20px;
  background: ${(props) => props.theme.colors.border1};
  font-size: ${props => props.theme.fontSize.small};
  border-radius: 999px;
`

const token = 'QLP'
const Stake: FC = () => {
  const [tab, setTab] = useState(StakeTabType.Pool as string)
  const [visible, setVisible] = useState(false)

  return (
    <Wrapper>
      <Content>
        <Header>
          {
            tab === StakeTabType.Pool ? (
              <FlexBox justifyContent="space-between">
                <FlexBox alignItems="center" gap="20px">
                  <Title>{token}</Title>
                  <APRTag>Est. APR: 100.00%</APRTag>
                </FlexBox>
                <SimpleText onClick={() => setVisible(true)} $color="text4" $size="small">How to become a liquidity provider?</SimpleText>
              </FlexBox>
            ) : (
              <Title>Stake for extra profit</Title>
            )
          }
        </Header>
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
      <StakeGuideModal 
        visible={visible} 
        onClose={() => setVisible(false)} 
      />
    </Wrapper>
  )
};
export default Stake;
