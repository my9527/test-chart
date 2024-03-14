import { DefaultRemainCollateralRatio } from "@/app/config/common";
import { Token } from "@/app/config/tokens";
import BigNumber from "bignumber.js";

type GetLiqPriceType = {
    collateral: StringNum;
    fees: StringNum;
    entryPrice: StringNum;
    size: StringNum;
    token: Token;
    isLong: boolean;
}


export const getLiqPrice = ({
    collateral = 0,
    fees = 0,
    entryPrice = 0,
    size,
    token,
    isLong
}: GetLiqPriceType) => {

    if (!size || !token) return '0';

    const par = token.pars;

    let liq = BigNumber(0);
    const feeRatio = BigNumber(token.tradingFeeRatio || 0).div(100).plus(token.maintainMarginRatio || DefaultRemainCollateralRatio).toString();

    const totalFeeRatio = BigNumber(feeRatio).plus(isLong ? -1 : 1);
    const numerator = BigNumber(collateral).plus(fees).plus(BigNumber(isLong ? -1 : 1).multipliedBy(BigNumber(size).multipliedBy(par).multipliedBy(entryPrice)));
    const denominator = BigNumber(size).multipliedBy(par).multipliedBy(totalFeeRatio);
    liq = BigNumber(numerator).div(denominator);

    console.log("get liq:", token.symbolName, liq.toString());

    return liq.lte(0) ? '0' : liq.toString();

}