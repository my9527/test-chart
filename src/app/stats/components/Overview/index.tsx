import styled, { css } from "styled-components"
import Box from "@/app/components/Box"
import Statistics from "./Statistics"
import { Chart } from "@/app/stake/components/Pool/Chart"

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 0;
`
const StyledBox = styled(Box)`
  padding: 20px;
`

const Overview = () => {

  return (
    <Wrapper>
      <Statistics />
      <StyledBox><Chart /></StyledBox>
    </Wrapper>
  )
}

export default Overview