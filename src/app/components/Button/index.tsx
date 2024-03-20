import styled, { css } from "styled-components";


interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
  secondary?: boolean;
  borderRadius?: number;
  padding: string;
  bgColor?: string;
  hoverBgColor?: string;
  textColor?: string;
  borderColor?: string;
}

const StyledButton = styled.button<IButtonProps>`
  cursor: pointer;
  color: ${props => props.textColor || props.theme.colors.primary1};
  padding: ${props => props.padding};
  background: ${props => props.bgColor || props.theme.colors.fill3};
  border-radius: ${props => props.borderRadius || 99}px;
  border: 1px solid ${props => props.borderColor || 'transparent'};
  font-size: ${props => props.theme.fontSize.small};
  line-height: 14px;

  ${props => props.hoverBgColor && css`
    &:hover {
      background: ${props.hoverBgColor};
    }
  `}

  /* Adapt the colors based on primary prop */
  ${props => props.primary && css`
    background: ${props => props.theme.colors.fill2};
    &:hover {
      background: ${props => props.theme.colors.primary1};
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



const Button: FCC<IButtonProps> = (props) => {
  return (
    <StyledButton {...props} />
  )
}

export default Button;