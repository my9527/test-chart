import FlexBox from "@/app/components/FlexBox"
import Image from "next/image"
import styled, { css } from "styled-components"
import CloseEyeIcon from "@/app/assets/portfolio/close-eye.svg"
import OpenEyeIcon from "@/app/assets/portfolio/open-eye.svg"
import DepositIcon from "@/app/assets/portfolio/deposit.svg"
import WithdrawIcon from "@/app/assets/portfolio/withdraw.svg"
import WalletAssets from "./Statistics"
import { CopyBtn } from "@/app/components/CopyBtn"
import { useTheme } from "styled-components"
import { useState } from "react"
import Box from "@/app/components/Box"

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
      <StyledBox $padding="23px 35px">
        aa
      </StyledBox>
      <StyledBox $padding="20px 35px">
        bdd
      </StyledBox>
    </Wrapper>
  )
}

export default Overview