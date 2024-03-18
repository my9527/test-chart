import { useRecoilValue } from "recoil";
import { recoilIndexPrices } from "@/app/models";
import useCurToken from "@/app/perpetual/hooks/useCurToken";
import { useMemo } from "react";

const useTickerPrice = () => {
  const { token } = useCurToken();
  const indexPrices = useRecoilValue(recoilIndexPrices);

  const currentTickerPrice = useMemo(() => {
    if (!token.symbolName) return "0";

    return indexPrices[token.symbolName]?.price || "0";
  }, [token, indexPrices]);

  const ethTickerPrice = useMemo(() => {
    if (!token.symbolName) return "0";

    return indexPrices["ETH"]?.price || "0";
  }, [token, indexPrices]);

  return {
    currentTickerPrice,
    ethTickerPrice,
  };
};
export default useTickerPrice;
