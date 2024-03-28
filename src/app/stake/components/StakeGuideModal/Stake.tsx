import BalanceInput from "@/app/components/BalanceInput";
import { Description, Button } from "./common";
import { useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import FlexBox from "@/app/components/FlexBox";
import SimpleText from "@/app/components/SimpleText";
import StakeDuration from '../Staking/StakeDuration';


export const Wrapper = styled.div`
  padding: 0 15px;

  .balance-input input {
    font-size: ${props => props.theme.fontSize.min};
    bottom: 2px;
  }

  .balance-input > div {
    font-size: ${props => props.theme.fontSize.min};
    gap: 6px;
    padding: 3px 14px;
  }

  .currency {
    font-size: ${props => props.theme.fontSize.min};
  }

  .action-btn {
    padding: 1px 12px;
    font-size: ${props => props.theme.fontSize.min};
  }
`

const Duration = styled.div`
  background: ${props => props.theme.colors.fill2};
  border-radius: 8px;
  padding: 8px 10px;
  margin-top: 8px;

  .duration-item {
    border: 1px solid ${props => props.theme.colors.border1};
    background: ${props => props.theme.colors.fill2};
    color: ${props => props.theme.colors.primary1};
    font-weight: bold;
    font-size: ${props => props.theme.fontSize.min};
    line-height: 24px;

    &.active {
      border-color: ${props => props.theme.colors.primary1};
      background: ${props => props.theme.colors.border1};
    }

    &:hover {
      border-color: ${props => props.theme.colors.primary1};
      background: ${props => props.theme.colors.border1};
    }
  }
`

const Form = styled.div`
  background: ${props => props.theme.colors.fill2};
  border-radius: 8px;
  padding: 8px 10px;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const DurationWrapper = styled.div`
  padding: 8px 24px 0;

  .customize-input {
    border-color: ${props => props.theme.colors.primary2};
  }
`

export const Stake = () => {
  const [amount, setAmount] = useState<string>('123.00');
  const [duration, setDuration] = useState('');

  const multiplier = Number(duration) ? (Number(duration) / 30).toFixed(2) : '1.00'

  return (
    <Wrapper>
      <Description>Stake your liquidity tokens and earn additional token rewards.</Description>
      <BalanceInput
        title="State Amount" 
        balance="123,123,123.00"
        currency="QLP"
        action={{
          text: 'Max',
          onClick: () => {},
        }}
        value={amount}
        onChange={setAmount}
      />
      <Duration>
        <SimpleText $size="min" $color="text4">Stake Duration</SimpleText>
        <DurationWrapper>
          <StakeDuration value={duration} onChange={setDuration} />
        </DurationWrapper>
      </Duration>
      <Form>
        <FlexBox justifyContent="space-between">
          <SimpleText $size="min" $color="text4">Multiplier</SimpleText>
          <SimpleText $size="min" $color="text1">{`${multiplier}x`}</SimpleText>
        </FlexBox>
        <FlexBox justifyContent="space-between">
          <SimpleText $size="min" $color="text4">Score</SimpleText>
          <SimpleText $size="min" $color="text1">123,123,123.00</SimpleText>
        </FlexBox>
        <FlexBox justifyContent="space-between">
          <SimpleText $size="min" $color="text4">Maturity</SimpleText>
          <SimpleText $size="min" $color="text1">26 Mar 2024</SimpleText>
        </FlexBox>
      </Form>
      <FlexBox justifyContent="center">
        <Button minWidth={56} height={20}>Stake</Button>
      </FlexBox>
    </Wrapper>
  );
};
