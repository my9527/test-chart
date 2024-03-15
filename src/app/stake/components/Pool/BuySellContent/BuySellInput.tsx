import { motion } from "framer-motion"
import styled from "styled-components"



const FlexBox = styled.div<{ justify?: string }>`
  display: flex;
  justify-content: ${props => props.justify || "flex-start"};
  align-items: center;
`

const Label = styled.div`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.colors.text4};
  margin-right: 16px;
`

const Value = styled.div`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.colors.text1};
`

const Currency = styled.div`
  font-size: ${props => props.theme.fontSize.header2};
  color: ${props => props.theme.colors.primary1};
`

const Wrapper = styled.div`
  background-color: ${props => props.theme.colors.fill3};
  padding: 10px 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const TextField = styled.input`
  background-color: unset;
  outline: none;
  color: ${props => props.theme.colors.text1};
  border: none;
`

const SecondaryBtn = styled(motion.div)`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.colors.primary1};
  line-height: 20px;
  padding: 0 14px;
  background: ${props => props.theme.colors.fill2};
  border-radius: 99px;
  margin-right: 40px;
  cursor: pointer;
  &:hover {
    background: ${props => props.theme.colors.primary1};
    color: ${props => props.theme.colors.text1};
  }
`

interface IInputProps {
  title: string
  balance: string
  currency: string
  action?: {
    text: string,
    onClick: () => void
  },
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

export function BuySellInput ({ title, balance, currency, action, value = '0', onChange }: IInputProps) {
  return (
    <Wrapper>
      <FlexBox justify="space-between">
        <Label>{title}</Label>
        <FlexBox>
          <Label>Balance</Label>
          <Value>{balance}</Value>
        </FlexBox>
      </FlexBox>
      <FlexBox justify="space-between">
        <TextField value={value} onChange={onChange} />
        <FlexBox>
          { action ? <SecondaryBtn onClick={action.onClick}>{action.text}</SecondaryBtn> : null}
          <Currency>{currency}</Currency>
        </FlexBox>
      </FlexBox>
    </Wrapper>
  )
}