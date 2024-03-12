import styled from "styled-components";

import { Row } from "../Row";


export const Col = styled(Row)`    
    flex-direction: column;
`

Col.defaultProps = {
    align: 'center',
}