import styled from "styled-components";
import { Aligns } from "../BaseFlex";


export const Row = styled.div<{ align?: Aligns, gap?: string }>`
    display: flex;
    flex-direction: row;
    align-items: ${(props) => props.align};
    gap: ${(props) => props.gap ?? 'unset'};
`

Row.defaultProps = {
    align: 'center',
}