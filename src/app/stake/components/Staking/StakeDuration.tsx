import { useCallback, useState } from "react"
import styled from "styled-components"

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const FlexBox = styled.div`
  display: flex;
  gap: 10px;
`
const Item = styled.div<{ active: boolean }>`
  line-height: 32px;
  padding: 0 26px;
  background: ${props => props.active ? props.theme.colors.primary2 : props.theme.colors.fill3 };
  border-radius: 30px;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text4};
  cursor: pointer;
  border: ${props => `1px solid ${ props.active ? props.theme.colors.primary : 'transparent' }` };
`

const InputWrapper = styled.div`
  position: relative;
`


const Input = styled.input`
  outline: none;
  border: none;
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: calc(100% - 70px);
  background: unset;
  color: ${props => props.theme.colors.text1};
`

const DisplayInput = styled.div`
  display: flex;
  justify-content: flex-end;
  border: 1px solid transparent;
  height: 32px;
  background: ${props => props.theme.colors.fill3 };
  border-radius: 30px;
  align-items: center;
  padding-right: 20px;
  ${Input}:focus + && {
    border-color: ${ props => props.theme.colors.primary1 };
  };
  transition: border-color 0.2s ease-in-out;
`

const Suffix = styled.span`
  font-size: ${props => props.theme.fontSize.min};
  color: ${props => props.theme.colors.text4};
`

const durationOptions = [
  { label: "30D", value: '30' },
  { label: "90D", value: '90' },
  { label: "180D", value: '180' },
  { label: "360D", value: '360' },
]

interface IDurationProps {
  value: string
  onChange: (value: string) => void
}

const minCustomDuration = 30
const maxCustomDuration = 360

const Duration = ({ value, onChange }: IDurationProps) => {
  const [customDuration, setCustomDuration] = useState('')
  const [quickSelect, setQuickSelect] = useState('')

  const handleQuickSelect = (v: string) => () => {
    setQuickSelect(v)
    onChange && onChange(v)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setQuickSelect('')
    const numericValue = input.replace(/[^0-9]/g, '');
    //filter non-numeric input
    if (numericValue !== input) {
      event.preventDefault();
    }
    setCustomDuration((Math.min(maxCustomDuration, +numericValue)).toString());
  }

  const handleInputBlur = () => {
    onChange && onChange(`${Math.max(minCustomDuration, +customDuration)}`);
  }

  return (
    <Wrapper>
      <FlexBox>
        {
          durationOptions.map((item) => {
            return (
              <Item active={item.value === quickSelect} key={item.value} onClick={handleQuickSelect(item.value)}>{item.label}</Item>
            )
          })
        }
      </FlexBox>
      <InputWrapper>
        <Input placeholder="Customize" value={customDuration} onBlur={handleInputBlur} onChange={handleInputChange} />
        <DisplayInput>
          <Suffix>{ +value > 1 ? 'Days' : 'Day' }</Suffix>
        </DisplayInput>
      </InputWrapper>
    </Wrapper>
  )
}

export default Duration