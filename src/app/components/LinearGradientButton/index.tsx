import styled, { css } from "styled-components";

const Button = styled.div`
  font-size: ${props => props.theme.fontSize.header2};
  color: ${props => props.theme.colors.text1};
  line-height: 40px;
  min-width: 200px;
  padding: 0 14px;
  background: ${props => props.theme.colors.primary3};
  border: none;
  border-radius: 999px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  &:hover {
    background: ${props => props.theme.colors.primary1};
  }
`

export default Button
