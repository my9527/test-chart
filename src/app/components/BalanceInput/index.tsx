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
  position: relative;
  &:hover > div {
    border-color: ${props => props.theme.colors.primary1};
  }
`

const TextField = styled.input`
  background: unset;
  height: 20px;
  outline: none;
  color: ${props => props.theme.colors.text1};
  border: none;
  position: absolute;
  bottom: 10px;
  left: 16px;
  width: 70%;
  &:hover, &:focus + div {
    border-color: ${props => props.theme.colors.primary1};}
  }
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

const DisplayInput = styled.div`
  background-color: ${props => props.theme.colors.fill3};
  padding: 10px 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid transparent;
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
  onChange: (v: string) => void,
}

function BalanceInput ({ title, balance, currency, action, value, onChange }: IInputProps) {

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    
    const numericValue = input.replace(/[^0-9]/g, '');
    //filter non-numeric input
    if (numericValue !== input) {
      event.preventDefault();
    }
    onChange(numericValue);
  }

  return (
    <Wrapper>
      <TextField value={value} onChange={handleInputChange} />
      <DisplayInput>
        <FlexBox justify="space-between">
          <Label>{title}</Label>
          <FlexBox>
            <Label>Balance</Label>
            <Value>{balance}</Value>
          </FlexBox>
        </FlexBox>
        <FlexBox justify="flex-end">
          { action ? <SecondaryBtn onClick={action.onClick}>{action.text}</SecondaryBtn> : null }
          <Currency>{currency}</Currency>
        </FlexBox>
      </DisplayInput>
    </Wrapper>
  )
}

export default BalanceInput