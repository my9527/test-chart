import { getHistoryChartData } from "../service";
import { useRequest } from "ahooks";
import BigNumber from "bignumber.js";

const use24hPrice = () => {
  const getData = async ({ symbol }: { symbol: string }) => {
    const res = await getHistoryChartData({
      symbol: symbol,
      interval: "1d",
    });
    const data = res?.data?.data?.[0];

    return {
      high: data?.max_price,
      low: data?.min_price,
      change: BigNumber(data?.close_price)
        .div(data?.open_price)
        .minus(1)
        .multipliedBy(100)
        .toFixed(2, BigNumber.ROUND_DOWN),
    };
  };
  const props = useRequest(getData, {
    manual: true,
  });
  return { ...props };
};
export default use24hPrice;
