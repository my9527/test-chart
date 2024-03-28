"use client";
import { FC, useCallback, useRef, useState } from "react";
import styled from "styled-components";
import ReferralDetails from "./components/ReferralDetails";
import ReferralTab from "./components/Referral";
import { RebateArea } from "./components/RebateArea";
import { SelectReferralCode } from "./components/SelectReferralCode";
import { Header } from "./components/Header";
import { ReferralLink } from "./components/ReferralLink";


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

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 670px 1fr;
  grid-template-rows: 200px 290px;
  grid-template-areas: 
    "rebate-area referral-details"
    "your-referral referral-details";
  gap: 10px;
`

const Referral: FC = () => {
  //choose referral code modal visibility
  const [visible, setVisible] = useState(false);

  const openModal = useCallback(() => {
    setVisible(true)
  }, [])

  const hideModal = useCallback(() => {
    setVisible(true)
  }, [])
  return (
    <Wrapper>
      <InnerWrapper>
        <Title>Invite More Friends To Earn Fee Rebates</Title>
        <Header onClickChooseCode={openModal} />
        <ReferralLink />
        <MainContent>
          <RebateArea />
          <ReferralTab />
          <ReferralDetails />
        </MainContent>
      </InnerWrapper>
      <SelectReferralCode visible={visible} onClose={hideModal} />
    </Wrapper>
  )
};
export default Referral;
