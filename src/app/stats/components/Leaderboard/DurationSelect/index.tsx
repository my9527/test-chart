import { useState } from "react"
import styled from "styled-components"
import ArrowIcon from '@/app/assets/stats/arrow.svg'
import Image from "next/image"

const Wrapper = styled.div`
  position: relative;
`

const Toggle = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 0 10px;
  height: 20px;
  background: ${props => props.theme.colors.fill2};
  border-radius: 999px;
  color: ${props => props.theme.colors.text4};
  font-size: ${props => props.theme.fontSize.small};
  border: 1px solid transparent;

  &:hover {
    border-color: ${props => props.theme.colors.primary1};
  }
`

const DropDown = styled.div`
  padding: 5px 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 120%;
  border-radius: 18px;
  background: ${props => props.theme.colors.fill3};
  min-width: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid ${props => props.theme.colors.primary1};
  gap: 9px;
`

const Item = styled.div<{ $active: boolean }>`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.$active ? props.theme.colors.text1 : props.theme.colors.text4};
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.colors.text1};
  }
`

interface DurationSelectProps {
  value: number,
  onChange: (value: number) => void,
  options: { value: number, label: string }[]
}
export const DurationSelect = ({ value, onChange, options }: DurationSelectProps) => {
  const [visible, setVisible] = useState(false)
  const selected = options.find(i => i.value === value)

  const handleChange = (value: number) => () => {
    onChange(value)
    setVisible(false)
  }
  return (
    <Wrapper>
      <Toggle onClick={() => setVisible(v => !v)}>
        {selected?.label}
        <Image src={ArrowIcon} alt="arrow" />
      </Toggle>
      {
        visible ? (
          <DropDown>
            {
              options.map(i => (
                <Item $active={i.value === value} key={i.value} onClick={handleChange(i.value)}>{i.label}</Item>
              ))
            }
          </DropDown>
        ) : null
      }
    </Wrapper>
  )
}