"use client";
import styled from "styled-components";
import { useRef, useEffect } from "react";
type Props = {
  prefixWidth: number;
  suffixWidth: number;
  type: string;
};
const Wrapper = styled.div<Props>`
  display: flex;
  align-items: center;
  position: relative;
  .input {
    width: 100%;
    height: 41px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    border-radius: 8px;
    border: ${(props) =>
      `1px solid ${
        props.type === "warn"
          ? props.theme.colors.text5
          : props.theme.colors.border1
      }`};
    background: ${(props) => props.theme.colors.fill2};
    outline-style: none;
    padding-left: ${(props) =>
      props?.prefixWidth ? props?.prefixWidth + 2 + "px" : "8px"};
    padding-right: ${(props) =>
      props?.suffixWidth ? props?.suffixWidth + 2 + "px" : "8px"};
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    &::-webkit-input-placeholder {
      color: ${(props) => props.theme.colors.text4};
      font-size: ${(props) => props.theme.fontSize.small};
    }
    &:-moz-placeholder {
      color: ${(props) => props.theme.colors.text4};
      font-size: ${(props) => props.theme.fontSize.medium};
    }
    &::-moz-placeholder {
      color: ${(props) => props.theme.colors.text4};
      font-size: ${(props) => props.theme.fontSize.medium};
    }
    &:-ms-input-placeholder {
      color: ${(props) => props.theme.colors.text4};
      font-size: ${(props) => props.theme.fontSize.medium};
    }
    &:focus {
      border: ${(props) =>
        `1px solid ${
          props.type === "warn"
            ? props.theme.colors.text5
            : props.theme.colors.primary1
        }`};
    }
  }
  .prefix {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
  }
  .suffix {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
  }
`;

const Input: React.FC<{
  placeholder?: string;
  value?: string | number;
  onChange?: Function;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  className?: string;
  type?: string;
  onBlur?: Function;
  disabled?: boolean;
  maxLength?: number;
}> = ({
  placeholder,
  value,
  onChange,
  prefix,
  suffix,
  className,
  type = "normal",
  onBlur,
  disabled,
  maxLength,
}) => {
  const prefixRef = useRef<HTMLDivElement | null>(null);
  const suffixRef = useRef<HTMLDivElement | null>(null);

  return (
    <Wrapper
      type={type}
      className={className}
      prefixWidth={prefixRef?.current?.clientWidth || 0}
      suffixWidth={suffixRef?.current?.clientWidth || 0}
    >
      {prefix && (
        <div className="prefix" ref={prefixRef}>
          {prefix}
        </div>
      )}
      {disabled ? (
        <div className="input">{value}</div>
      ) : (
        <input
          maxLength={maxLength}
          onBlur={(e) => {
            onBlur && onBlur(e);
          }}
          className="input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange && onChange(e);
          }}
        />
      )}
      {suffix && (
        <div className="suffix" ref={suffixRef}>
          {suffix}
        </div>
      )}
    </Wrapper>
  );
};
export default Input;
