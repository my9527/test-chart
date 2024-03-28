import FlexBox from "@/app/components/FlexBox";
import styled from "styled-components";
import Button from "../Button";
import { memo } from "react";

const Label = styled.label`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${(props) => props.theme.colors.text4};
`

const Value = styled.div`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${(props) => props.theme.colors.text1};
`

export const Header = memo(function Header ({ onClickChooseCode }: { onClickChooseCode: () => void }) {
  return (
    <FlexBox gap='40px'>
      <FlexBox gap='10px'>
        <Label>Current referral code: </Label>
        <Value>123456</Value>
      </FlexBox>
      <FlexBox gap='10px'>
        <Label>Rebate ratio split: </Label>
        <Value>10% / 15%</Value>
      </FlexBox>
      <Button onClick={onClickChooseCode}>Choose another code</Button>
    </FlexBox>
  );
});