"use client";
import { FC, useState } from "react";
import styled from "styled-components";
import FlexBox from '@/app/components/FlexBox'


const Wrapper = styled.div`
  grid-area: referral-code; 
  background: ${(props) => props.theme.colors.fill2};
  border-radius: 8px;
  padding: 16px 20px;
`

const Row = styled.div`
  display: flex;
  gap: 7px;
  flex-direction: column;
`

const Label = styled.div`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${(props) => props.theme.colors.text4};
`

const Value = styled.strong`
  font-size: ${props => props.theme.fontSize.header0};
  color: ${(props) => props.theme.colors.primary1};
`

const Divider = styled.div`
  height: 1px;
  background: ${(props) => props.theme.colors.border1};
  margin: 28px 0;
`


const ReferralCode: FC = () => {

  return (
    <Wrapper>
      <Row>
        <FlexBox justify="space-between">
          <Label>Bound referral code:</Label>
        </FlexBox>
        <FlexBox justify="space-between">
          <Label>Enjoyed code ratio:</Label>
          <Label>-</Label>
        </FlexBox>
        <FlexBox justify="space-between">
          <Label>Bonus ratio:</Label>
          <Label>10%</Label>
        </FlexBox>
      </Row>
      <Divider />
      <Label>Collected Rebate</Label>
      <Value>123,123.00 USD</Value>
    </Wrapper>
  )
};
export default ReferralCode;
