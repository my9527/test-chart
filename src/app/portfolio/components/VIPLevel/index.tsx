import FlexBox from "@/app/components/FlexBox"
import styled from "styled-components"
import { LevelInfo } from "./LevelInfo"
import { Rules } from "./Rules"

const Wrapper = styled(FlexBox)`
  padding: 20px 0;
` 

const VIPLevel = () => {
  return (
    <Wrapper gap="10px" alignItems="stretch">
      <LevelInfo />
      <Rules />
    </Wrapper>
  )
}

export default VIPLevel