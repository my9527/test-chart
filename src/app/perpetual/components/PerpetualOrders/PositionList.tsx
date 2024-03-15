import { Col } from "@/app/components/Col";
import { Row } from "@/app/components/Row";
import { TokenById } from "@/app/components/Token";
import { useIndexPricesById } from "@/app/hooks/useIndexPrices";
import { useTokenByFutureId } from "@/app/hooks/useTokens";
import { PositionType, recoilPositions } from "@/app/models";
import { filterPrecision } from "@/app/utils/tools";
import BigNumber from "bignumber.js";
import { ThHTMLAttributes, useMemo } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { getLiqPrice } from "../../lib/getLiqPrice";
import { useFundingFeeByAddressSide } from "../../hooks/useFundingFee";
import { FutureType } from "@/app/config/common";
import { useBorrowingFeeByAddressSide } from "../../hooks/useBorrowingFee";
import { calcPnl, calcPnlPercentage } from "../../lib/getPnl";





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
        // width: 140px;
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

const Position: FCC<{ pos: PositionType }> = ({ pos }) => {

    const token = useTokenByFutureId(pos.futureId);

    const indexPrices = useIndexPricesById(pos.futureId);

    const fundingFee = useFundingFeeByAddressSide(token.address as string, pos.isLong ? FutureType.LONG : FutureType.SHORT);

    const borrowingFee = useBorrowingFeeByAddressSide(token.address as string, pos.isLong ? FutureType.LONG : FutureType.SHORT);

    // const fundingFee = 

    const fundingfeeReadable = BigNumber(pos.tokenSize)
      .multipliedBy(BigNumber((fundingFee?.fee || '0') / 1e6).minus(pos.entryFundingFeePerTokenReadable))
      .plus(pos.cumulativeFundingFeeReadable)
      .multipliedBy(-1)
      .toString();
    // tokensize*（BorrowingFeePerToken-entryBorrowingFeePerToken）+ cumulativeBorrowingFee
    const borrowingfeeReadable = BigNumber(pos.tokenSize)
      .multipliedBy(BigNumber((borrowingFee?.fee || '0') / 1e6).minus(pos.entryBorrowingFeePerTokenReadable))
      .plus(pos.cumulativeBorrowingFeeReadable)
      .multipliedBy(-1)
      .toString();

    const openingfeeReadable = BigNumber(pos.cumulativeTeamFeeReadable).multipliedBy(-1).toString();

    const feesReadable = BigNumber(fundingfeeReadable).plus(borrowingfeeReadable).plus(openingfeeReadable).toString();

    

    const liqPrice = useMemo(() => {

        // console.log("liqPrice", pos.collateral, feesReadable, pos.entryPriceReadable, pos.tokenSize, pos.isLong, token)

        return getLiqPrice({
            collateral: pos.collateralReadable,
            fees: feesReadable,
            entryPrice: pos.entryPriceReadable,
            size: pos.tokenSize,
            isLong: pos.isLong,
            token: token,
        })
    }, [feesReadable, pos.collateral, pos.entryPriceReadable, pos.tokenSize, pos.isLong, token]);

    const tickPrice = useIndexPricesById(pos.futureId);

    const pnl = useMemo(() => {
        return calcPnl({
            isLong: pos.isLong,
            entryPrice: pos.entryPriceReadable,
            tickPrice: tickPrice?.price,
            size: pos.tokenSize,
            pars: token.pars
        });
    }, [pos.entryPriceReadable, pos.tokenSize, tickPrice?.price, pos.isLong, token.pars]);

    const pnlPercent = useMemo(() => {
        return calcPnlPercentage({ pnl, collateral: pos.collateralReadable })
    }, [pnl, pos.collateralReadable]);

    const hasProfit = useMemo(() => {
        return BigNumber(pnl).lt(0) ? false : true
    }, [pnl]);
    
    return (
        <PositionItemWrapper>
            <td align="left" width={80}>
                <Col gap="6px" align="start" className={`symbol-name ${pos.isLong ? 'long-pos' : 'short-pos'}`}>
                    <div><TokenById futureId={pos.futureId} /></div>
                    <div className={`pos-dir`}>{pos.isLong ? 'Long' : 'Short'}</div>
                </Col>
            </td>
            <td {...PositionTdAttrs} width={140}>
                <div className={`pos-dir ${pos.isLong ? 'pos-long' : 'pos-short'}`}>
                    {pos.tokenSize}
                </div>
            </td>
            <td {...PositionTdAttrs} width={140}>
                {filterPrecision(indexPrices?.price, token.displayDecimal)}
            </td>
            <td {...PositionTdAttrs} width={140}>
                {filterPrecision(pos.entryPriceReadable, token.displayDecimal)}
            </td>
            <td {...PositionTdAttrs} width={140}>
                <Col gap="6px" className={hasProfit ? 'pnl-profit' : 'pnl-loss'} align="flex-start">
                    <div>${filterPrecision(pnl, 2)}</div>
                    <div>{pnlPercent}%</div>
                </Col>
            </td>
            <td {...PositionTdAttrs} width={140}>
                <div className="margin-col">
                    ${filterPrecision(pos.collateralReadable, 2)}
                </div>
            </td>
            <td {...PositionTdAttrs} width={140}>
                {filterPrecision(liqPrice, token.displayDecimal, pos?.isLong ? BigNumber.ROUND_CEIL : BigNumber.ROUND_DOWN)}
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
                                    <th key={h.key} align={h.align ?? 'center'} className="thead-td">
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