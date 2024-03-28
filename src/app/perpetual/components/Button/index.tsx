"use client";
import styled from "styled-components";
import { useRef } from "react";

type Props = {
  type: string;
};

const Wrapper = styled.div<Props>`
  flex: 1;
  border-radius: 999px;
  height: 41px;
  box-sizing: border-box;
  background: ${(props) => {
    return props?.type === "long"
      ? props.theme.colors.text2
      : props.theme.colors.text5;
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  .content {
  }
  .title {
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 700;
    line-height: 100%; /* 16px */
    text-transform: uppercase;
  }
`;
const Button: React.FC<{
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  btnText: string;
  className?: string;
  type: string;
  children?: React.ReactNode;
  suffixChildren?: React.ReactNode;
}> = ({ className, btnText, type, children, onClick, suffixChildren }) => {
  return (
    <Wrapper className={className} type={type} onClick={onClick}>
      {children}
      <div className="content">
        <p className="title">{btnText}</p>
        {suffixChildren}
      </div>
    </Wrapper>
  );
};

export default Button;
