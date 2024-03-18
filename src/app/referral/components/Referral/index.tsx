"use client";
import { FC, useState } from "react";
import styled from "styled-components";
import FlexBox from '@/app/components/FlexBox'
import { TwoTabs } from "@/app/components/TwoTabs";
import YourReferral from "./YourReferral";
import SubReferral from "./SubReferral";


const Wrapper = styled.div`
  grid-area: your-referral;
  background: ${(props) => props.theme.colors.fill2};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
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

const Label = styled.label`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${(props) => props.theme.colors.text4};
`

const Value = styled.div`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${(props) => props.theme.colors.text1};
`

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 330px 330px 1fr;
  grid-template-rows: 200px 290px;
  grid-tempate-areas: 
    "claimable-rebate referral-code referral-details"
    "your-referral your-referral referral-details"
`

const token = 'QLP'
const Referral: FC = () => {
  const [tab, setTab] = useState('SR')
  return (
    <Wrapper>
      <TwoTabs 
        activeTab={tab}
        onTabChange={setTab}
        tabs={[
          {
            key: 'SR',
            title: 'Sub-Referral (SR)',
          },
          {
            key: 'YR',
            title: 'Your Referral',
          }
        ]}
      />
      {
        tab === 'SR' ? (
          <SubReferral /> 
        ) : (
          <YourReferral  />
        )
      }
    </Wrapper>
  )
};
export default Referral;
