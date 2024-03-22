import FlexBox from "@/app/components/FlexBox"
import Image from "next/image"
import styled, { css } from "styled-components"
import CloseEyeIcon from "@/app/assets/portfolio/close-eye.svg"

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Box = styled.div<{ $padding?: string }>`
  background: ${props => props.theme.colors.fill2};
  border-radius: 8px;
  &:hover {
    background: ${props => props.theme.colors.fill2Hover};
  }
  
  ${props => props.$padding && css`
    padding: ${props.$padding};
  `}
`

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  background: ${props => props.theme.colors.primary3};
  border-radius: 50%;
  margin-right: 20px;
`

const AccountTitle = styled.div`
  font-size: ${props => props.theme.fontSize.reguar};
  color: ${props => props.theme.colors.text1};
`

const Label = styled.div`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.colors.text4};
`

const EquityText = styled.div`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.colors.primary1};
`

const Text = styled.div<{ $size: string, $color: string }>`
  font-size: ${props => props.theme.fontSize[props.$size]};
  color: ${props => props.theme.colors[props.$color]};
`

const IconButton = styled.button`
  outline: none;
`

const Divider = styled.div`
  height: 60px;
  width: 1px;
  background: ${props => props.theme.colors.border1};
  margin: 0 30px;
`

const data = {
  address: '0x12······1234',
  equity: '123,123,123.00 USDX',
  marginUsage: '50.00%',
  unrealizedPnl: '-123,123,123.00 USDX'
}
const Overview = () => {
  const { address, equity, marginUsage, unrealizedPnl } = data
  return (
    <Wrapper>
      <Box $padding="23px 35px">
        <FlexBox>
          <Avatar />
          <div>
            <Text $size="reguar" $color="reguar">Account</Text>
            <FlexBox gap={20}>
              <Label>{address}</Label>
              <IconButton>
                <Image src={CloseEyeIcon} alt="hide address" />
              </IconButton>
              <IconButton>
                <Image src={CloseEyeIcon} alt="hide address" />
              </IconButton>
            </FlexBox>
          </div>
          <Divider />
          <div>
            <Label>Equity:</Label>
            <Text $color="primary1" $size="medium">{equity}</Text>
          </div>
          <Divider />
          <div>
            <Label>Margin usage:</Label>
            <Text $color="primary1" $size="medium">{marginUsage}</Text>
          </div>
          <Divider />
          <div>
            <Label>Unrealized PnL:</Label>
            <Text $color="text5" $size="medium">{unrealizedPnl}</Text>
          </div>
        </FlexBox>
      </Box>
      <Box></Box>
    </Wrapper>
  )
}

export default Overview