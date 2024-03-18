import BigNumber from "bignumber.js";




// 净值 - borrowFee ± OIfee
export const getNetvalue = ({
    fees = '0',
    pnl,
    collateral,
  }: {
    fees?: string | number;
    pnl: string | number;
    collateral: string | number;
  }) => {
    return BigNumber(collateral).plus(pnl).plus(fees).toString();
  };