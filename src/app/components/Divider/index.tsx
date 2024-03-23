import styled, { css } from "styled-components";

const Divider = styled.div<{ dir?: 'horizontal' | 'vertical', width?: number, height?: number }>`
  background: ${props => props.theme.colors.border1};
  ${props => props.dir === 'horizontal' ? css`
    width: 100%;
    height: 1px;
  ` : css`
    height: 100%;
    width: 1px;
  `}

  ${props => props.width && css`
    width: ${props.width}px;
    height: 1px;
  `}

  ${props => props.height && css`
    height: ${props.height}px;
    width: 1px;
  `}
`

export default Divider;