import { useRecoilValue } from "recoil"
import { recoilDepthAndBorrowingRate } from "../models/market"




export const usePriceImpactDepth = () => {
    const depthAndBorrowingRate = useRecoilValue(recoilDepthAndBorrowingRate);

    return depthAndBorrowingRate.depth;
}