"use client";
import FlexBox from "@/app/components/FlexBox";
import Image from "next/image";
import { FC } from "react";
import styled from "styled-components";
import ArrowRightIcon from "@/app/assets/referral/arrow-right.svg"

const Wrapper = styled.div`
  grid-area: claimable-rebate;
  background: ${(props) => props.theme.colors.fill2};
  border-radius: 8px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Title = styled.h2`
  font-size: ${(props) => props.theme.fontSize.regular};
  color: ${(props) => props.theme.colors.text1};
  margin-bottom: 10px;
`

const Label = styled.label`
  font-size: ${props => props.theme.fontSize.small};
  color: ${(props) => props.theme.colors.text4};
`

const Top = styled.div`
  display: flex;
  flex-direction: column;
`

const Left = styled.div`
  display: flex;
  flex-direction: column;
`

const HistoryBtn = styled.div`
  color: ${(props) => props.theme.colors.primary1};
  display: flex;
  gap: 6px;
  align-items: center;
  cursor: pointer;
  font-size: ${(props) => props.theme.fontSize.small};
`

const RebateNumber = styled.strong`
  font-size: ${(props) => props.theme.fontSize.header0};
  color: ${(props) => props.theme.colors.primary1};
`

const Button = styled.button`
  background: ${(props) => props.theme.colors.primary3};
  border-radius: 999px;
  width: 100px;
  line-height: 32px;
  outline: none;
  border: none;
  color: ${(props) => props.theme.colors.text1};
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.colors.primary1};
  }
`

const ClaimableRebate: FC = () => {

  return (
    <Wrapper>
      <Top>
        <Title>Total Claimable Rebate</Title>
        <Label>Data will be updated every Monday at 00:00 AM UTC.</Label>
      </Top>
      <FlexBox justify="space-between">
        <Left>
          <HistoryBtn>
            History
            <Image src={ArrowRightIcon} alt="" />
          </HistoryBtn>
          <RebateNumber>123,123.00 USD</RebateNumber>
        </Left>
        <Button>Claim</Button>
      </FlexBox>
    </Wrapper>
  )
};
export default ClaimableRebate;
