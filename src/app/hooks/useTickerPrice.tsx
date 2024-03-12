import { useRecoilValue } from "recoil";
import { recoilIndexPrices } from "@/app/models";
import useCurToken from "@/app/perpetual/hooks/useCurToken";
import { useMemo } from "react";

const useTickerPrice = () => {
  const { curToken } = useCurToken();
  const indexPrices = useRecoilValue(recoilIndexPrices);

  const currentTickerPrice = useMemo(() => {
    if (!curToken.symbolName) return "0";

    return indexPrices[curToken.symbolName]?.price || "0";
  }, [curToken, indexPrices]);

  const ethTickerPrice = useMemo(() => {
    if (!curToken.symbolName) return "0";

    return indexPrices["ETH"]?.price || "0";
  }, [curToken, indexPrices]);

  return {
    currentTickerPrice,
    ethTickerPrice,
  };
};
export default useTickerPrice;
