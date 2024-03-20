import styled, { css } from "styled-components";


type TTextFieldProps = {
  placeholder?: string;
  height?: number;
  width?: number;
}

export const TextField = styled.input<TTextFieldProps >`
  width: 100%;
  height: ${props => props.height || 20}px;
  background: ${props => props.theme.colors.fill1};
  border-radius: 8px;
  padding: 0 10px;
  border: 1px solid transparent;
  outline: none;
  color: ${props => props.theme.colors.text1};

  &:hover, &:focus {
    border-color: ${props => props.theme.colors.primary1};
  }

  ${props => props.width && css`
    width: ${props.width}px;
  `}
`
