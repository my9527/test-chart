import { useRecoilValue } from "recoil"
import { recoilIndexPrices } from "../models"
import { useMemo } from "react";
import { useTokenByFutureId } from "./useTokens";




export const useIndexPrices = () => {

    const prices = useRecoilValue(recoilIndexPrices);

    return prices;
}


export const useIndexPricesById = (futureId: number | string) => {

    const prices = useRecoilValue(recoilIndexPrices);

    const token = useTokenByFutureId(futureId);

    return prices[token.symbolName];
}