import styled from "styled-components"
import { StakeFormContent } from "./StakeFormContent"
import { AssetsContent } from "./AssetsContent"
import { ClaimContent } from "./ClaimContent"
import { ChartContent } from "./ChartContent"

const Wrapper = styled.div`
  padding-top: 20px;
  display: grid;
  grid-template-columns: 700px 1fr;
  grid-template-rows: 210px 210px 200px;
  gap: 10px;
  grid-template-areas: 
    "stake-form claim"
    "stake-form chart"
    "assets chart";
`

const Box = styled.div`
  background-color: ${props => props.theme.colors.fill2};
  border-radius: 8px;
  &:hover {
    box-shadow: 0px 0px 20px 0px rgba(124, 103, 255, 0.25);
  }
`

const StakeForm = styled.div`
  grid-area: stake-form;
  background-color: ${props => props.theme.colors.fill2};
  border-radius: 0 0 8px 8px;
  &:hover {
    box-shadow: 0px 0px 20px 0px rgba(124, 103, 255, 0.25);
  }
`

const Claim = styled(Box)`
  grid-area: claim;
  padding: 35px 0;
  display: flex;
  justify-content: space-evenly;
  align-items: stretch;
`

const Chart = styled(Box)`
  grid-area: chart;
  padding: 12px 16px;
`

const Assets = styled(Box)`
  grid-area: assets;
  padding: 0 35px;
`

function StakingContent () {
  
  return (
    <Wrapper>
      <StakeForm><StakeFormContent /></StakeForm>
      <Claim><ClaimContent /></Claim>
      <Chart><ChartContent /></Chart>
      <Assets><AssetsContent /></Assets>
    </Wrapper>
  )
}

export default StakingContent