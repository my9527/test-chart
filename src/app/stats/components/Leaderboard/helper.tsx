import Image from "next/image"
import RankBg from "@/app/assets/stats/rank.svg"
import styled from "styled-components"
import { RankSvg } from "./RankSvg"
import IncreateTag from "@/app/components/IncreaseTag"


const RankWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
`
const SyledImage = styled(RankSvg)`
  position: absolute;
  left: 0;
  top: 0;
`

const InnerText = styled.span`
  background: ${props => props.theme.colors.fill2};
  z-index: 1;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  text-align: center;
  line-height: 18px;
`

export const data = [
  {
    rank: 1,
    address: '0x12·····1234',
    trades: '1,234',
    volumn: '213,323.42',
    PNL: '+123,123,332.00',
    PNLRatio: '+121.00%'
  },
  {
    rank: 2,
    address: '0x12·····1234',
    trades: '1,234',
    volumn: '213,323.42',
    PNL: '+123,123,332.00',
    PNLRatio: '+121.00%'
  },

  {
    rank: 3,
    address: '0x12·····1234',
    trades: '1,234',
    volumn: '213,323.42',
    PNL: '+123,123,332.00',
    PNLRatio: '+121.00%'
  },
  {
    rank: 4,
    address: '0x12·····1234',
    trades: '1,234',
    volumn: '213,323.42',
    PNL: '+123,123,332.00',
    PNLRatio: '+121.00%'
  }
]

const fillColorArr = ["#FFDA46", "rgba(255, 255, 255, 0.50)", "#FFB547"]
export const columns = [
  {
    dataKey: 'rank',
    title: 'Rank',
    render: (data: {[key: string]: any}) => {
      return (
        <RankWrapper>
          { data.rank < 4 ? <SyledImage fill={fillColorArr[data.rank - 1]} /> : null }
          <InnerText>{data.rank}</InnerText>
        </RankWrapper>
      )
    }
  },
  {
    dataKey: 'address',
    title: 'Address',
  },
  {
    dataKey: 'trades',
    title: 'Trades',
  },
  {
    dataKey: 'volumn',
    title: 'Volumn(USD)',
    secondary: true,
  },
  {
    dataKey: 'PNL',
    title: 'PNL(USD)',
    render: () => {
      return <IncreateTag value={30} />
    }
  },
  {
    dataKey: 'PNLRatio',
    title: 'PNL %',    
    render: () => {
      return <IncreateTag value={-21} format={(val) => `${val}%`} />
    }
  }
]