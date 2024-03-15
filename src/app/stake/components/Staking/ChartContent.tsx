import styled from "styled-components"
import Image from "next/image";
import DotBg from "@/app/assets/stake/dot.png";


const Content = styled.div`
  flex-grow: 1;
  position: relative;
`

const BreathLight = styled(Image)`
  width: 100%;
  height: 100%;
  animation: breath_light 3s ease-in-out infinite;
  @keyframes breath_light {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }
`

const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
`

export function ChartContent() {

  return (
    <>
      <Content>
        <BreathLight alt="" src={DotBg} />
        <ChartWrapper>
          TODO
        </ChartWrapper>
      </Content>
    </>
  )
}