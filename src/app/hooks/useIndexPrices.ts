import { useRecoilValue } from "recoil";
import { recoilIndexPrices } from "../models";
import { useMemo } from "react";
import { useTokenByFutureId, useTokensMap } from "./useTokens";

export const useIndexPrices = () => {
  const prices = useRecoilValue(recoilIndexPrices);

  return prices;
};

export const useIndexPricesById = (futureId: number | string) => {
  const prices = useRecoilValue(recoilIndexPrices);

  console.log("prices: ", prices);

  const token = useTokenByFutureId(futureId);

  return prices[token?.symbolName];
};

/**
 * 根据futureId map
 * @returns
 */
type PriceType = {
  change: string;
  displaySymbol: string;
  price: number;
  priceDecimal: number;
  symbol: string;
};
export const useIndexPricesIdMap = () => {
  const prices = useIndexPrices();
  const tokens = useTokensMap();
  return useMemo(() => {
    let result: Record<string, PriceType> = {};
    for (let i in prices) {
      const id = tokens[i]?.futureLongId;
      result[id] = prices[i];
    }
    return result;
  }, [prices]);
};
