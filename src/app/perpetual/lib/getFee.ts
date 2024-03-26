import { filterPrecision } from "@/app/utils/tools";
import BigNumber from "bignumber.js";
import { BasicTradingFeeRatio } from "@/app/config/common";

export const getTradeFee = ({
  size,
  price,
  tradingFeeRatio,
  displayDecimal,
}: {
  size: string;
  tradingFeeRatio: number;
  price: string;
  displayDecimal: number;
}) => {
  return filterPrecision(
    BigNumber(size)
      .multipliedBy(tradingFeeRatio || BasicTradingFeeRatio)
      .div(100)
      .multipliedBy(price)
      .toString(),
    displayDecimal
  );
};

export const getPriceImpactFee = ({
  leverage,
  margin,
  isLong,
  displayDecimal,
  priceImpactK,
  sellPriceImpactDepth,
  buyPriceImpactDepth,
}: {
  leverage: string;
  margin: string;
  isLong: boolean;
  displayDecimal: number;
  priceImpactK: string;
  sellPriceImpactDepth: string;
  buyPriceImpactDepth: string;
}) => {
  return filterPrecision(
    BigNumber(BigNumber(margin).multipliedBy(leverage) || "0")
      .exponentiatedBy(2)
      .div(
        BigNumber(priceImpactK).multipliedBy(
          isLong ? sellPriceImpactDepth : buyPriceImpactDepth
        )
      )
      .multipliedBy(1)
      .toString(),
    displayDecimal
  );
};
