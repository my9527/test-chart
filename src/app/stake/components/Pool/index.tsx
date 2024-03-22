import styled from "styled-components"
import { CurrentEpochContent } from "./CurrentEpochContent"
import { AssetsContent } from "./AssetsContent"
import { Chart } from "./Chart"
import { BuySellContent } from "./BuySellContent"

const Wrapper = styled.div`
  padding-top: 20px;
  display: grid;
  grid-template-columns: 1fr 510px;
  grid-template-rows: 200px 220px 170px;
  gap: 10px;
  grid-template-areas: 
    "current-epoch buy-sell"
    "price-chart buy-sell"
    "price-chart assets";
`

const Box = styled.div`
  background-color: ${props => props.theme.colors.fill2};
  border-radius: 8px;
  &:hover {
    box-shadow: ${props => props.theme.colors.fill2Hover}
  }
`

const CurrentEpoch = styled(Box)`
  grid-area: current-epoch;
  padding: 26px 28px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const BuySellPanel = styled.div`
  grid-area: buy-sell;
  background-color: ${props => props.theme.colors.fill2};
  border-radius: 0 0 8px 8px;
  &:hover {
    box-shadow: ${props => props.theme.colors.fill2Hover}
  }
`

const PriceChart = styled(Box)`
  grid-area: price-chart;
  padding: 23px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Assets = styled(Box)`
  grid-area: assets;
  padding: 21px 35px;
`

function PoolContent () {
  
  return (
    <Wrapper>
      <CurrentEpoch><CurrentEpochContent /></CurrentEpoch>
      <BuySellPanel><BuySellContent /></BuySellPanel>
      <PriceChart><Chart /></PriceChart>
      <Assets><AssetsContent /></Assets>
    </Wrapper>
  )
}

export default PoolContent