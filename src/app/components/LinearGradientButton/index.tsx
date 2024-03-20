import styled from "styled-components";

const StyledButton = styled.button<TProps>`
  color: ${props => props.theme.colors.text1};
  font-size: ${props => props.theme.fontSize.header2};
  line-height: ${props => props.height || 40}px;
  height: ${props => props.height || 40}px;
  min-width: ${props => props.minWidth || 200}px;
  padding: 0 14px;
  background: ${props => props.theme.colors.primary3};
  text-align: center;
  border-radius: 999px;
  cursor: pointer;
  outline: none;
  border: none;

  &:hover {
    background: ${props => props.theme.colors.primary1};
  }
`

interface TProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  minWidth?: number, 
  height?: number
}
const Button: FCC<TProps> = (props) => {
  return (
    <StyledButton {...props} />
  )
}

export default Button
