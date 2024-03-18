import styled, { css } from "styled-components";
import { Aligns, Justify } from "../BaseFlex";

const FlexBox = styled.div<{ justify?: Justify, align?: Aligns, gap?: string }>`
  display: flex;

  ${props => props.gap && css`
    gap: ${props.gap};
  `}

  ${props => props.justify && css`
    justify-content: ${props.justify};
  `}

  ${props => props.justify && css`
    align-items: ${props.align};
  `}
`

export default FlexBox;