

// const pnl = getPnl({
//     futureAddress: i.future,
//     entryPrice: i.entryPriceReadable,
//     tickPrice: price,
//     size: i.tokenSize,
//     futureId: i.futureId,
//     futureContract: i.future,
//   });

import { Token } from "@/app/config/tokens";
import BigNumber from "bignumber.js";

type CalcPnlParamsType = {
    isLong: boolean;
    entryPrice: string | number;
    tickPrice: string | number;
    size: string | number;
    // par: string | number;
    borrowFee?: string | number;
    decimal?: number;
    pars: number | string;

}


/**
 * 计算当前仓位的pnl
 * @param params 
 * @returns 
 */
export const calcPnl = (params: CalcPnlParamsType) => {

    const {
        isLong,
        entryPrice,
        tickPrice,
        size,
        // par,
        borrowFee = '0',
        decimal,
        pars,
    } = params;


    if (!entryPrice || !tickPrice || !size) return '0';

    let p = BigNumber(BigNumber(tickPrice).minus(entryPrice).multipliedBy(isLong ? 1 : -1)).multipliedBy(size).multipliedBy(pars);
    if (decimal) {
        return p.plus(borrowFee || '0').toFixed(decimal, BigNumber.ROUND_DOWN);
    } else {
        return p.plus(borrowFee || '0').toString();
    }
}


/**
 * 计算 pnl 百分比
 * @param param0 
 * @returns 
 */
export const calcPnlPercentage = ({ pnl, collateral }: { pnl: number | string; collateral: number | string }) => {
    if (!pnl || !collateral) return '-';
    // 10*(1900-mark)
    return BigNumber(pnl).dividedBy(collateral).multipliedBy(100).toFixed(2, BigNumber.ROUND_DOWN);
};
