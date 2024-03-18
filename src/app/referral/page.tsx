"use client";
import { FC, useState } from "react";
import styled from "styled-components";
import FlexBox from '@/app/components/FlexBox'
import ClaimableRebate from "./components/ClaimableRebate";
import ReferralCode from "./components/ReferralCode";
import ReferralDetails from "./components/ReferralDetails";
import ReferralTab from "./components/Referral";
import Button from "@/app/components/Button";
import TwitterIcon from "@/app/assets/referral/twitter.svg";
import TelegramIcon from "@/app/assets/referral/telegram.svg";
import Image from "next/image";

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
  margin-bottom: 28px;
`

const Label = styled.label`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${(props) => props.theme.colors.text4};
`

const Value = styled.div`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${(props) => props.theme.colors.text1};
`

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 330px 330px 1fr;
  grid-template-rows: 200px 290px;
  grid-template-areas: 
    "claimable-rebate referral-code referral-details"
    "your-referral your-referral referral-details";
  gap: 10px;
`

const ReferralLink = styled.input`
  border: 1px solid ${(props) => props.theme.colors.primary2};
  outline: none;
  width: 100%;
  border-radius: 8px;
  height: 64px;
  padding-left: 22px;
  padding-right: 120px;
  background: unset;
  color: ${(props) => props.theme.colors.text1};

  &::placeholder {
    color: ${(props) => props.theme.colors.primary1};
  }
`

const ReferralLinkBox = styled.div`
  position: relative;
  flex-grow: 1;
`

const ReferralLinkWrapper = styled.div`
  display: flex;
  margin: 14px 0 10px;
  gap: 10px;
`

const IconButton = styled.div`
  padding: 6px 18px;
  border-radius: 12px;
  background: ${(props) => props.theme.colors.fill1};
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.colors.primary3};
  }
`

const Actions = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 5px;
`

const CopyButton = styled.div`
  cursor: pointer;
  line-height: 64px;
  width: 140px;
  text-align: center;
  background: ${(props) => props.theme.colors.fill2};
  border-radius: 8px;
  color: ${(props) => props.theme.colors.text4};

  &:hover {
    color: ${(props) => props.theme.colors.text1};
    background: ${(props) => props.theme.colors.primary3};
  }
`


const Referral: FC = () => {

  return (
    <Wrapper>
      <InnerWrapper>
        <Title>Invite More Friends To Earn Fee Rebates</Title>
        <FlexBox gap='40px'>
          <FlexBox gap='10px'>
            <Label>Current referral code: </Label>
            <Value>123456</Value>
          </FlexBox>
          <FlexBox gap='10px'>
            <Label>Rebate ratio split: </Label>
            <Value>10% / 15%</Value>
          </FlexBox>
          <Button padding="1px 10px" primary>Choose another code</Button>
        </FlexBox>
        <ReferralLinkWrapper>
          <ReferralLinkBox>
            <ReferralLink placeholder="Referral Link" />
            <Actions>
              <IconButton><Image src={TwitterIcon} alt="" /></IconButton>
              <IconButton><Image src={TelegramIcon} alt="" /></IconButton>
            </Actions>
          </ReferralLinkBox>
          <CopyButton>Copy</CopyButton>
        </ReferralLinkWrapper>
        <MainContent>
          <ClaimableRebate />
          <ReferralCode />
          <ReferralTab />
          <ReferralDetails />
        </MainContent>
      </InnerWrapper>
    </Wrapper>
  )
};
export default Referral;
