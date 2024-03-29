"use client";
import { FC, useState } from "react";
import styled from "styled-components";
import FlexBox from '@/app/components/FlexBox'
import Button from "@/app/components/Button";
import { ProgressBar } from "./ProgressBar";


const Wrapper = styled.div`
  flex-grow: 1;
  padding: 20px 20px 0;
`

const Label = styled.label`
  font-size: ${props => props.theme.fontSize.small};
  color: ${(props) => props.theme.colors.text4};
`

const ReferralRank = styled.div`
  background-color: ${(props) => props.theme.colors.fill3};
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`
const Progress = styled.div`
  padding-top: 35px;
`

interface IYourReferralProps {
  onClickRankDetail: () => void;
}
const YourReferral: FC<IYourReferralProps> = ({ onClickRankDetail }) => {

  return (
    <Wrapper>
      <ReferralRank>
        <FlexBox justifyContent="space-between">
          <Label>Your Referral Rank:</Label>
          <FlexBox gap="20px">
            <Button onClick={onClickRankDetail} padding="2px 10px" primary>Rank Details</Button>
            <Label>Rank 1</Label>
          </FlexBox>
        </FlexBox>
        <FlexBox justifyContent="space-between">
          <Label>Allocatable Rebate Ratio:</Label>
          <Label>30%</Label>
        </FlexBox>
      </ReferralRank>
      <Progress>
        <Label>Rank Progress</Label>
        <ProgressBar active={6} total={10} />
      </Progress>
    </Wrapper>
  )
};
export default YourReferral;
