"use client";
import FlexBox from "@/app/components/FlexBox";
import Image from "next/image";
import { FC } from "react";
import styled from "styled-components";
import ArrowRightIcon from "@/app/assets/referral/arrow-right.svg"
import LinearGradientButton from '@/app/components/LinearGradientButton'

const Wrapper = styled.div`
  flex-grow: 1;
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
  background: ${(props) => props.theme.colors.primary3};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

interface IClaimableRebateProps {
  onClickHistory: () => void;
}
const ClaimableRebate: FC<IClaimableRebateProps> = ({ onClickHistory }) => {

  return (
    <Wrapper>
      <Top>
        <Title>Total Claimable Rebate</Title>
        <Label>Data will be updated every Monday at 00:00 AM UTC.</Label>
      </Top>
      <FlexBox justify="space-between" align="flex-end">
        <Left>
          <HistoryBtn onClick={onClickHistory}>
            History
            <Image src={ArrowRightIcon} alt="" />
          </HistoryBtn>
          <RebateNumber>123,123.00 USD</RebateNumber>
        </Left>
        <LinearGradientButton height={32} minWidth={100}>Claim</LinearGradientButton>
      </FlexBox>
    </Wrapper>
  )
};
export default ClaimableRebate;
