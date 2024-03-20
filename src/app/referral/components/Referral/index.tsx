"use client";
import { FC, useState } from "react";
import styled from "styled-components";
import FlexBox from '@/app/components/FlexBox'
import { TwoTabs } from "@/app/components/TwoTabs";
import YourReferral from "./YourReferral";
import SubReferral from "./SubReferral";
import { Sidebar } from "../Sidebar";
import { RankDetail } from "./RankDetail";


const Wrapper = styled.div`
  grid-area: your-referral;
  background: ${(props) => props.theme.colors.fill2};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  position: relative;
  &:hover {
    box-shadow: 0px 0px 20px 0px rgba(124, 103, 255, 0.25);
  }
`


const Referral: FC = () => {
  const [tab, setTab] = useState('SR')

  // ranking detail visibility
  const [visible, setVisible] = useState(false)
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
          <YourReferral onClickRankDetail={() => setVisible(true)} />
        )
      }
      <RankDetail
        visible={visible}
        onHide={() => setVisible(false)}
      />
    </Wrapper>
  )
};
export default Referral;
