import Box from "@/app/components/Box";
import FlexBox from "@/app/components/FlexBox";
import SimpleText from "@/app/components/SimpleText";
import Image from "next/image";
import styled from "styled-components";
import ArrowIcon from '@/app/assets/referral/arrow-left.svg'
import { useState } from "react";

const Wrapper = styled(Box)`
  flex-basis: 570px;
  position: relative;
`

const Header = styled.div`
  padding: 20px 0;
  margin: 0 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border1};
  display: flex;
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.colors.text4};
`


const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`

const HoverOverlay = styled(Overlay)`
  background: linear-gradient(90deg, rgba(124, 103, 255, 0.00) 0%, rgba(124, 103, 255, 0.10) 100%);
  padding-right: 10px;
  justify-content: flex-end;
`

const HighlightHoverOverlay = styled(Overlay)`
  background: linear-gradient(90deg, rgba(124, 103, 255, 0.00) 0%, rgba(124, 103, 255, 0.30) 100%);
  padding-right: 10px;
  justify-content: flex-end;
  opacity: 0;
`

const EpochHoverOverlay = styled(Overlay)`
  background: linear-gradient(90deg, rgba(124, 103, 255, 0.10) 0%, rgba(124, 103, 255, 0.00) 100%);
  padding-left: 10px;
`

const Row = styled.div`
  position: relative;

  &:hover {
    ${HighlightHoverOverlay} {
      opacity: 1;
    }
  }

  .col4 {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: flex-end;
  }
`

const RowInner = styled.div`
  margin: 0 20px;
  height: 78px;
  padding-top: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border1};
  display: flex;
  color: ${props => props.theme.colors.text1};
  font-size: ${props => props.theme.fontSize.medium};
`

const WeekEpochList = styled.div`
  .col1 {
    width: 100px;
  }
  .col2 {
    width: 144px;
  }
  .col3 {
    flex-grow: 1;
  }
  .col4 {
    flex-grow: 1;
    text-align: right;
  }
`
const EpochList = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.theme.colors.fill2};
  border-radius: 8px;

  .col1 {
    width: 100px;
  }
  .col2 {
    width: 135px;
  }
  .col3 {
    flex-grow: 1;
  }
  .col4 {
    flex-grow: 1;
    text-align: right;
  }
`

const Content = styled.div`
  position: relative;
  overflow-y: auto;
  height: 257px;
`

const TradingRewardsHistory = () => {
  const [epochListVisibility, setEpochListVisibility] = useState(false)

  const data = [
    {
      epochStartTime: "2021-04-28 06:53",
      epochEndTime: "2021-04-28 06:53",
      volumn: '123,123,123.00',
      earnedExchangeToken: '123,123,123.00',
      earnedChainToken: '123,123,123.00',
    },
    {
      epochStartTime: "2021-04-28 06:53",
      epochEndTime: "2021-04-28 06:53",
      volumn: '123,123,123.00',
      earnedExchangeToken: '123,123,123.00',
      earnedChainToken: '123,123,123.00',
    },
    {
      epochStartTime: "2021-04-28 06:53",
      epochEndTime: "2021-04-28 06:53",
      volumn: '123,123,123.00',
      earnedExchangeToken: '123,123,123.00',
      earnedChainToken: '123,123,123.00',
    }
  ]


  const openEpochList = () => {
    setEpochListVisibility(true)
  }
  
  const hideEpochList = () => {
    setEpochListVisibility(false)
  }
  return (
    <Wrapper>
      <WeekEpochList>
        <Header>
          <div className="col1">Epoch</div>
          <div className="col2">Start/End Date</div>
          <div className="col3">Volume</div>
          <div className="col4">Rewards Earned</div>
        </Header>
        <Content>
          {
            data.map((i, rowInd) => (
              <Row key={rowInd}>
                <RowInner>
                  <div className="col1">
                    <div>Week {data.length - rowInd}</div>
                    { rowInd === 0 && <SimpleText $color="primary1" $size="medium">Current</SimpleText>}
                  </div>
                  <FlexBox className="col2" direction="column">
                    <SimpleText $color="text4" $size="medium">{i.epochStartTime}</SimpleText>
                    <SimpleText $color="primary2" $size="medium">{i.epochEndTime}</SimpleText>
                  </FlexBox>
                  <div className="col3">
                    {i.volumn}
                  </div>
                  <div className="col4">
                    <FlexBox gap="10px">
                      {i.earnedExchangeToken} 
                      <SimpleText $color="text4" $size="medium">dQUTA</SimpleText>
                    </FlexBox>
                    <FlexBox gap="10px">
                      {i.earnedChainToken}
                      <SimpleText $color="text4" $size="medium">dQUTA</SimpleText>
                    </FlexBox>
                  </div>
                </RowInner>
                { rowInd === 0 && (
                  <HoverOverlay onClick={openEpochList}>
                    <Image src={ArrowIcon} alt="" />
                  </HoverOverlay>
                ) }
                <HighlightHoverOverlay onClick={openEpochList}>
                  <Image src={ArrowIcon} alt="" />
                </HighlightHoverOverlay>
              </Row>
            ))
          }
        </Content>
      </WeekEpochList>

      {
        epochListVisibility ? (
          <EpochList>
            <Header>
              <div className="col1">Date</div>
              <div className="col2">Volume</div>
              <div className="col3">Total Volume/Share</div>
              <div className="col4">Rewards Earned</div>
            </Header>
            <Content>
              {
                data.map((i, rowInd) => (
                  <Row key={rowInd}>
                    <RowInner>
                      <SimpleText $color="text4" $size="medium" className="col1">2023.4.2</SimpleText>
                      <div className="col2">
                        {i.volumn}
                      </div>
                      <FlexBox className="col3" direction="column">
                        <SimpleText $color="text1" $size="medium">{i.epochStartTime}</SimpleText>
                        <SimpleText $color="primary1" $size="medium">{i.epochEndTime}</SimpleText>
                      </FlexBox>
                      <div className="col4">
                        <FlexBox gap="10px">
                          {i.earnedExchangeToken} 
                          <SimpleText $color="text4" $size="medium">dQUTA</SimpleText>
                        </FlexBox>
                        <FlexBox gap="10px">
                          {i.earnedChainToken}
                          <SimpleText $color="text4" $size="medium">dQUTA</SimpleText>
                        </FlexBox>
                      </div>
                    </RowInner>
                  </Row>
                ))
              }
              <EpochHoverOverlay onClick={hideEpochList}>
                <Image src={ArrowIcon} alt="" />
              </EpochHoverOverlay>
            </Content>
          </EpochList>
        ) : null
      }
    </Wrapper>
  )
}

export default TradingRewardsHistory