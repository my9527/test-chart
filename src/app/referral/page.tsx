"use client";
import { FC, useRef, useState } from "react";
import styled from "styled-components";
import FlexBox from '@/app/components/FlexBox'
import ReferralDetails from "./components/ReferralDetails";
import ReferralTab from "./components/Referral";
import Button from "./components/Button";
import { RebateArea } from "./components/RebateArea";
import { SelectReferralCode } from "./components/SelectReferralCode";


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
  grid-template-columns: 670px 1fr;
  grid-template-rows: 200px 290px;
  grid-template-areas: 
    "rebate-area referral-details"
    "your-referral referral-details";
  gap: 10px;
`

const ReferralLink = styled.input`
  border: 1px solid ${(props) => props.theme.colors.primary2};
  outline: none;
  width: 100%;
  border-radius: 8px;
  height: 64px;
  padding-left: 22px;
  padding-right: 120px;
  background: unset;
  color: ${(props) => props.theme.colors.text1};

  &::placeholder {
    color: ${(props) => props.theme.colors.primary1};
  }
`

const ReferralLinkBox = styled.div`
  position: relative;
  flex-grow: 1;
`

const ReferralLinkWrapper = styled.div`
  display: flex;
  margin: 14px 0 10px;
  gap: 10px;
`

const IconButton = styled.div`
  padding: 0 18px;
  height: 32px;
  display: flex;
  align-items: center;
  border-radius: 12px;
  background: ${(props) => props.theme.colors.fill1};
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.colors.primary3};

    path {
      fill: ${(props) => props.theme.colors.fill1};
    }
  }
`

const Actions = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 5px;
`

const CopyButton = styled.div`
  cursor: pointer;
  line-height: 64px;
  width: 140px;
  text-align: center;
  background: ${(props) => props.theme.colors.fill2};
  border-radius: 8px;
  color: ${(props) => props.theme.colors.text4};

  &:hover {
    color: ${(props) => props.theme.colors.text1};
    background: ${(props) => props.theme.colors.primary3};
  }
`


const Referral: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);
  return (
    <Wrapper>
      <InnerWrapper>
        <Title>Invite More Friends To Earn Fee Rebates</Title>
        <FlexBox gap='40px'>
          <FlexBox gap='10px'>
            <Label>Current referral code: </Label>
            <Value>123456</Value>
          </FlexBox>
          <FlexBox gap='10px'>
            <Label>Rebate ratio split: </Label>
            <Value>10% / 15%</Value>
          </FlexBox>
          <Button onClick={() => setVisible(true)}>Choose another code</Button>
        </FlexBox>
        <ReferralLinkWrapper>
          <ReferralLinkBox>
            <ReferralLink placeholder="Referral Link" />
            <Actions>
              <IconButton>
                <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
                  <path d="M24 2.36772C23.117 2.76969 22.168 3.0404 21.172 3.16243C22.189 2.53794 22.97 1.5484 23.337 0.369155C22.386 0.947498 21.332 1.36792 20.21 1.59454C19.313 0.613208 18.032 0 16.616 0C13.437 0 11.101 3.04143 11.819 6.19873C7.728 5.98851 4.1 3.97867 1.671 0.923913C0.381 3.19319 1.002 6.16181 3.194 7.66509C2.388 7.63843 1.628 7.41181 0.965 7.03343C0.911 9.37244 2.546 11.5607 4.914 12.0478C4.221 12.2406 3.462 12.2857 2.69 12.1339C3.316 14.1397 5.134 15.5988 7.29 15.6399C5.22 17.3041 2.612 18.0476 0 17.7317C2.179 19.1643 4.768 20 7.548 20C16.69 20 21.855 12.0826 21.543 4.98154C22.505 4.26887 23.34 3.37982 24 2.36772Z" fill="#7C67FF" fill-opacity="0.5"/>
                </svg>
              </IconButton>
              <IconButton>
                <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
                  <path d="M9.0288 18.79L9.40165 13.1963L19.6283 4.04528C20.081 3.63534 19.535 3.43698 18.9358 3.79403L6.31236 11.7152L0.852845 9.99607C-0.318954 9.66547 -0.33227 8.85881 1.11916 8.27696L22.3846 0.130983C23.3567 -0.305408 24.2888 0.369015 23.916 1.8501L20.294 18.79C20.041 19.9934 19.3087 20.2843 18.2967 19.7289L12.7839 15.6824L10.134 18.2346C9.82776 18.5388 9.57475 18.79 9.0288 18.79Z" fill="#7C67FF" fill-opacity="0.5"/>
                </svg>
              </IconButton>
            </Actions>
          </ReferralLinkBox>
          <CopyButton>Copy</CopyButton>
        </ReferralLinkWrapper>
        <MainContent ref={ref}>
          <RebateArea />
          <ReferralTab />
          <ReferralDetails />
        </MainContent>
      </InnerWrapper>
      <SelectReferralCode visible={visible} onClose={() => setVisible(false)} />
    </Wrapper>
  )
};
export default Referral;
