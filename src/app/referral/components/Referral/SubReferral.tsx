"use client";
import { FC } from "react";
import styled from "styled-components";


const Wrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
`

const Label = styled.label`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${(props) => props.theme.colors.text4};
`

const FlexBox = styled.div`
  padding: 7px 0;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${(props) => props.theme.colors.border1};
`

const SubReferral: FC = () => {

  return (
    <Wrapper>
      <div>
        <FlexBox>
          <Label>SR ratio:</Label>
          <Label>5%</Label>
        </FlexBox>
        <FlexBox>
          <Label>SR friends:</Label>
          <Label>1,234</Label>
        </FlexBox>
        <FlexBox>
          <Label>Total SR rebate:</Label>
          <Label>123,123.00 USD</Label>
        </FlexBox>
        <FlexBox>
          <Label>SR active friends:</Label>
          <Label>1,234</Label>
        </FlexBox>
      </div>
      <Label>Expiration date  2024/03/07</Label>
    </Wrapper>
  )
};
export default SubReferral;
