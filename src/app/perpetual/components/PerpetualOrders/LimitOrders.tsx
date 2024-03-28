import { Col } from "@/app/components/Col";
import { Row } from "@/app/components/Row";
import { TokenById } from "@/app/components/Token";
import { useTokenByFutureId } from "@/app/hooks/useTokens";
import { recoilFutureLimitOrMarketOrders } from "@/app/models";
import { filterPrecision } from "@/app/utils/tools";
import { FC, ThHTMLAttributes, useCallback, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { FutureType } from "@/app/config/common";
import { formatTime } from "@/app/lib/common";
import { ethers } from "ethers";
import Modal from "@/app/components/Modal";
import { useContractParams } from "@/app/hooks/useContractParams";
import { useAppConfig } from "@/app/hooks/useAppConfig";
import { encodeTx } from "@/app/lib/txTools";
import { useSendTxByDelegate } from "@/app/hooks/useSendTxByDelegate";
import { ActionButton, ActionButtonWrapper } from "./ActionButton";
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
    title: 'Side',
    key: 'side',
}, {
    title: 'Price',
    key: 'price'
}, {
    title: 'Size',
    key: 'size',
}, {
    title: 'Margin',
    key: 'collotral'
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

    .button_wrapper {
        display: inline-block;
        .content {
          border-radius: 999px;
          border: ${(props) => `1px solid ${props.theme.colors.border1}`};
          background: ${(props) => props.theme.colors.fill2};
          font-size: ${(props) => props.theme.fontSize.medium};
          font-style: normal;
          font-weight: 400;
          line-height: 100%;
          display: flex;
          align-items: center;
          cursor: pointer;
        }
      }
      .button {
        .content {
          color: ${(props) => props.theme.colors.text1};
          font-family: Arial;
          gap: 10px;
          padding: 6px 18px;
          height: 32px;
          box-sizing: border-box;
          .plus {
            font-size: 20px;
            color: ${(props) => props.theme.colors.text4};
          }
          &:active {
            border: ${(props) => `1px solid ${props.theme.colors.primary1}`};
            background: ${(props) => props.theme.colors.border1};
            color: ${(props) => props.theme.colors.primary1};
            .plus {
              color: ${(props) => props.theme.colors.primary1};
            }
          }
        }
      }
      .action_buttons {
        .button {
          height: 30px;
    
          padding: 9px 23px;
          display: flex;
          align-items: center;
          border: ${(props) => `1px solid transparent`};
          &:active {
            border-radius: 999px;
            border: ${(props) => `1px solid ${props.theme.colors.primary1}`};
            background: ${(props) => props.theme.colors.border1};
            color: ${(props) => props.theme.colors.primary1};
          }
        }
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


const LimitOrderItem: FCC<{ pos: any, onCancel: AnyFunc }> = ({ pos, onCancel }) => {

    const token = useTokenByFutureId(pos.futureId);

    return (
        <PositionItemWrapper>
            <td align="left" width={140}>
                <Col gap="6px" align="start" className={`symbol-name ${pos.isLong ? 'long-pos' : 'short-pos'}`}>
                    <div><TokenById futureId={pos.futureId} /></div>
                </Col>
            </td>
            <td {...PositionTdAttrs} width={140}>
                <div className={`pos-dir ${pos.isLong ? 'pos-long' : 'pos-short'}`}>
                    <div className={`pos-dir`}>{pos.isLong ? 'Long' : 'Short'}</div>
                </div>
            </td>
            <td {...PositionTdAttrs} width={140}>
                {/* {filterPrecision(pos?.price, token.displayDecimal)} */}
                <div >
                    {
                        filterPrecision(ethers.utils.formatUnits(pos?.price || pos?.executePrice || 0, 6), token.displayDecimal)
                    }
                </div>

            </td>
            <td {...PositionTdAttrs} width={140}>
                <div className={`pos-dir ${pos.isLong ? 'pos-long' : 'pos-short'}`}>
                    {filterPrecision(pos.positionReadable, token.displayDecimal)}
                </div>
            </td>
            <td {...PositionTdAttrs} width={140}>
                <Col gap="6px" className="margin-col" align="flex-start">
                    <div>${filterPrecision(pos?.collateralReadable, 6)}</div>
                </Col>
            </td>
            <td {...PositionTdAttrs} width={200}>
                <div >
                    {
                        formatTime(pos.createTime, 'YYYY-MM-DD HH:mm:ss')
                    }
                </div>
            </td>
            <td {...PositionTdAttrs}>
                <ActionButtonWrapper>
                    <ActionButton onClick={() => onCancel(pos)}>cancel</ActionButton>
                </ActionButtonWrapper>

                {/* <div className="button_wrapper action_buttons">
                    <div className="content">

                        <div className="button" onClick={() => onCancel(pos)}>cancel</div>
                    </div>
                </div> */}
            </td>
        </PositionItemWrapper>
    );
}



export const LimitMarketOrderList: FC = () => {

    const [cancelModalVisible, updateCancelModalVisible] = useState(false);
    const appConfig = useAppConfig();
    // const StopOrderContractParams = useContractParams(appConfig.contract_address.StopOrderImplementationAddress);
    // const MarketOrderContractParams = useContractParams(appConfig.contract_address.MarketOrderImplementationAddress);
    // const LimitOrderContractParams = useContractParams(appConfig.contract_address.LimitOrderImplementationAddress);
    // const UpdateColloteralContractParams = useContractParams(appConfig.contract_address.UpdateCollateralOrderImplementationAddress);
    // const { sendByDelegate } = useSendTxByDelegate()
    const cancelOrder = useCancelOrder();

    const limitOrMarketOrder = useRecoilValue(recoilFutureLimitOrMarketOrders);

    const targetOrder = useRef<any>();

    const handleItemConfirm = useCallback((pos: any) => {
        targetOrder.current = pos;
        updateCancelModalVisible(true);
        console.log("pos--------", pos)
    }, []);


    const handleCancel = useCallback(async () => {
        if (!targetOrder.current) return;

        try{
            await cancelOrder(targetOrder.current);
            updateCancelModalVisible(false);
        } catch(e) {
            console.log("error cancelOrder", e);
        }

        // return;
       

        // let fn;
        // let ct;

        // switch (targetOrder.current?.type) {
        //     case 'futureStopOrders':
        //         fn = 'cancelFutureStopOrder';
        //         ct = StopOrderContractParams;
        //         break;
        //     case 'increaseMarketOrders':
        //         fn = 'cancelIncreaseMarketOrder';
        //         ct = MarketOrderContractParams;
        //         break;
        //     case 'increaseLimitOrders':
        //         fn = 'cancelIncreaseLimitOrder';
        //         ct = LimitOrderContractParams;
        //         break;
        //     case 'decreaseLimitOrders':
        //         fn = 'cancelDecreaseLimitOrder';
        //         ct = LimitOrderContractParams;
        //         break;
        //     case 'decreaseMarketOrders':
        //         fn = 'cancelDecreaseMarketOrder';
        //         ct = MarketOrderContractParams;
        //         break;
        //     default: // cancelUpdateCollateralOrder
        //         fn = 'cancelUpdateCollateralOrder';
        //         ct = UpdateColloteralContractParams;

        // }


        // try {

        //     const encodedData = encodeTx({
        //         abi: ct?.abi,
        //         args: [targetOrder.current?.nonce?.toString()],
        //         functionName: fn,
        //     });

        //     await sendByDelegate({
        //         data: [[ct.address, false, '0', encodedData]]
        //     });

        //     updateCancelModalVisible(false);



        // } catch (e) {
        //     console.log("error cancelOrder", e);
        // }
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
                            limitOrMarketOrder.map((pos: any, index) => {
                                return <LimitOrderItem onCancel={handleItemConfirm} key={`${pos.id}-${pos.isLong ? 'long' : 'short'}-${pos.symbol}`} pos={pos} />
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