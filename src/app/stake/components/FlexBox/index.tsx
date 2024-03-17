import styled from "styled-components";

const FlexBox = styled.div<{ justify?: string, align?: string }>`
  display: flex;
  justify-content: ${props => props.justify || "center"};
  align-items: ${props => props.align || "center"};
`

export default FlexBox;