import styled from "styled-components";

const Button = styled.div<{ minWidth?: number }>`
  color: ${props => props.theme.colors.text1};
  font-size: ${props => props.theme.fontSize.header2};
  line-height: 40px;
  min-width: ${props => props.minWidth || 200}px;
  padding: 0 14px;
  background: ${props => props.theme.colors.primary3};
  text-align: center;
  border-radius: 999px;
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.primary1};
  }
`

export default Button
