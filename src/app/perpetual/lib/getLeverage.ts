import { filterPrecision } from "@/app/utils/tools";
import BigNumber from "bignumber.js";

export const getLeverage = ({
  size,
  price,
  margin,
  pnl,
  fees,
}: {
  size: string;
  price: string;
  margin: string;
  pnl: string;
  fees: string;
}) => {
  return filterPrecision(
    BigNumber(size)
      .multipliedBy(price)
      .dividedBy(BigNumber(margin).plus(BigNumber(pnl).minus(fees)))
      .toString(),
    2
  );
};
