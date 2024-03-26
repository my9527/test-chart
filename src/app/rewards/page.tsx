"use client";
import { FC, useCallback, useRef, useState } from "react";
import styled from "styled-components";
import FlexBox from "../components/FlexBox";
import TradingRewards from "./components/TradingRewards";
import TradingRewardsHistory from "./components/TradingRewardsHistory";
import StakingRewards from "./components/StakingRewards";
import ClaimHistory from "./components/ClaimHistory";
import { ChartContent } from "../stake/components/Staking/ChartContent";
import Box from "@/app/components/Box";

const Wrapper = styled.div`
  background-color: ${props => props.theme.colors.fill1};
  padding: 50px 0;
  height: calc(100vh - 50px);
  overflow: auto;
`

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 1400px;
  margin: 0 auto;
`

const Title = styled.h2`
  font-size: 30px;
  color: ${(props) => props.theme.colors.text1};
  margin-bottom: 10px;
`

const SubTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.small};
  color: ${(props) => props.theme.colors.text4};
  margin-bottom: 10px;
`

const StyledFlexBox = styled(FlexBox)`
  flex-grow: 1;
`

const StyledChart = styled(Box)`
  height: 420px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const Rewards: FC = () => {
  return (
    <Wrapper>
      <InnerWrapper>
        <Title>Trading Rewards</Title>
        <SubTitle>Phase One: April 1st 10:00 UTC ~ April 29th 10:00 UTC</SubTitle>
        <FlexBox gap="10px" alignItems="stretch">
          <TradingRewards />
          <TradingRewardsHistory />
        </FlexBox>
        <Title>Staking Rewards</Title>
        <SubTitle>2024 April 1st 10:00 UTC ~ 2025 March 27th 10:00 UTC</SubTitle>
        <FlexBox gap="10px" alignItems="stretch">
          <StyledFlexBox gap="10px" direction="column">
            <StakingRewards />
            <StyledChart><ChartContent /></StyledChart>
          </StyledFlexBox>
          <ClaimHistory />
        </FlexBox>
      </InnerWrapper>
    </Wrapper>
  )
};
export default Rewards;
