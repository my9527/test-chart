import Box from "@/app/components/Box"
import FlexBox from "@/app/components/FlexBox"
import SimpleText from "@/app/components/SimpleText"
import Image from "next/image"
import styled from "styled-components"
import DotIcon from "@/app/assets/referral/middle.svg";
import TerminalIcon from "@/app/assets/referral/terminal.svg";


const Content = styled(FlexBox)`
  padding: 10px 35px 22px;
  flex-grow: 1;
`

const Level = styled.div`
  background-color: ${props => props.theme.colors.fill3};
  padding: 27px 35px;
  background-image: url('../../../assets/portfolio/vip-level-bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 8px;
`

const StyledBox = styled(Box)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

const Title = styled.div`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.colors.text1};
  border-bottom: 1px solid ${props => props.theme.colors.border1};
  padding-bottom: 8px;
  width: 100%;
`

const ProgressWrapper = styled.div`
  width: 100%;
`

const ProgressBar = styled.div`
  position: relative;
  height: 5px;
  background-color: ${props => props.theme.colors.text4};
  margin-top: 15px;
  margin-bottom: 21px;
`
const Progress = styled.div<{ percent?: string }>`
  width: ${props => props.percent || "0%"};
  height: 100%;
  background-color: ${props => props.theme.colors.primary1};
  position: absolute;
  left: 0;
  top: 0;
`
const ProgressIconWrapper = styled(Image)<{ percent?: string }>`
  position: absolute;
  left: ${props => props.percent || "0%"};
  top: 50%;
  transform: translateY(-50%);
`
const StartIconWrapper = styled(Image)`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
`
const EndIconWrapper = styled(Image)`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateX(50%) translateY(-50%);
`

export const LevelInfo = () => {
  const level = 1
  const progress = "10%"
  return (
    <StyledBox>
      <Level>
        <SimpleText $size="header0" $color="primary1">Your VIP Level</SimpleText>
        <SimpleText $size="header0" $color="primary1">VIP {level}</SimpleText>
      </Level>
      <Content direction="column" justifyContent="space-between">
        <Title>VIP Progress</Title>
        <ProgressWrapper>
          <FlexBox justifyContent="space-between">
            <FlexBox direction="column">
              <SimpleText $size="small" $color="text1">30D volumn: </SimpleText>
              <SimpleText $size="small" $color="text4">123,123,123.00 USDX</SimpleText>
            </FlexBox>
            <FlexBox direction="column">
              <SimpleText $size="small" $color="primary1">VIP {level + 1}</SimpleText>
              <SimpleText $size="small" $color="text4">123,123,123.00 USDX</SimpleText>
            </FlexBox>
          </FlexBox>
          <ProgressBar>
            <Progress percent={progress} />
            <ProgressIconWrapper percent={progress} src={DotIcon} alt="progress" />
            <StartIconWrapper src={DotIcon} alt="progress" />
            <EndIconWrapper src={TerminalIcon} alt="progress" />
          </ProgressBar>
        </ProgressWrapper>
      </Content>
    </StyledBox>
  )
}