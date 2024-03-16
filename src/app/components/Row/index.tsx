import styled from "styled-components";
import { Aligns, BaseFlex } from "../BaseFlex";


export const Row = styled(BaseFlex)<{ align?: Aligns, gap?: string }>`
    display: flex;
    flex-direction: row;
    align-items: ${(props) => props.align};
    gap: ${(props) => props.gap ?? 'unset'};
    justify-content:${(props) => props.justify ?? 'unset'};
    width: 100%;
`

Row.defaultProps = {
    align: 'center',
    justify: 'flex-start',
}