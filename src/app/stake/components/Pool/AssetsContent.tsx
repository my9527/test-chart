import styled, { css } from "styled-components"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import { useEpochEndTime } from "../../hooks/useEpochEndTime"
import { useClaimableInfo } from "../../hooks/useClaimableInfo"

const Title = styled.h2`
  font-size: ${props => props.theme.fontSize.header2};
  color: ${props => props.theme.colors.text1};
  margin-bottom: 10px;
`
const FieldFlex = styled.div<{ pr?: number }>`
  display: flex;
  justify-content: space-between;
  ${props => props.pr && css`padding-right: ${props.pr}px;`}
`

const FieldBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const FieldLabel = styled.div`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.colors.text4};
  line-height: 14px;
`

const FieldValue = styled.div`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.colors.text1};
`

const Button = styled.div`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.colors.primary1};
  line-height: 20px;
  padding: 0 14px;
  background: ${props => props.theme.colors.fill3};
  border-radius: 99px;
  min-width: 60px;
  &:hover {
    background: ${props => props.theme.colors.primary1};
    color: ${props => props.theme.colors.text1};
  }
`

const Actions = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  cursor: pointer;
`

const token = 'QLP'
export function AssetsContent() {
  const { epochEndTime } = useEpochEndTime()
  const [countdownStr, setCountdownStr] = useState('')

  const claimableInfo = useClaimableInfo()

  /** `Current Epoch Remaining` countdown */
  useEffect(() => {
    const endTime = dayjs.unix(epochEndTime.timestamp || NaN);
    const isValid = dayjs(endTime).isValid();
    if (!isValid) return;

    const intervalId = setInterval(() => {
      if (isValid) {
        const distance = endTime.diff(dayjs(), 'second');
        if (distance >= 0) {
          const days = Math.floor(distance / (60 * 60 * 24));
          const hours = days * 24 + Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
          const minutes = Math.floor((distance % (60 * 60)) / 60);
          const seconds = Math.floor(distance % 60);

          const h = hours < 10 ? `0${hours}` : hours;
          const m = minutes < 10 ? `0${minutes}` : minutes;
          const s = seconds < 10 ? `0${seconds}` : seconds;

          setCountdownStr(`${h}:${m}:${s}`);
        } else {
          //TODO:
          // !getCombinedSlpPriceAndEpochEndTimeLoading && getCombinedSlpPriceAndEpochEndTimeRun();
        }
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [epochEndTime]);
  return (
    <div>
      <Title>Pending Assets</Title>
      <FieldBox>
        <FieldFlex>
          <FieldLabel>Current Epoch Remaining</FieldLabel>
          <FieldValue>{countdownStr}</FieldValue>
        </FieldFlex>
        <FieldFlex>
          <FieldLabel>{`Bought ${token}`}</FieldLabel>
          <Actions>
            <FieldValue>{claimableInfo?.totalClaimable}</FieldValue>
            <Button>Claim</Button>
          </Actions>
        </FieldFlex>
        <FieldFlex>
          <FieldLabel>Sold USDX</FieldLabel>
          <Actions>
            <FieldValue>{claimableInfo?.totalWithdraw}</FieldValue>
            <Button>Claim</Button>
          </Actions>
        </FieldFlex>
        <FieldFlex pr={80}>
          <FieldLabel>{`Returned ${token}`}</FieldLabel>
          <FieldValue>0</FieldValue>
        </FieldFlex>
      </FieldBox>
    </div>
  )
}