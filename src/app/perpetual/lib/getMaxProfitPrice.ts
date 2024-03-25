import { filterPrecision } from "@/app/utils/tools";
import BigNumber from "bignumber.js";

export const getMaxProfitPrice = ({
  margin,
  maxProfitRatio,
  isLong,
  price,
  size,
  displayDecimal,
}: {
  isLong: boolean;
  margin: string;
  maxProfitRatio: string | number;
  price: string;
  size: string;
  displayDecimal: number;
}) => {
  const maxProfit = BigNumber(maxProfitRatio || "1").multipliedBy(margin);
  if (isLong) {
    return filterPrecision(
      BigNumber(maxProfit)
        .plus(BigNumber(price).multipliedBy(size))
        .dividedBy(size)
        .toString(),
      displayDecimal
    );
  } else {
    const _price = filterPrecision(
      BigNumber(price)
        .multipliedBy(size)
        .minus(maxProfit)
        .dividedBy(size)
        .toString(),
      displayDecimal
    );
    return +_price < 0 ? 0 : _price;
  }
};
