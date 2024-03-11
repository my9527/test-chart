import styled from "styled-components";


export type Aligns = 'normal' | 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'self-start' | 'self-end';
export type Justify = 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'left' | 'right'


export const BaseFlex = styled.div<{ align: Aligns }>`
    display: flex;
    justify: ${(props) => props.align}
`;

