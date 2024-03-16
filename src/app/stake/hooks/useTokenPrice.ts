import { useRequest } from "ahooks";
import { getTokenPriceChartData } from "../service";
import BigNumber from "bignumber.js";
import { useMemo } from "react";

export function useTokenPrice() {
  const { data, loading } = useRequest(getTokenPriceChartData);

  const priceData = useMemo(() => {
    if (!data) return [];
    const res = data?.data?.data || [];
    return res
      ?.map((i: any) => ({
        ...i,
        price: BigNumber(i?.slpPrice).div(1e6).toString(),
      }))
      .reverse();
  }, [data]);

  return priceData
}