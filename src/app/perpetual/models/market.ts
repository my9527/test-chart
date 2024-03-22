
import { atom } from "recoil";

export const recoilMarkets = atom<any>({
    key: "markets",
    default: [],
});


type DepthAndBorrowingRateType = {
    depth: {
        origin: any[],
        buyPriceImpactDepth: string | number;
        sellPriceImpactDepth: string| number;
    },
    borrowingRate: {
        borrowingRateLong: undefined | string | number,
        borrowingRateShort: undefined | string | number,
        borrowingRateLongPerDay: string,
        borrowingRateShortPerDay: string,
    }
}


export const recoilDepthAndBorrowingRate = atom<DepthAndBorrowingRateType>({
    key: 'borrow_rate',
    default: {
        depth: {
            origin: [],
            buyPriceImpactDepth: '0',
            sellPriceImpactDepth: '0'
        },
       borrowingRate: {
        borrowingRateLong: undefined,
        borrowingRateShort: undefined,
        borrowingRateLongPerDay: '0',
        borrowingRateShortPerDay: '0',
       }
    }
})