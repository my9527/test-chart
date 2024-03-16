import styled, { css } from "styled-components";


interface IButtonProps {
  primary?: boolean;
  secondary?: boolean;
  borderRadius?: number;
  padding: string;
}

const Button = styled.button<IButtonProps>`
  cursor: pointer;
  color: ${props => props.theme.colors.primary1};
  padding: ${props => props.padding};
  background: ${props => props.theme.colors.fill3};
  border-radius: ${props => props.borderRadius || 99}px;
  border: 1px solid transparent;

  /* Adapt the colors based on primary prop */
  ${props => props.primary && css`
    background-color: ${props => props.theme.colors.fill2};
    &:hover {
      background-color: ${props => props.theme.colors.primary1};
      color: ${props => props.theme.colors.text1};
    }
  `}

  /* Adapt the colors based on secondary prop */
  ${props => props.secondary && css`
    background: ${props => props.theme.colors.fill3};
    &:hover {
      border-color: ${props => props.theme.colors.primary1};
    }
  `}
`;

export default Button;