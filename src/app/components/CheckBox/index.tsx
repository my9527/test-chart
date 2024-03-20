"use client";
import styled from "styled-components";
import { useState } from "react";

type Props = {
  isChecked: boolean;
};
const Wrapper = styled.div<Props>`
  width: 14px;
  height: 14px;
  border: ${(props) => `1px solid ${props.theme.colors.primary1}`};
  background: ${(props) => {
    return props?.isChecked
      ? "linear-gradient(90deg, #634AFF 0%, #7E73FF 100%)"
      : props.theme.colors.fill2;
  }};
  cursor: pointer;
  &:active {
    border: ${(props) => `1px solid ${props.theme.colors.primary1}`};
  }
`;
const CheckBox: React.FC<{
  checked?: boolean;
  handleClick?: Function;
  className?: string;
}> = ({ checked = false, handleClick, className }) => {
  const [isChecked, setIsChecked] = useState(checked);
  return (
    <Wrapper
      className={className}
      isChecked={isChecked}
      onClick={() => {
        setIsChecked(!isChecked);
        handleClick && handleClick();
      }}
    ></Wrapper>
  );
};
export default CheckBox;
