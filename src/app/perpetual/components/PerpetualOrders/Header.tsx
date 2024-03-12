import { FC, useState } from "react";
import styled from "styled-components";

import { Row } from "@/app/components/Row";


enum TabKeys {
    POS = 'Position',
    LIMIT_ORDER = 'Limit Orders',
    TS = 'TP/SL',
    HISTORY = 'History'

}


const HeaderItems = [{
    title: 'Position',
}, {
    title: 'Limit Orders'
}, {
    title: 'TP/SL',
}, {
    title: 'History'
}]


const Wrapper = styled(Row)`
    
    // padding: 0px 8px;

    background: ${(props) => props.theme.colors.fill1};
    color: ${(props) => props.theme.colors.text4};
    

    .order-header{

        cursor: pointer;
        color: ${(props) => props.theme.colors.textFAFAFA};
        font-family: Arial;
        font-size: ${(props) => props.theme.fontSize.medium};
        font-style: normal;
        font-weight: 400;
        line-height: 100%; /* 14px */
        padding: 14px 8px 12px;


        &.active{
            border-bottom: 2px solid ${(props) => props.theme.colors.border1};
            color: ${(props) => props.theme.colors.textFAFAFA}
        }
    }

    .clear-all{
        color: ${(props) => props.theme.colors.text4};
        font-family: Arial;
        font-size: ${(props) => props.theme.fontSize.header3};
        font-style: normal;
        font-weight: 400;
        line-height: 100%; /* 14px */
        margin-right: 14px;
    }



`;


export const OrderHeader:FC = () => {

    const [curTab, updateCurTab] = useState<string>(HeaderItems[0].title);


    return (
        <Wrapper>
            <Row gap="55px" style={{ flex: 1}}>
            {
                HeaderItems.map((item) => {
                    return <div key={item.title} className={`order-header ${item.title === curTab ? 'active' : ''}`}>{item.title}</div>
                })
            }
            </Row>
            {
                (curTab === TabKeys.LIMIT_ORDER || true) && <div className="clear-all pointer">Clear All</div>  
            }
        </Wrapper>
    );
}