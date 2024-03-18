import styled from "styled-components";


export type Aligns = 'normal' | 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'self-start' | 'self-end';
export type Justify = 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'left' | 'right' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch' | 'revert' | 'revert-layer';


export const BaseFlex = styled.div<{ align: Aligns, justify?: Justify }>`
    display: flex;
    width: 100%;
    // justify: ${(props) => props.align}
`;

