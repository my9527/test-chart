import { Col } from "@/app/components/Col";
import { Row } from "@/app/components/Row";
import { TokenById } from "@/app/components/Token";
import { useIndexPricesById } from "@/app/hooks/useIndexPrices";
import { useTokenByFutureId } from "@/app/hooks/useTokens";
import { recoilPositions } from "@/app/models";
import { filterPrecision } from "@/app/utils/tools";
import BigNumber from "bignumber.js";
import { ThHTMLAttributes } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";





const Wrapper = styled(Row)`

height: 100%;
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
        background: ${(props) => props.theme.colors.fill2};
        position: sticky;
        top: 0;
        th{
            padding: 8px;
        }
    }
    tr{
        border-bottom: 1px solid ${(props) => props.theme.colors.border1};
    }
    td {
        width: 140px;
        color: var(--white, #FAFAFA);
        font-family: Arial;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 100%; /* 14px */
        padding: 16px 8px;
    }
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
    title: 'Size',
    key: 'size',
}, {
    title: 'Mark Price',
    key: 'marketPrice',
}, {
    title: 'Entry Price',
    key: 'entryPrice'
}, {
    title: 'Unreallzed PnL(%)',
    key: 'pnl'
}, {
    title: 'Margin',
    key: 'collotral'
}, {
    title: 'Est.liq.Price',
    key: 'liqPrice'
}, {
    title: 'TP/SL',
    key: 'tpsl'
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
`

const Position: FCC<{ pos: any }> = ({ pos }) => {

    console.log("pos--->", pos);

    const token = useTokenByFutureId(pos.futureId);

    const indexPrices = useIndexPricesById(pos.futureId);

    return (
        <PositionItemWrapper>
            <td align="left" width={140}>
                <Col gap="6px" align="start" className={`symbol-name ${pos.isLong ? 'long-pos' : 'short-pos'}`}>
                    <div><TokenById futureId={pos.futureId} /></div>
                    <div className={`pos-dir`}>{pos.isLong ? 'Long' : 'Short'}</div>
                </Col>
            </td>
            <td {...PositionTdAttrs} width={140}>
                {pos.tokenSize}
            </td>
            <td {...PositionTdAttrs} width={140}>
                {filterPrecision(indexPrices?.price, token.displayDecimal)}
            </td>
            <td {...PositionTdAttrs} width={140}>
                {filterPrecision(pos.entryPriceReadable, token.displayDecimal)}
            </td>
            <td {...PositionTdAttrs} width={140}>
                Unreallzed pnl
            </td>
            <td {...PositionTdAttrs} width={140}>
                ${filterPrecision(pos.collateralReadable, 2)}
            </td>
            <td {...PositionTdAttrs} width={140}>
                {/* {filterPrecision(
                    originLiqPrice,
                    token.displayDecimal,
                    pos?.isLong ? BigNumber.ROUND_CEIL : BigNumber.ROUND_DOWN,
                  )} */}
            </td>
            <td {...PositionTdAttrs} width={140}>
                <div>button +</div>
            </td>
            <td {...PositionTdAttrs}>
                <div>
                    <div>close</div>
                    <div>share</div>
                </div>
            </td>
        </PositionItemWrapper>
    );
}



export const PositionList = () => {


    const openPositions = useRecoilValue(recoilPositions);


    return (
        <Wrapper>
            <TableWrapper >
                <table>
                    <thead>
                        <tr>
                            {Headers.map(h => {
                                return (
                                    <th align={h.align ?? 'center'} className="thead-td">
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
                            openPositions.map((pos: any) => {
                                return <Position key={pos.id} pos={pos} />
                            })
                        }
                    </tbody>
                </table>
            </TableWrapper>
        </Wrapper>
    );

}