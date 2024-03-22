
import { useMemo } from "react";

  export const usePriceImpactK = (tokenName: string) => {
    return useMemo(() => {
        if(['BTC', 'ETH'].includes(tokenName?.toUpperCase())) {
            return '1000';
        }
        return '100';
    }, [tokenName])
  }