"use client";
import { FC, useState } from "react";
import styled from "styled-components";
import FlexBox from '@/app/components/FlexBox'
import Button from "../../Button";
import { BindReferralCodeModal } from "../../BindReferralCodeModal";


const Wrapper = styled.div`
  flex-basis: 330px;
  background: ${(props) => props.theme.colors.fill2};
  border-radius: 8px;
  padding: 16px 20px;
  flex-shrink: 0;
  &:hover {
    box-shadow: ${props => props.theme.colors.fill2Hover}
  }
`

const Row = styled.div`
  display: flex;
  gap: 7px;
  flex-direction: column;
`

const Label = styled.div`
  font-size: ${props => props.theme.fontSize.small};
  color: ${(props) => props.theme.colors.text4};
`

const Value = styled.strong`
  font-size: ${props => props.theme.fontSize.header0};
  color: ${(props) => props.theme.colors.primary1};
  background: ${(props) => props.theme.colors.primary3};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Divider = styled.div`
  height: 1px;
  background: ${(props) => props.theme.colors.border1};
  margin: 26px 0;
`


const ReferralCode: FC = () => {
  const [visible, setVisible] = useState(false)

  const openModal = () => {
    setVisible(true)
  }

  const hideModal = () => {
    setVisible(false)
  }
  return (
    <Wrapper>
      <Row>
        <FlexBox justifyContent="space-between">
          <Label>Bound referral code:</Label>
          <Button onClick={openModal}>Bind Referral Code</Button>
        </FlexBox>
        <FlexBox justifyContent="space-between">
          <Label>Enjoyed code ratio:</Label>
          <Label>-</Label>
        </FlexBox>
        <FlexBox justifyContent="space-between">
          <Label>Bonus ratio:</Label>
          <Label>10%</Label>
        </FlexBox>
      </Row>
      <Divider />
      <Label>Collected Rebate</Label>
      <Value>123,123.00 USD</Value>
      <BindReferralCodeModal 
        visible={visible} 
        onClose={hideModal} 
        onCancel={hideModal} 
      />
    </Wrapper>
  )
};
export default ReferralCode;
