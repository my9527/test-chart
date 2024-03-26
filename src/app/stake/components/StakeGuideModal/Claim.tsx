import { Description, Wrapper, Button } from "./common";
import { useState } from "react";
import styled from "styled-components";
import FlexBox from "@/app/components/FlexBox";
import SimpleText from "@/app/components/SimpleText";

const Form = styled.div`
  background: ${props => props.theme.colors.fill2};
  border-radius: 8px;
  padding: 10px;
`

export const Claim = () => {

  return (
    <Wrapper>
      <Description>QLP orders will be executed at the turn of each Epoch. You can claim your purchased QLP at the beginning of the next Epoch.</Description>
      <Form>
        <FlexBox justifyContent="space-between">
          <SimpleText $color="text4" $size="min">Current Epoch Remaining</SimpleText>
          <SimpleText $color="text1" $size="min">00:00:00</SimpleText>
        </FlexBox>
        <FlexBox justifyContent="space-between">
          <SimpleText $color="text4" $size="min">Bought QLP</SimpleText>
          <SimpleText $color="text1" $size="min">0</SimpleText>
        </FlexBox>
      </Form>
      <FlexBox justifyContent="center">
        <Button minWidth={56} height={20}>Claim</Button>
      </FlexBox>
    </Wrapper>
  );
};
