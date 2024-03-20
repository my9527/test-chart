import styled, { css } from "styled-components";


const StyledButton = styled.button<{ padding?: string }>`
  cursor: pointer;
  color: ${props => props.theme.colors.primary1};
  padding: ${props => props.padding || '0 10px'};
  background: ${props => props.theme.colors.border1};
  border-radius: 99px;
  border: 1px solid transparent;
  font-size: ${props => props.theme.fontSize.small};
  line-height: 18px;

  &:hover {
    border-color: ${props => props.theme.colors.primary1};
  }
`;

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  padding?: string;
}

const Button: FCC<IButtonProps> = (props) => {
  return (
    <StyledButton {...props} />
  )
}

export default Button;