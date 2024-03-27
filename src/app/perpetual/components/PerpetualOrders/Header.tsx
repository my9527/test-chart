import { FC, useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import { Row } from "@/app/components/Row";
import Tabs from "../Tabs";
import { useRecoilValue } from "recoil";
import { recoilOrdersLen, recoilPositionNums, recoilPositions } from "@/app/models";
import Modal from "@/app/components/Modal";
import { encodeTx } from "@/app/lib/txTools";
import { useContractParams } from "@/app/hooks/useContractParams";
import { useAppConfig } from "@/app/hooks/useAppConfig";
import { Token } from "@/app/config/tokens";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { useIndexPrices } from "@/app/hooks/useIndexPrices";
import { compareAddress } from "@/app/lib/compareAddress";
import dayjs from "dayjs";
import { useTokensIdMap } from "@/app/hooks/useTokens";
import { useSendTxByDelegate } from "@/app/hooks/useSendTxByDelegate";
import { FutureType } from "@/app/config/common";
import { CloseAllModal } from "./CloseAllModal";








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

const ModalContent = styled.div`

padding: 10px 0;
// color: var(--Quenta--FFFFFF, var(--text1, #FFF));
color: ${(props) => props.theme.colors.text1};
font-size: ${(props) => props.theme.fontSize.medium};
/* medium */
font-family: Arial;
// font-size: 14px;
font-style: normal;
font-weight: 400;
line-height: 100%; /* 14px */

`


export const OrderHeader:FC<{ switchListType: (nextType: string) => any }> = ({ switchListType }) => {

    const [curTab, updateCurTab] = useState<string>('pos');

    const [visible, updateVisible] = useState(false);

    const { position, limit, stop, history } = useRecoilValue(recoilOrdersLen);

    const HeaderItems = useMemo(() => {
        return [{
            label: `Position${position ? `(${position})` : ''}`,
            key: 'pos',
        }, {
            label: `Limit Orders${limit ? `(${limit})` : ''}`,
            key: 'lo'
        }, {
            label: `TP/SL${stop ? `(${stop})` : ''}`,
            key: 'ts'
        }, {
            label: 'History',
            key: 'his'
        }]
    }, [position, limit, stop]);

    const onCancel = useCallback(() => {
        updateVisible(false);
    }, []);

    const onClose = useCallback(() => {
        updateVisible(false);
    }, []);

    return (
        <Wrapper>
            <Row  style={{ flex: 1}}>
                <Tabs
                    gap={55}
                    list={HeaderItems}
                    handleClick={(item: typeof HeaderItems[0]) => {
                        switchListType(item.key);
                        updateCurTab(item?.key);
                    }}
                />
            </Row>
            {
                (curTab === 'pos') && <div className="clear-all pointer" onClick={() => updateVisible(true)}>Clear All</div>  
            }
            {
                visible && <CloseAllModal visible={visible} onCancel={onCancel} onConfirm={onClose} />
            }
        </Wrapper>
    );
}