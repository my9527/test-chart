import { Col } from "@/app/components/Col";
import { Row } from "@/app/components/Row";
import { TokenById } from "@/app/components/Token";
import { useTokenByFutureId } from "@/app/hooks/useTokens";
import { recoilFutureLimitOrMarketOrders, recoilFutureStopOrders } from "@/app/models";
import { filterPrecision } from "@/app/utils/tools";
import { FC, ThHTMLAttributes, useCallback, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { FutureType } from "@/app/config/common";
import { formatTime } from "@/app/lib/common";
import { ethers } from "ethers";
import { compareAddress } from "@/app/lib/compareAddress";
import { useAppConfig } from "@/app/hooks/useAppConfig";
import { ActionButton, ActionButtonWrapper } from "./ActionButton";
import Modal from "@/app/components/Modal";
import { useCancelOrder } from "../../hooks/useCancelOrder";





const Wrapper = styled(Row)`
width: 100%;
max-height: 100%;
overflow-y: auto;
.table-wrapper{
    height: 100%:
}
table{
    border-spacing: 0;
    width: 100%;
    height: 100%;
    position: relative;
    thead{
        width: 100%;
        background: ${(props) => props.theme.colors.fill1};
        
        position: sticky;
        top: 0;
        th{
            padding: 9px 8px 16px;
        }
    }
    tr{
        cursor: pointer;
    }
    tbody tr:hover{
        background: ${(props) => props.theme.colors.fill2};
    }
    td {
        // width: 140px;
        color: var(--white, #FAFAFA);
        font-family: Arial;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 100%; /* 14px */
        padding: 16px 8px;
        border-top: 0.5px solid ${(props) => props.theme.colors.border1};
        border-bottom: 0.5px solid ${(props) => props.theme.colors.border1};
        border-collapse: collapse;
        text-align: left;

        

    }
    // td + td {
    //     padding-left: 40px;
    //     padding-right: 40px;
    // }
}

.header{
    color: ${(props) => props.theme.colors.text4};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%; /* 14px */
}
`;

const TableWrapper = styled.div`
    height: 100%;
    width: 100%;
`


type HeaderItem = {
    title: string;
    key: string;
    // ThHTMLAttributes<HTMLTableHeaderCellElement>.align
    // align: .align;
} & ThHTMLAttributes<HTMLTableHeaderCellElement>;

const Headers: HeaderItem[] = [{
    title: 'Symbol',
    key: 'symbol',
    align: 'left',
}, {
    title: 'Type',
    key: 'type',
}, {
    title: 'Side',
    key: 'side',
}, {
    title: 'Trigger Price',
    key: 'price'
}, {
    title: 'Size',
    key: 'size',
}, {
    title: 'Order Time',
    key: 'orderTime'
}, {
    title: 'Action',
    key: 'action'
}];




const PositionTdAttrs: ThHTMLAttributes<HTMLTableDataCellElement> = {
    align: 'center',
}

const PositionItemWrapper = styled.tr`

    .symbol-name{
        border-left: 4px solid;
        padding: 0 10px;
    }
    .long-pos{ 
        border-left-color: ${(props) => props.theme.colors.text2};
        .pos-dir{
            color: ${(props) => props.theme.colors.text2};
        }
    }
    .short-pos{
        border-left-color: ${(props) => props.theme.colors.text5};
        .pos-dir{
            color: ${(props) => props.theme.colors.text5};
        }
    }
    .pos-dir{
       

        /* small */
        font-family: Arial;
        font-size: ${(props) => props.theme.fontSize.small};
        font-style: normal;
        font-weight: 400;
        line-height: 120%; /* 14.4px */
    }

    .pos-long {
        color: ${(props) => props.theme.colors.text2};
    }
    .pos-short {   
        color: ${(props) => props.theme.colors.text5};
    }

    .pnl-col {
        font-family: Arial;
        font-size: ${(props) => props.theme.fontSize.medium};
        font-style: normal;
        font-weight: 400;
        line-height: 100%; /* 14px */
    }

    .pnl-profit{
        color: ${(props) => props.theme.colors.text2};
    }
    .pnl-loss{
        
        color: ${(props) => props.theme.colors.text5};
    }

    .margin-col{
        color: ${(props) => props.theme.colors.text3};
        font-family: Arial;
        font-size: ${(props) => props.theme.fontSize.medium};
        font-style: normal;
        font-weight: 400;
        line-height: 100%; /* 14px */
    }
`

const CancelModalContent = styled.div`
// color: var(--Quenta--FFFFFF, var(--text1, #FFF));
color: ${(props) => props.theme.colors.text1};
padding: 12px 0;

/* medium */
font-family: Arial;
font-size: ${(props) => props.theme.fontSize.medium};
font-style: normal;
font-weight: 400;
line-height: 100%; /* 14px */

`

type OrderType = {
    side: FutureType;
    createTime: number;

}

const getSide = (ele: any, isLong: boolean) => {
    // buy
    // short 止盈 止损 限价close ，long限价开仓
    // sell
    // long 止盈 止损 限价close ，short限价开仓

    let side;
    // const isLong = compareAddress(LongContractAddress, ele.future);
    switch (ele?.type) {
        case 'futureStopOrders':
            side = isLong ? 'Sell' : 'Buy';
            break;
        case 'increaseMarketOrders':
            side = isLong ? 'Buy' : 'Sell';
            break;
        case 'increaseLimitOrders':
            side = isLong ? 'Buy' : 'Sell';
            break;
        case 'decreaseLimitOrders':
            side = isLong ? 'Sell' : 'Buy';
            break;
        case 'decreaseMarketOrders':
            side = isLong ? 'Sell' : 'Buy';
            break;
    }

    return side;
};


const StopOrderItem: FCC<{ pos: any, onCancel: AnyFunc }> = ({ pos, onCancel }) => {

    const token = useTokenByFutureId(pos.futureId);
    const appConfig = useAppConfig();
    const isLong = compareAddress(pos.future, appConfig.contract_address.LongAddress);
    // const side = getSide(pos, isLong);
    const isBuy = !pos.isStopLoss;

    console.log("StopOrderItem", pos);

    return (
        <PositionItemWrapper>
            <td align="left" width={140}>
                <Col gap="6px" align="start" className={`symbol-name ${isBuy ? 'long-pos' : 'short-pos'}`}>
                    <div><TokenById futureId={pos.futureId} /></div>
                </Col>
            </td>
            <td {...PositionTdAttrs} width={140}>
                <div className={`pos-dir ${isBuy ? 'pos-long' : 'pos-short'}`}>
                    <div className={`pos-dir`}>{pos.isStopLoss ? 'SL' : 'TP'}</div>
                </div>
            </td>
            <td {...PositionTdAttrs} width={140}>
                <div className={`pos-dir ${isBuy ? 'pos-long' : 'pos-short'}`}>
                    <div className={`pos-dir`}>{getSide(pos, isLong)}</div>
                </div>

            </td>
            <td {...PositionTdAttrs} width={140}>
                <div >
                    {filterPrecision(pos?.triggerPrice, token.displayDecimal)}
                </div>
            </td>
            <td {...PositionTdAttrs} width={140}>
                <div className={`margin-col'}`}>
                    {filterPrecision(pos.positionReadable, token.displayDecimal)}
                </div>
            </td>
            <td {...PositionTdAttrs} width={200}>
                <div>
                    {formatTime(pos.createTime, 'YYYY-MM-DD HH:mm:ss')}
                </div>
            </td>
            <td {...PositionTdAttrs} >
                <ActionButtonWrapper>
                    <ActionButton onClick={() => onCancel(pos)}>close</ActionButton>
                </ActionButtonWrapper>
            </td>
        </PositionItemWrapper>
    );
}



export const StopOrderList: FC = () => {
    const [cancelModalVisible, updateCancelModalVisible] = useState(false);

    const stopOrder = useRecoilValue(recoilFutureStopOrders);
    const cancelOrder = useCancelOrder();

    const targetOrder = useRef<any>();

    const handleItemConfirm = useCallback((pos: any) => {
        targetOrder.current = pos;
        updateCancelModalVisible(true);
    }, []);

    const handleCancel = useCallback(async () => {
        if (!targetOrder.current) return;
        try {
            await cancelOrder(targetOrder.current);
            updateCancelModalVisible(false);

        } catch (e) {
            console.log("error handleCancel stop order", e);
        }

    }, []);

    return (
        <Wrapper>
            <TableWrapper >
                <table>
                    <thead>
                        <tr>
                            {Headers.map(h => {
                                return (
                                    <th key={h.key} align={h.align ?? 'left'} className="thead-td">
                                        <div className="header">
                                            {h.title}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>

                    </thead>
                    <tbody>
                        {
                            stopOrder.map((pos: any, index) => {
                                return <StopOrderItem onCancel={handleItemConfirm} key={`${pos.id}-${pos.isLong ? 'long' : 'short'}-${pos.symbol}`} pos={pos} />
                            })
                        }
                    </tbody>
                </table>
            </TableWrapper>

            <Modal
                title="Cancel"
                visible={cancelModalVisible}
                onClose={() => updateCancelModalVisible(false)}
                onCancel={() => updateCancelModalVisible(false)}
                onConfirm={handleCancel}
            >

                <CancelModalContent className="cancel-tip">Are you sure to cancel</CancelModalContent>
            </Modal>
        </Wrapper>
    );

}