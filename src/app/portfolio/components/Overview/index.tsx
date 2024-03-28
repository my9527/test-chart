import FlexBox from "@/app/components/FlexBox"
import Image from "next/image"
import styled, { css } from "styled-components"
import CloseEyeIcon from "@/app/assets/portfolio/close-eye.svg"
import OpenEyeIcon from "@/app/assets/portfolio/open-eye.svg"
import DepositIcon from "@/app/assets/portfolio/deposit.svg"
import WithdrawIcon from "@/app/assets/portfolio/withdraw.svg"
import WalletAssets from "./WalletAssets"
import { CopyBtn } from "@/app/components/CopyBtn"
import { useTheme } from "styled-components"
import { useState } from "react"
import Box from "@/app/components/Box"
import SimpleText from "@/app/components/SimpleText"
import { useAccount } from "wagmi"
import { shortenString } from "@/app/lib/shortenString"

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 0;
`

const StyledBox = styled(Box)<{ $padding?: string }>`
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

const Label = styled.div`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.colors.text4};
`

const IconButton = styled.button`
  outline: none;
  background: unset;
  border: none;
  cursor: pointer;
`

const Divider = styled.div`
  height: 60px;
  width: 1px;
  background: ${props => props.theme.colors.border1};
  margin: 0 30px;
`

const Button = styled.button`
  outline: none;
  height: 40px;
  width: 150px;
  border-radius: 999px;
  background: ${props => props.theme.colors.fill3};
  color: ${props => props.theme.colors.text1};
  font-size: ${props => props.theme.fontSize.small};
  border: none;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.primary3};
  }
`

const StyledFlexBox = styled(FlexBox)`
  position: relative;
`

const Address = styled.div`
  position: absolute;
  left: 0;
  top: 120%;
  background: ${props => props.theme.colors.fill2};
  border-radius: 8px;
  color: ${props => props.theme.colors.text4};
  font-size: ${props => props.theme.fontSize.small};
`

const data = {
  address: '0x12······1234',
  equity: '123,123,123.00 USDX',
  marginUsage: '50.00%',
  unrealizedPnl: '-123,123,123.00 USDX'
}

const Overview = () => {
  const account = useAccount()
  const address = account?.address ?? ''
  console.log('xxx account', address)
  const { equity, marginUsage, unrealizedPnl } = data
  const [visibility, setVisibility] = useState(false)
  const theme = useTheme()

  const toggleVisibility = () => {
    setVisibility(!visibility)
  }
  return (
    <Wrapper>
      <StyledBox $padding="23px 35px">
        <FlexBox justifyContent="space-between" alignItems="center">
          <FlexBox alignItems="center">
            <Avatar />
            <FlexBox gap={'2px'} direction="column">
              <SimpleText $size="reguar" $color="reguar">Account</SimpleText>
              <StyledFlexBox gap={'20px'} alignItems="center">
                <Label>{shortenString(address)}</Label>
                <IconButton onClick={toggleVisibility}>
                  <Image src={visibility ? CloseEyeIcon : OpenEyeIcon} alt="hide address" />
                </IconButton>
                <CopyBtn color={theme.colors.primary1} content={address} />
                {visibility && <Address>{address}</Address>}
              </StyledFlexBox>
            </FlexBox>
            <Divider />
            <FlexBox gap={'2px'} direction="column">
              <Label>Equity:</Label>
              <SimpleText $color="primary1" $size="medium">{equity}</SimpleText>
            </FlexBox>
            <Divider />
            <FlexBox gap={'2px'} direction="column">
              <Label>Margin usage:</Label>
              <SimpleText $color="text1" $size="medium">{marginUsage}</SimpleText>
            </FlexBox>
            <Divider />
            <FlexBox gap={'2px'} direction="column">
              <Label>Unrealized PnL:</Label>
              <SimpleText $color="text5" $size="medium">{unrealizedPnl}</SimpleText>
            </FlexBox>
          </FlexBox>
          <FlexBox gap="10px">
            <Button>
              <Image src={DepositIcon} alt="deposit" />
              Deposit
            </Button>
            <Button>
              <Image src={WithdrawIcon} alt="withdraw" />
              Withdraw
            </Button>
          </FlexBox>
        </FlexBox>
      </StyledBox>
      <StyledBox $padding="20px 35px">
        <WalletAssets />
      </StyledBox>
    </Wrapper>
  )
}

export default Overview