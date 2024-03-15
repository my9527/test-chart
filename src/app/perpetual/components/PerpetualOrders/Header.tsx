import { FC, useMemo, useState } from "react";
import styled from "styled-components";

import { Row } from "@/app/components/Row";
import Tabs from "../Tabs";
import { useRecoilValue } from "recoil";
import { recoilPositionNums } from "@/app/models";


enum TabKeys {
    POS = 'Position',
    LIMIT_ORDER = 'Limit Orders',
    TS = 'TP/SL',
    HISTORY = 'History'

}





const Wrapper = styled(Row)`
    
    // padding: 0px 8px;
    width: 100%;

    background: ${(props) => props.theme.colors.fill1};
    color: ${(props) => props.theme.colors.text4};
    position: sticky;
    border-bottom: 1px solid ${(props) => props.theme.colors.border1};
    top: 0;

    .tab {
        color: ${(props) => props.theme.colors.text4}!important;
    }
    .active_tab{
        color: ${(props) => props.theme.colors.textFAFAFA}!important;
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

    const [curTab, updateCurTab] = useState<string>('pos');

    const positions = useRecoilValue(recoilPositionNums);

    const HeaderItems = useMemo(() => {
        return [{
            label: `Position(${positions})`,
            key: 'pos',
        }, {
            label: 'Limit Orders',
            key: 'lo'
        }, {
            label: 'TP/SL',
            key: 'ts'
        }, {
            label: 'History',
            key: 'his'
        }]
    }, [positions]);

    return (
        <Wrapper>
            <Row  style={{ flex: 1}}>
                <Tabs
                    gap={55}
                    list={HeaderItems}
                    handleClick={(item: typeof HeaderItems[0]) => {
                        updateCurTab(item?.key);
                    }}
                />
            </Row>
            {
                (curTab === TabKeys.LIMIT_ORDER || true) && <div className="clear-all pointer">Clear All</div>  
            }
        </Wrapper>
    );
}