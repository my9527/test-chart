



export type Token = {
    symbolName: string;
    decimal: number;
    tag: string[];
    futureLongId: number;
    futureShortId: number;
    pars: number;
    displayDecimal: number;
    maxProfitRatio: number;
    maxLeverage: number;
    borrowingFeeRatio: number;
    maintainMarginRatio: number;
    fundingFeeRatio: number;
    priceTickSize: number;
    fundingFeeBaseRate: number;
    fundingFeeLinearRate: number;
    maxliquidityLockRatio: number;
    hot?:boolean;
    image?: string;
}





export const tokens: Token[] = [{
    symbolName: 'KAS',
    decimal: 6,
    tag: ['PoW', 'New'],
    futureLongId: 72,
    futureShortId: 72,
    pars: 1,
    displayDecimal: 5,
    maxProfitRatio: 10,
    maxLeverage: 100,
    borrowingFeeRatio: 0.0,
    maintainMarginRatio: 0.005,
    fundingFeeRatio: 0.025,
    priceTickSize: 1e-5,
    fundingFeeBaseRate: 0.0008,
    fundingFeeLinearRate: 0.08,
    maxliquidityLockRatio: 0.3,
}];