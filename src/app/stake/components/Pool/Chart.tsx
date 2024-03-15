import styled from "styled-components"
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, Text, YAxis } from 'recharts';
import Image from "next/image";
import DotPng from "@/app/assets/stake/dot.png";
import { useTokenPrice } from "../../hooks/useTokenPrice";
import dayjs from "dayjs";

const Title = styled.h2`
  font-size: ${props => props.theme.fontSize.header0};
  color: ${props => props.theme.colors.text4};
`

const Header = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-end;
`

const SubTitle = styled.h2`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.colors.primary1};
`

const Content = styled.div`
  flex-grow: 1;
  position: relative;
`

const TooltipText = styled.div`
  font-size: ${props => props.theme.fontSize.min};
  color: ${props => props.theme.colors.text1};
`

const Light = styled(Image)`
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

const CustomTooltip = (props: any) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    return (
      <TooltipText>{payload[0].value}</TooltipText>
    );
  }

  return null;
};



const token = 'QLP'
export function Chart() {
  const data = useTokenPrice()

  const CustomizedDot = (props: any) => {
    const { cx, cy, index } = props;
  
    if (index === (data.length - 1)) {
      return (
        <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="red" viewBox="0 0 20 20">
          <circle cx="9.52979" cy="9.73096" r="8.5293" fill="white" stroke="#7C67FF" stroke-width="2"/>
        </svg>
      )
    }
  };
  return (
    <>
      <Header>
        <Title>{token} Price</Title>
        <SubTitle>$1.042324 / +2.32%</SubTitle>
      </Header>
      <Content>
        <Light alt="" src={DotPng} />
        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="colorUv" x1="543.424" y1="0.0653076" x2="543.424" y2="282.757" gradientUnits="userSpaceOnUse">
                  <stop offset="0.5" stop-color="rgba(124, 103, 255, 0.5)"/>
                  <stop offset="1" stop-color="rgba(124, 103, 255, 0.5)" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <XAxis
                axisLine={false}
                tickLine={false}
                dataKey="blockTimestamp"
                tick={(e) => {
                  const {
                    payload: { value },
                  } = e;
                  return (
                    <Text {...e} fill="rgba(255,255,255,0.5)" fontSize={10}>
                      {dayjs.unix(value).format('hh:mm A')}
                    </Text>
                  );
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={['auto', 'auto']}
                tick={{ dx: 0, fill: 'rgba(255,255,255,0.45)', fontSize: 14 }}
                // width={10 * 11}
                // domain={['dataMin', 'dataMax']}
              />
              <Tooltip cursor={{ stroke: '#7C67FF' }} content={<CustomTooltip />} />
              <Area dot={<CustomizedDot />} type="linear" strokeWidth={2} dataKey="price" stroke="#7C67FF" fill="url(#colorUv)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </Content>
    </>
  )
}