import styled, { keyframes } from "styled-components"
import Image from "next/image";
import DotBg from "@/app/assets/stake/breath-light.png";
import RoundImg from "@/app/assets/stake/round.svg"
import RoundBgGif from "@/app/assets/stake/round-bg.gif"
import AnimateJson from './data.json'
import Lottie from 'lottie-react';

const Wrapper = styled.div`
  position: relative;
`
const breath_light = keyframes`
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
`
const BreathLight = styled(Image)`
  width: 100%;
  height: 100%;
  animation: ${breath_light} 3s ease-in-out infinite;
`

const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  padding: 0 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ScorePanel = styled.div`
  width: 280px;
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 50%;
  position: relative;
  &:hover {
    box-shadow: 0px 0px 30px 0px #7C67FF;
  }
`

const StyledImage = styled(Image)`
  position: absolute;
  left: 0;
  top: 0;
`

const StyledAnimate = styled(Lottie)`
  position: absolute;
  left: 0;
  top: 0;
`

const FlexItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
`

const Label = styled.div`
  color: ${props => props.theme.colors.text4};
  font-size: ${props => props.theme.fontSize.small};
`

const Score = styled.strong`
  color: ${props => props.theme.colors.text1};
  font-size: 24px;
`

const Share = styled.strong`
  color: ${props => props.theme.colors.text1};
  font-size: ${props => props.theme.colors.header1};
`

const SharePanel = styled.div`
  width: 280px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 45px;
  border-radius: 50%;
  position: relative;
`

export function ChartContent() {

  return (
    <Wrapper>
      <BreathLight alt="" src={DotBg} />
      <ChartWrapper>
        <SharePanel>
          <StyledAnimate animationData={AnimateJson} loop={true}/>
          <FlexItem>
            <Label>Your Score</Label>
            <Share>123,123.00</Share>
          </FlexItem>
          <FlexItem>
            <Label>Your Share</Label>
            <Share>1.1234%</Share>
          </FlexItem>
        </SharePanel>
        <ScorePanel>
          <StyledImage src={RoundImg} alt="Total Score Background" />
          <Label>Total Score</Label>
          <Score>123,123.00</Score>
        </ScorePanel>
      </ChartWrapper>
    </Wrapper>
  )
}