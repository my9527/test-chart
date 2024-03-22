"use client";
import { FC, useState } from "react";
import styled from "styled-components";
import FlexBox from '@/app/components/FlexBox'
import Tabs from "@/app/components/Tabs";
import SRDetails from "./SRDetails";
import Details from "./Details";
import { SearchInput } from "../SearchInput";


const Wrapper = styled.div`
  grid-area: referral-details;
  background: ${(props) => props.theme.colors.fill2};
  border-radius: 8px;
  padding: 0 20px;
  position: relative;
  &:hover {
    box-shadow: ${props => props.theme.colors.fill2Hover}
  }
`
const Title = styled.h2`
  font-size: ${props => props.theme.fontSize.header2};
  color: ${(props) => props.theme.colors.text1};
  padding: 14px 0 8px;
  border-bottom: 1px solid ${(props) => props.theme.colors.border1};
`

const ReferralDetails: FC = () => {
  //是否是二级返佣用户
  const isSecondClassUser = true

  const [tab, setTab] = useState('SR')
  const [searchText, setSearchText] = useState('')
  return (
    <Wrapper>
      {
        isSecondClassUser ? (
          <Tabs
            tab={tab}
            onTabChange={setTab}
            tabs={[
              {
                key: 'SR',
                title: 'SR Details',
                children: <SRDetails />
              },
              {
                key: 'YR',
                title: 'Details',
                children: <Details />
              }
            ]} 
          />
        ) : (
          <>
            <Title>Details</Title>
            <Details />
          </>
        )
      }
      
      <SearchInput value={searchText} onChange={setSearchText} />
    </Wrapper>
  )
};
export default ReferralDetails;
