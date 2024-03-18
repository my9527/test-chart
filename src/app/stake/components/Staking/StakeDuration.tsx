import { useCallback } from "react"
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
  padding: 9px 32.5px;
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
  { label: "1M", value: '30' },
  { label: "3M", value: '90' },
  { label: "6M", value: '180' },
  { label: "1Y", value: '365' },
]

interface IDurationProps {
  value: string
  onChange: (value: string) => void
}
const Duration = ({ value, onChange }: IDurationProps) => {
  const handleQuickSelect = (v: string) => () => {
    onChange && onChange(v)
  }

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
      <FlexBox>
        {
          durationOptions.map((item) => {
            return (
              <Item active={value === item.value} key={item.value} onClick={handleQuickSelect(item.value)}>{item.label}</Item>
            )
          })
        }
      </FlexBox>
      <InputWrapper>
        <Input placeholder="Customize" value={value} onChange={handleInputChange} />
        <DisplayInput>
          <Suffix>{ +value > 1 ? 'Days' : 'Day' }</Suffix>
        </DisplayInput>
      </InputWrapper>
    </Wrapper>
  )
}

export default Duration