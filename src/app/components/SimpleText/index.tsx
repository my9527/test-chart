import styled from "styled-components";

const SimpleText = styled.div<{ $size: string, $color: string }>`
  font-size: ${props => props.theme.fontSize[props.$size]};
  color: ${props => props.theme.colors[props.$color]};
`

export default SimpleText;