import styled from "styled-components";
import MiddleIcon from "@/app/assets/referral/middle.svg";
import TerminalIcon from "@/app/assets/referral/terminal.svg";
import Image from "next/image";

interface IProgressBarProps {
  total: number;
  active: number;
}

const Wrapper = styled.div`
  background: ${props => props.theme.colors.text4};
  position: relative;
  height: 5px;
  border-radius: 999px;
  margin-top: 25px;
`
const Bar = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 999px;
  background: ${props => props.theme.colors.primary1};
`

const ActiveUserTooltip = styled.div<{ $left: string }>`
  position: absolute;
  left: ${props => props.$left};
  transform: translateX(-50%);
  bottom: 15px;
  color: ${props => props.theme.colors.text1};
  font-size: ${props => props.theme.fontSize.min};
`

const MiddleIconWrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -8px;
`

const MiddleIconTooltip = styled.div`
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  color: ${props => props.theme.colors.text4};
  font-size: ${props => props.theme.fontSize.small};
`

const TerminalIconTooltip = styled.div`
  position: absolute;
  top: 24px;
  right: 0;
  white-space: nowrap;
  color: ${props => props.theme.colors.text4};
  font-size: ${props => props.theme.fontSize.small};
`

const TerminalIconWrapper = styled.div`
  position: absolute;
  right: -12px;
  top: -6px;
`
const PrimaryText = styled.span`
  color: ${props => props.theme.colors.primary1};
  margin-left: 5px;
`
export const ProgressBar = ({ total, active }: IProgressBarProps) => {
  const ration = `${Math.abs(active / total * 100)}%`;
  return (
    <Wrapper>
      <Bar style={{ width: ration }} />
      <ActiveUserTooltip $left={ration}>
        {active} Active Users
      </ActiveUserTooltip>
      <MiddleIconWrapper>
        <Image src={MiddleIcon} alt="middle" />
        <MiddleIconTooltip>Keep Level<PrimaryText>{total / 2} Users</PrimaryText></MiddleIconTooltip>
      </MiddleIconWrapper>
      <TerminalIconWrapper>
        <Image src={TerminalIcon} alt="terminal" />
        <TerminalIconTooltip>Level Up<PrimaryText>{total} Users</PrimaryText></TerminalIconTooltip>
      </TerminalIconWrapper>
    </Wrapper>
  )
}