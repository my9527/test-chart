import BigNumber from "bignumber.js";
import { BasicTradingFeeRatio, CHAINS_ID } from "./common";




export type Token = {
    symbolName: string;
    decimal: number;
    tag: string[];
    futureLongId: number;
    futureShortId: number;
    pars: number;
    displayDecimal: number;
    maxProfitRatio: number;
    minLeverage?: number;
    maxLeverage: number;
    borrowingFeeRatio: number;
    maintainMarginRatio: number;
    fundingFeeRatio: number;
    priceTickSize: number;
    fundingFeeBaseRate: number;
    fundingFeeLinearRate: number;
    maxliquidityLockRatio: number;
    hot?: boolean;
    image?: string;
    needCalPriceImpactByUni?: boolean;
    address?: string;
    tradingFeeRatio?: number | string;
    contractSize?: number;
    minimalOpenSize?: number;
    
    perpConfig?: {
      longToken: string;
      shortToken: string;
      minimalOpenSize:  string;
      priceTickSize: number | string;
      contractSize: number | string;
      leverage: string;
    }
}


const extendToken = (token_: Token): Token => {

  const {
    tradingFeeRatio = BasicTradingFeeRatio,
    borrowingFeeRatio = 0, // 0%
    fundingFeeRatio = 0.025, // 0.025% 12.7 废弃
    maintainMarginRatio,
    contractSize = 1,
    minimalOpenSize = 10,
    fundingFeeBaseRate = 0.0008,
    fundingFeeLinearRate = 0.08,
    maxliquidityLockRatio = 0.3, // 30%
    pars,
    priceTickSize,
    minLeverage = 1,
    maxLeverage = 100,

  } = token_;


  return {
    ...token_,
    tradingFeeRatio,
    borrowingFeeRatio,
    fundingFeeRatio,
    maintainMarginRatio,
    contractSize: pars || contractSize,
    minimalOpenSize,
    fundingFeeBaseRate,
    fundingFeeLinearRate,
    maxliquidityLockRatio,
    perpConfig: {
      longToken: 'USDX',
      shortToken: 'USDX',
      minimalOpenSize: `${minimalOpenSize}USDX`,
      priceTickSize: priceTickSize || '0.001',
      contractSize: pars || contractSize,
      leverage: `${minLeverage}-${maxLeverage}x`,
    },
  }
}





// 基础配置，不直接使用
const baseTokens: Record<string, Token[]> = {
    [CHAINS_ID.zkfair]: [
        {
          "symbolName": "AAVE",
          "decimal": 6,
          "tag": [
            "Defi",
            "RWA"
          ],
          "futureLongId": 1,
          "futureShortId": 1,
          "pars": 0.01,
          "displayDecimal": 2,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.01,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "ADA",
          "decimal": 6,
          "tag": [
            "Public Chain"
          ],
          "futureLongId": 2,
          "futureShortId": 2,
          "pars": 1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "APE",
          "decimal": 6,
          "tag": [
            "Metaverse",
            "NFT"
          ],
          "futureLongId": 3,
          "futureShortId": 3,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "ARB",
          "decimal": 6,
          "tag": [
            "Layer2",
            "ARB Eco.",
            "Hot"
          ],
          "futureLongId": 4,
          "futureShortId": 4,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.5
        },
        {
          "symbolName": "ATOM",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "Cross Chain"
          ],
          "futureLongId": 5,
          "futureShortId": 5,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "AVAX",
          "decimal": 6,
          "tag": [
            "Public Chain"
          ],
          "futureLongId": 6,
          "futureShortId": 6,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "AXS",
          "decimal": 6,
          "tag": [
            "Metaverse",
            "GameFi"
          ],
          "futureLongId": 7,
          "futureShortId": 7,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "BNB",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "Option Token"
          ],
          "futureLongId": 8,
          "futureShortId": 8,
          "pars": 0.01,
          "displayDecimal": 2,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.01,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "BTC",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "PoW",
            "Hot"
          ],
          "futureLongId": 9,
          "futureShortId": 9,
          "pars": 0.0001,
          "displayDecimal": 2,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.01,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 1
        },
        {
          "symbolName": "COMP",
          "decimal": 6,
          "tag": [
            "Defi",
            "RWA"
          ],
          "futureLongId": 10,
          "futureShortId": 10,
          "pars": 0.01,
          "displayDecimal": 2,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.01,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "CRV",
          "decimal": 6,
          "tag": [
            "Defi"
          ],
          "futureLongId": 11,
          "futureShortId": 11,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "DOGE",
          "decimal": 6,
          "tag": [
            "Meme",
            "PoW"
          ],
          "futureLongId": 12,
          "futureShortId": 12,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "DOT",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "Web3.0"
          ],
          "futureLongId": 13,
          "futureShortId": 13,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "ETH",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "Web3.0",
            "Hot"
          ],
          "futureLongId": 14,
          "futureShortId": 14,
          "pars": 0.001,
          "displayDecimal": 2,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.01,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 1
        },
        {
          "symbolName": "FTM",
          "decimal": 6,
          "tag": [
            "Public Chain"
          ],
          "futureLongId": 15,
          "futureShortId": 15,
          "pars": 1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "GMX",
          "decimal": 6,
          "tag": [
            "Layer2",
            "ARB Eco."
          ],
          "futureLongId": 16,
          "futureShortId": 16,
          "pars": 0.01,
          "displayDecimal": 2,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.01,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "LINK",
          "decimal": 6,
          "tag": [
            "DeFi",
            "Oracle"
          ],
          "futureLongId": 17,
          "futureShortId": 17,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "MATIC",
          "decimal": 6,
          "tag": [
            "Layer2"
          ],
          "futureLongId": 18,
          "futureShortId": 18,
          "pars": 1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "MKR",
          "decimal": 6,
          "tag": [
            "Defi",
            "RWA"
          ],
          "futureLongId": 19,
          "futureShortId": 19,
          "pars": 0.001,
          "displayDecimal": 1,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.1,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "NEAR",
          "decimal": 6,
          "tag": [
            "Layer2",
            "Public Chain"
          ],
          "futureLongId": 20,
          "futureShortId": 20,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "OP",
          "decimal": 6,
          "tag": [
            "Layer2"
          ],
          "futureLongId": 21,
          "futureShortId": 21,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "RDNT",
          "decimal": 6,
          "tag": [
            "Defi"
          ],
          "futureLongId": 22,
          "futureShortId": 22,
          "pars": 1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 20,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.1
        },
        {
          "symbolName": "SNX",
          "decimal": 6,
          "tag": [
            "Defi",
            "RWA"
          ],
          "futureLongId": 23,
          "futureShortId": 23,
          "pars": 1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "SOL",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "Hot"
          ],
          "futureLongId": 24,
          "futureShortId": 24,
          "pars": 0.01,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "UNI",
          "decimal": 6,
          "tag": [
            "Defi",
            "Option Token"
          ],
          "futureLongId": 25,
          "futureShortId": 25,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "XRP",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "Pay"
          ],
          "futureLongId": 26,
          "futureShortId": 26,
          "pars": 1,
          "displayDecimal": 5,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.5
        },
        {
          "symbolName": "TIA",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "New"
          ],
          "futureLongId": 27,
          "futureShortId": 27,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 5,
          "maxLeverage": 20,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "ORDI",
          "decimal": 6,
          "tag": [
            "BRC-20",
            "BTC.Eco",
            "New"
          ],
          "futureLongId": 28,
          "futureShortId": 28,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 5,
          "maxLeverage": 20,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "BEAM",
          "decimal": 6,
          "tag": [
            "GameFi",
            "New"
          ],
          "futureLongId": 29,
          "futureShortId": 29,
          "pars": 100,
          "displayDecimal": 6,
          "maxProfitRatio": 5,
          "maxLeverage": 20,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.000001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "BLUR",
          "decimal": 6,
          "tag": [
            "NFT",
            "New"
          ],
          "futureLongId": 30,
          "futureShortId": 30,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "1MSATS",
          "decimal": 6,
          "tag": [
            "BRC-20",
            "New"
          ],
          "futureLongId": 31,
          "futureShortId": 31,
          "pars": 1,
          "displayDecimal": 6,
          "maxProfitRatio": 5,
          "maxLeverage": 5,
          "borrowingFeeRatio": 0.02,
          "maintainMarginRatio": 0.02,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.000001,
          "fundingFeeBaseRate": 0.0016,
          "fundingFeeLinearRate": 0.16,
          "maxliquidityLockRatio": 0.1
        },
        {
          "symbolName": "1MRATS",
          "decimal": 6,
          "tag": [
            "BRC-20",
            "Meme",
            "New"
          ],
          "futureLongId": 32,
          "futureShortId": 32,
          "pars": 0.01,
          "displayDecimal": 6,
          "maxProfitRatio": 5,
          "maxLeverage": 5,
          "borrowingFeeRatio": 0.02,
          "maintainMarginRatio": 0.02,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.000001,
          "fundingFeeBaseRate": 0.0016,
          "fundingFeeLinearRate": 0.16,
          "maxliquidityLockRatio": 0.08
        },
        {
          "symbolName": "USTC",
          "decimal": 6,
          "tag": [
            "Stable Coin",
            "New"
          ],
          "futureLongId": 33,
          "futureShortId": 33,
          "pars": 1,
          "displayDecimal": 6,
          "maxProfitRatio": 5,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.000001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "FLIP",
          "decimal": 6,
          "tag": [
            "Defi",
            "New"
          ],
          "futureLongId": 34,
          "futureShortId": 34,
          "pars": 0.1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 5,
          "borrowingFeeRatio": 0.02,
          "maintainMarginRatio": 0.02,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0016,
          "fundingFeeLinearRate": 0.16,
          "maxliquidityLockRatio": 0.08
        },
        {
          "symbolName": "PYTH",
          "decimal": 6,
          "tag": [
            "Defi",
            "New"
          ],
          "futureLongId": 35,
          "futureShortId": 35,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 5,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "VRTX",
          "decimal": 6,
          "tag": [
            "Arbitrum Eco.",
            "New"
          ],
          "futureLongId": 36,
          "futureShortId": 36,
          "pars": 1,
          "displayDecimal": 6,
          "maxProfitRatio": 10,
          "maxLeverage": 5,
          "borrowingFeeRatio": 0.02,
          "maintainMarginRatio": 0.02,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.000001,
          "fundingFeeBaseRate": 0.0016,
          "fundingFeeLinearRate": 0.16,
          "maxliquidityLockRatio": 0.08
        },
        {
          "symbolName": "1000LUNC",
          "decimal": 6,
          "tag": [
            "Defi",
            "New"
          ],
          "futureLongId": 37,
          "futureShortId": 37,
          "pars": 1,
          "displayDecimal": 5,
          "maxProfitRatio": 5,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "FTT",
          "decimal": 6,
          "tag": [
            "Option Token",
            "New"
          ],
          "futureLongId": 38,
          "futureShortId": 38,
          "pars": 0.1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 20,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.02,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.1
        },
        {
          "symbolName": "TOKEN",
          "decimal": 6,
          "tag": [
            "Meme",
            "New"
          ],
          "futureLongId": 39,
          "futureShortId": 39,
          "pars": 1,
          "displayDecimal": 5,
          "maxProfitRatio": 5,
          "maxLeverage": 5,
          "borrowingFeeRatio": 0.02,
          "maintainMarginRatio": 0.02,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0016,
          "fundingFeeLinearRate": 0.16,
          "maxliquidityLockRatio": 0.1
        },
        {
          "symbolName": "RUNE",
          "decimal": 6,
          "tag": [
            "Defi",
            "BTC.Eco",
            "New"
          ],
          "futureLongId": 40,
          "futureShortId": 40,
          "pars": 0.1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "STX",
          "decimal": 6,
          "tag": [
            "BTC.Eco",
            "New"
          ],
          "futureLongId": 41,
          "futureShortId": 41,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "BIGTIME",
          "decimal": 6,
          "tag": [
            "GameFi",
            "New"
          ],
          "futureLongId": 42,
          "futureShortId": 42,
          "pars": 1,
          "displayDecimal": 5,
          "maxProfitRatio": 10,
          "maxLeverage": 5,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "1MBONK",
          "decimal": 6,
          "tag": [
            "Meme",
            "New"
          ],
          "futureLongId": 43,
          "futureShortId": 43,
          "pars": 0.1,
          "displayDecimal": 4,
          "maxProfitRatio": 5,
          "maxLeverage": 5,
          "borrowingFeeRatio": 0.02,
          "maintainMarginRatio": 0.02,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0016,
          "fundingFeeLinearRate": 0.16,
          "maxliquidityLockRatio": 0.1
        },
        {
          "symbolName": "JTO",
          "decimal": 6,
          "tag": [
            "LSD",
            "New"
          ],
          "futureLongId": 44,
          "futureShortId": 44,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "INJ",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "New"
          ],
          "futureLongId": 45,
          "futureShortId": 45,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "ACE",
          "decimal": 6,
          "tag": [
            "GameFi",
            "Web3.0",
            "New"
          ],
          "futureLongId": 46,
          "futureShortId": 46,
          "pars": 0.1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "WLD",
          "decimal": 6,
          "tag": [
            "Web3.0",
            "New"
          ],
          "futureLongId": 47,
          "futureShortId": 47,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "ICP",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "Web3.0",
            "New"
          ],
          "futureLongId": 48,
          "futureShortId": 48,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "SEI",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "New"
          ],
          "futureLongId": 49,
          "futureShortId": 49,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "SUI",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "New"
          ],
          "futureLongId": 50,
          "futureShortId": 50,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "APT",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "New"
          ],
          "futureLongId": 51,
          "futureShortId": 51,
          "pars": 0.1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "CAKE",
          "decimal": 6,
          "tag": [
            "BSC",
            "New"
          ],
          "futureLongId": 52,
          "futureShortId": 52,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "MOVR",
          "decimal": 6,
          "tag": [
            "Dot eco.",
            "New"
          ],
          "futureLongId": 53,
          "futureShortId": 53,
          "pars": 0.01,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "TRX",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "New"
          ],
          "futureLongId": 54,
          "futureShortId": 54,
          "pars": 1,
          "displayDecimal": 5,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "ENS",
          "decimal": 6,
          "tag": [
            "DID",
            "NFT",
            "New"
          ],
          "futureLongId": 55,
          "futureShortId": 55,
          "pars": 0.01,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "GMT",
          "decimal": 6,
          "tag": [
            "GameFi",
            "Web3.0",
            "New"
          ],
          "futureLongId": 56,
          "futureShortId": 56,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "PEOPLE",
          "decimal": 6,
          "tag": [
            "Meme",
            "New"
          ],
          "futureLongId": 57,
          "futureShortId": 57,
          "pars": 10,
          "displayDecimal": 5,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "MAGIC",
          "decimal": 6,
          "tag": [
            "GameFi",
            "ARB Eco.",
            "New"
          ],
          "futureLongId": 58,
          "futureShortId": 58,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "ZKF",
          "decimal": 6,
          "tag": [
            "Layer 2",
            "New"
          ],
          "futureLongId": 59,
          "futureShortId": 59,
          "pars": 10,
          "displayDecimal": 6,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.000001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "XAI",
          "decimal": 6,
          "tag": [
            "Layer 3",
            "GameFi",
            "New"
          ],
          "futureLongId": 60,
          "futureShortId": 60,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "MANTA",
          "decimal": 6,
          "tag": [
            "Layer 2",
            "New"
          ],
          "futureLongId": 61,
          "futureShortId": 61,
          "pars": 1,
          "displayDecimal": 5,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "LDO",
          "decimal": 6,
          "tag": [
            "LSD",
            "DeFi",
            "New"
          ],
          "futureLongId": 62,
          "futureShortId": 62,
          "pars": 1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "SSV",
          "decimal": 6,
          "tag": [
            "LSD",
            "New"
          ],
          "futureLongId": 63,
          "futureShortId": 63,
          "pars": 0.01,
          "displayDecimal": 2,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.01,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "ALT",
          "decimal": 6,
          "tag": [
            "RaaS",
            "LSD",
            "New"
          ],
          "futureLongId": 64,
          "futureShortId": 64,
          "pars": 0.1,
          "displayDecimal": 5,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "API3",
          "decimal": 6,
          "tag": [
            "Defi",
            "Oracle",
            "New"
          ],
          "futureLongId": 65,
          "futureShortId": 65,
          "pars": 0.1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "UMA",
          "decimal": 6,
          "tag": [
            "RWA",
            "Oracle",
            "New"
          ],
          "futureLongId": 66,
          "futureShortId": 66,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "JUP",
          "decimal": 6,
          "tag": [
            "DeFi",
            "Solana Eco.",
            "New"
          ],
          "futureLongId": 67,
          "futureShortId": 67,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "ZETA",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "New"
          ],
          "futureLongId": 68,
          "futureShortId": 68,
          "pars": 0.1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "RON",
          "decimal": 6,
          "tag": [
            "DeFi",
            "New"
          ],
          "futureLongId": 69,
          "futureShortId": 69,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "PIXEL",
          "decimal": 6,
          "tag": [
            "GameFi",
            "New"
          ],
          "futureLongId": 70,
          "futureShortId": 70,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "STRK",
          "decimal": 6,
          "tag": [
            "Layer2",
            "New"
          ],
          "futureLongId": 71,
          "futureShortId": 71,
          "pars": 1,
          "displayDecimal": 2,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.01,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "KAS",
          "decimal": 6,
          "tag": [
            "PoW",
            "New"
          ],
          "futureLongId": 72,
          "futureShortId": 72,
          "pars": 1,
          "displayDecimal": 5,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "CKB",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "PoW",
            "New"
          ],
          "futureLongId": 73,
          "futureShortId": 73,
          "pars": 1,
          "displayDecimal": 6,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.000001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "RNDR",
          "decimal": 6,
          "tag": [
            "VR",
            "Depin",
            "New"
          ],
          "futureLongId": 74,
          "futureShortId": 74,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "IOTX",
          "decimal": 6,
          "tag": [
            "Depin",
            "New"
          ],
          "futureLongId": 75,
          "futureShortId": 75,
          "pars": 1,
          "displayDecimal": 5,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "1000PEPE",
          "decimal": 6,
          "tag": [
            "Meme",
            "New"
          ],
          "futureLongId": 76,
          "futureShortId": 76,
          "pars": 10,
          "displayDecimal": 5,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "1000FLOKI",
          "decimal": 6,
          "tag": [
            "Meme",
            "New"
          ],
          "futureLongId": 77,
          "futureShortId": 77,
          "pars": 1,
          "displayDecimal": 5,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "WIF",
          "decimal": 6,
          "tag": [
            "Meme",
            "New"
          ],
          "futureLongId": 78,
          "futureShortId": 78,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        }
      ],
    [CHAINS_ID.zkfairtest]: [
        {
          "symbolName": "AAVE",
          "decimal": 6,
          "tag": [
            "Defi",
            "RWA"
          ],
          "futureLongId": 1,
          "futureShortId": 1,
          "pars": 0.01,
          "displayDecimal": 2,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.01,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "ADA",
          "decimal": 6,
          "tag": [
            "Public Chain"
          ],
          "futureLongId": 2,
          "futureShortId": 2,
          "pars": 1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "APE",
          "decimal": 6,
          "tag": [
            "Metaverse",
            "NFT"
          ],
          "futureLongId": 3,
          "futureShortId": 3,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "ARB",
          "decimal": 6,
          "tag": [
            "Layer2",
            "ARB Eco.",
            "Hot"
          ],
          "futureLongId": 4,
          "futureShortId": 4,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.5
        },
        {
          "symbolName": "ATOM",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "Cross Chain"
          ],
          "futureLongId": 5,
          "futureShortId": 5,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "AVAX",
          "decimal": 6,
          "tag": [
            "Public Chain"
          ],
          "futureLongId": 6,
          "futureShortId": 6,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "AXS",
          "decimal": 6,
          "tag": [
            "Metaverse",
            "GameFi"
          ],
          "futureLongId": 7,
          "futureShortId": 7,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "BNB",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "Option Token"
          ],
          "futureLongId": 8,
          "futureShortId": 8,
          "pars": 0.01,
          "displayDecimal": 2,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.01,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "COMP",
          "decimal": 6,
          "tag": [
            "Defi",
            "RWA"
          ],
          "futureLongId": 10,
          "futureShortId": 10,
          "pars": 0.01,
          "displayDecimal": 2,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.01,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "CRV",
          "decimal": 6,
          "tag": [
            "Defi"
          ],
          "futureLongId": 11,
          "futureShortId": 11,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "DOGE",
          "decimal": 6,
          "tag": [
            "Meme",
            "PoW"
          ],
          "futureLongId": 12,
          "futureShortId": 12,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "DOT",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "Web3.0"
          ],
          "futureLongId": 13,
          "futureShortId": 13,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "FTM",
          "decimal": 6,
          "tag": [
            "Public Chain"
          ],
          "futureLongId": 15,
          "futureShortId": 15,
          "pars": 1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "GMX",
          "decimal": 6,
          "tag": [
            "Layer2",
            "ARB Eco."
          ],
          "futureLongId": 16,
          "futureShortId": 16,
          "pars": 0.01,
          "displayDecimal": 2,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.01,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "LINK",
          "decimal": 6,
          "tag": [
            "DeFi",
            "Oracle"
          ],
          "futureLongId": 17,
          "futureShortId": 17,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "MATIC",
          "decimal": 6,
          "tag": [
            "Layer2"
          ],
          "futureLongId": 18,
          "futureShortId": 18,
          "pars": 1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "MKR",
          "decimal": 6,
          "tag": [
            "Defi",
            "RWA"
          ],
          "futureLongId": 19,
          "futureShortId": 19,
          "pars": 0.001,
          "displayDecimal": 1,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.1,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "NEAR",
          "decimal": 6,
          "tag": [
            "Layer2",
            "Public Chain"
          ],
          "futureLongId": 20,
          "futureShortId": 20,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "OP",
          "decimal": 6,
          "tag": [
            "Layer2"
          ],
          "futureLongId": 21,
          "futureShortId": 21,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "RDNT",
          "decimal": 6,
          "tag": [
            "Defi"
          ],
          "futureLongId": 22,
          "futureShortId": 22,
          "pars": 1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 20,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.1
        },
        {
          "symbolName": "SNX",
          "decimal": 6,
          "tag": [
            "Defi",
            "RWA"
          ],
          "futureLongId": 23,
          "futureShortId": 23,
          "pars": 1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "SOL",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "Hot"
          ],
          "futureLongId": 24,
          "futureShortId": 24,
          "pars": 0.01,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "UNI",
          "decimal": 6,
          "tag": [
            "Defi",
            "Option Token"
          ],
          "futureLongId": 25,
          "futureShortId": 25,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "XRP",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "Pay"
          ],
          "futureLongId": 26,
          "futureShortId": 26,
          "pars": 1,
          "displayDecimal": 5,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.5
        },
        {
          "symbolName": "TIA",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "New"
          ],
          "futureLongId": 30,
          "futureShortId": 30,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 5,
          "maxLeverage": 20,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "ORDI",
          "decimal": 6,
          "tag": [
            "BRC-20",
            "BTC.Eco",
            "New"
          ],
          "futureLongId": 31,
          "futureShortId": 31,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 5,
          "maxLeverage": 20,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "BEAM",
          "decimal": 6,
          "tag": [
            "GameFi",
            "New"
          ],
          "futureLongId": 32,
          "futureShortId": 32,
          "pars": 100,
          "displayDecimal": 6,
          "maxProfitRatio": 5,
          "maxLeverage": 20,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.000001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "BLUR",
          "decimal": 6,
          "tag": [
            "NFT",
            "New"
          ],
          "futureLongId": 35,
          "futureShortId": 35,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "1MSATS",
          "decimal": 6,
          "tag": [
            "BRC-20",
            "New"
          ],
          "futureLongId": 36,
          "futureShortId": 36,
          "pars": 1,
          "displayDecimal": 6,
          "maxProfitRatio": 5,
          "maxLeverage": 5,
          "borrowingFeeRatio": 0.02,
          "maintainMarginRatio": 0.02,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.000001,
          "fundingFeeBaseRate": 0.0016,
          "fundingFeeLinearRate": 0.16,
          "maxliquidityLockRatio": 0.1
        },
        {
          "symbolName": "1MRATS",
          "decimal": 6,
          "tag": [
            "BRC-20",
            "Meme",
            "New"
          ],
          "futureLongId": 37,
          "futureShortId": 37,
          "pars": 0.01,
          "displayDecimal": 6,
          "maxProfitRatio": 5,
          "maxLeverage": 5,
          "borrowingFeeRatio": 0.02,
          "maintainMarginRatio": 0.02,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.000001,
          "fundingFeeBaseRate": 0.0016,
          "fundingFeeLinearRate": 0.16,
          "maxliquidityLockRatio": 0.08
        },
        {
          "symbolName": "USTC",
          "decimal": 6,
          "tag": [
            "Stable Coin",
            "New"
          ],
          "futureLongId": 38,
          "futureShortId": 38,
          "pars": 1,
          "displayDecimal": 6,
          "maxProfitRatio": 5,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.000001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "FLIP",
          "decimal": 6,
          "tag": [
            "Defi",
            "New"
          ],
          "futureLongId": 39,
          "futureShortId": 39,
          "pars": 0.1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 5,
          "borrowingFeeRatio": 0.02,
          "maintainMarginRatio": 0.02,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0016,
          "fundingFeeLinearRate": 0.16,
          "maxliquidityLockRatio": 0.08
        },
        {
          "symbolName": "PYTH",
          "decimal": 6,
          "tag": [
            "Defi",
            "New"
          ],
          "futureLongId": 40,
          "futureShortId": 40,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 5,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "VRTX",
          "decimal": 6,
          "tag": [
            "Arbitrum Eco.",
            "New"
          ],
          "futureLongId": 41,
          "futureShortId": 41,
          "pars": 1,
          "displayDecimal": 6,
          "maxProfitRatio": 10,
          "maxLeverage": 5,
          "borrowingFeeRatio": 0.02,
          "maintainMarginRatio": 0.02,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.000001,
          "fundingFeeBaseRate": 0.0016,
          "fundingFeeLinearRate": 0.16,
          "maxliquidityLockRatio": 0.08
        },
        {
          "symbolName": "1000LUNC",
          "decimal": 6,
          "tag": [
            "Defi",
            "New"
          ],
          "futureLongId": 42,
          "futureShortId": 42,
          "pars": 1,
          "displayDecimal": 5,
          "maxProfitRatio": 5,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "FTT",
          "decimal": 6,
          "tag": [
            "Option Token",
            "New"
          ],
          "futureLongId": 43,
          "futureShortId": 43,
          "pars": 0.1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 20,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.02,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.1
        },
        {
          "symbolName": "TOKEN",
          "decimal": 6,
          "tag": [
            "Meme",
            "New"
          ],
          "futureLongId": 44,
          "futureShortId": 44,
          "pars": 1,
          "displayDecimal": 5,
          "maxProfitRatio": 5,
          "maxLeverage": 5,
          "borrowingFeeRatio": 0.02,
          "maintainMarginRatio": 0.02,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0016,
          "fundingFeeLinearRate": 0.16,
          "maxliquidityLockRatio": 0.1
        },
        {
          "symbolName": "RUNE",
          "decimal": 6,
          "tag": [
            "Defi",
            "BTC.Eco",
            "New"
          ],
          "futureLongId": 45,
          "futureShortId": 45,
          "pars": 0.1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "STX",
          "decimal": 6,
          "tag": [
            "BTC.Eco",
            "New"
          ],
          "futureLongId": 46,
          "futureShortId": 46,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "BIGTIME",
          "decimal": 6,
          "tag": [
            "GameFi",
            "New"
          ],
          "futureLongId": 47,
          "futureShortId": 47,
          "pars": 1,
          "displayDecimal": 5,
          "maxProfitRatio": 10,
          "maxLeverage": 5,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "1MBONK",
          "decimal": 6,
          "tag": [
            "Meme",
            "New"
          ],
          "futureLongId": 48,
          "futureShortId": 48,
          "pars": 0.1,
          "displayDecimal": 4,
          "maxProfitRatio": 5,
          "maxLeverage": 5,
          "borrowingFeeRatio": 0.02,
          "maintainMarginRatio": 0.02,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0016,
          "fundingFeeLinearRate": 0.16,
          "maxliquidityLockRatio": 0.1
        },
        {
          "symbolName": "JTO",
          "decimal": 6,
          "tag": [
            "LSD",
            "New"
          ],
          "futureLongId": 49,
          "futureShortId": 49,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "INJ",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "New"
          ],
          "futureLongId": 50,
          "futureShortId": 50,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "ACE",
          "decimal": 6,
          "tag": [
            "GameFi",
            "Web3.0",
            "New"
          ],
          "futureLongId": 51,
          "futureShortId": 51,
          "pars": 0.1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "WLD",
          "decimal": 6,
          "tag": [
            "Web3.0",
            "New"
          ],
          "futureLongId": 52,
          "futureShortId": 52,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "ICP",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "Web3.0",
            "New"
          ],
          "futureLongId": 53,
          "futureShortId": 53,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "SEI",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "New"
          ],
          "futureLongId": 54,
          "futureShortId": 54,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "SUI",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "New"
          ],
          "futureLongId": 55,
          "futureShortId": 55,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "APT",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "New"
          ],
          "futureLongId": 56,
          "futureShortId": 56,
          "pars": 0.1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "CAKE",
          "decimal": 6,
          "tag": [
            "BSC",
            "New"
          ],
          "futureLongId": 57,
          "futureShortId": 57,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "MOVR",
          "decimal": 6,
          "tag": [
            "Dot eco.",
            "New"
          ],
          "futureLongId": 58,
          "futureShortId": 58,
          "pars": 0.01,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "TRX",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "New"
          ],
          "futureLongId": 59,
          "futureShortId": 59,
          "pars": 1,
          "displayDecimal": 5,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "ENS",
          "decimal": 6,
          "tag": [
            "DID",
            "NFT",
            "New"
          ],
          "futureLongId": 60,
          "futureShortId": 60,
          "pars": 0.01,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "GMT",
          "decimal": 6,
          "tag": [
            "GameFi",
            "Web3.0",
            "New"
          ],
          "futureLongId": 61,
          "futureShortId": 61,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "PEOPLE",
          "decimal": 6,
          "tag": [
            "Meme",
            "New"
          ],
          "futureLongId": 62,
          "futureShortId": 62,
          "pars": 10,
          "displayDecimal": 5,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "MAGIC",
          "decimal": 6,
          "tag": [
            "GameFi",
            "ARB Eco.",
            "New"
          ],
          "futureLongId": 63,
          "futureShortId": 63,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "ZKF",
          "decimal": 6,
          "tag": [
            "Layer 2",
            "New"
          ],
          "futureLongId": 64,
          "futureShortId": 64,
          "pars": 10,
          "displayDecimal": 6,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.000001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "XAI",
          "decimal": 6,
          "tag": [
            "Layer 3",
            "GameFi",
            "New"
          ],
          "futureLongId": 65,
          "futureShortId": 65,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "MANTA",
          "decimal": 6,
          "tag": [
            "Layer 2",
            "New"
          ],
          "futureLongId": 66,
          "futureShortId": 66,
          "pars": 1,
          "displayDecimal": 5,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "LDO",
          "decimal": 6,
          "tag": [
            "LSD",
            "DeFi",
            "New"
          ],
          "futureLongId": 67,
          "futureShortId": 67,
          "pars": 1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "SSV",
          "decimal": 6,
          "tag": [
            "LSD",
            "New"
          ],
          "futureLongId": 68,
          "futureShortId": 68,
          "pars": 0.01,
          "displayDecimal": 2,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.01,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "ALT",
          "decimal": 6,
          "tag": [
            "RaaS",
            "LSD",
            "New"
          ],
          "futureLongId": 69,
          "futureShortId": 69,
          "pars": 0.1,
          "displayDecimal": 5,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "API3",
          "decimal": 6,
          "tag": [
            "Defi",
            "Oracle",
            "New"
          ],
          "futureLongId": 70,
          "futureShortId": 70,
          "pars": 0.1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "UMA",
          "decimal": 6,
          "tag": [
            "RWA",
            "Oracle",
            "New"
          ],
          "futureLongId": 71,
          "futureShortId": 71,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "JUP",
          "decimal": 6,
          "tag": [
            "DeFi",
            "Solana Eco.",
            "New"
          ],
          "futureLongId": 72,
          "futureShortId": 72,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "ZETA",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "New"
          ],
          "futureLongId": 73,
          "futureShortId": 73,
          "pars": 0.1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "RON",
          "decimal": 6,
          "tag": [
            "DeFi",
            "New"
          ],
          "futureLongId": 74,
          "futureShortId": 74,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "PIXEL",
          "decimal": 6,
          "tag": [
            "GameFi",
            "New"
          ],
          "futureLongId": 75,
          "futureShortId": 75,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "STRK",
          "decimal": 6,
          "tag": [
            "Layer2",
            "New"
          ],
          "futureLongId": 76,
          "futureShortId": 76,
          "pars": 1,
          "displayDecimal": 2,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.01,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "KAS",
          "decimal": 6,
          "tag": [
            "PoW",
            "New"
          ],
          "futureLongId": 77,
          "futureShortId": 77,
          "pars": 1,
          "displayDecimal": 5,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "CKB",
          "decimal": 6,
          "tag": [
            "Public Chain",
            "PoW",
            "New"
          ],
          "futureLongId": 78,
          "futureShortId": 78,
          "pars": 1,
          "displayDecimal": 6,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.000001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "RNDR",
          "decimal": 6,
          "tag": [
            "VR",
            "Depin",
            "New"
          ],
          "futureLongId": 79,
          "futureShortId": 79,
          "pars": 0.1,
          "displayDecimal": 3,
          "maxProfitRatio": 10,
          "maxLeverage": 100,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.3
        },
        {
          "symbolName": "IOTX",
          "decimal": 6,
          "tag": [
            "Depin",
            "New"
          ],
          "futureLongId": 80,
          "futureShortId": 80,
          "pars": 1,
          "displayDecimal": 5,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "1000PEPE",
          "decimal": 6,
          "tag": [
            "Meme",
            "New"
          ],
          "futureLongId": 81,
          "futureShortId": 81,
          "pars": 10,
          "displayDecimal": 5,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "1000FLOKI",
          "decimal": 6,
          "tag": [
            "Meme",
            "New"
          ],
          "futureLongId": 82,
          "futureShortId": 82,
          "pars": 1,
          "displayDecimal": 5,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.00001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        },
        {
          "symbolName": "WIF",
          "decimal": 6,
          "tag": [
            "Meme",
            "New"
          ],
          "futureLongId": 83,
          "futureShortId": 83,
          "pars": 1,
          "displayDecimal": 4,
          "maxProfitRatio": 10,
          "maxLeverage": 50,
          "borrowingFeeRatio": 0,
          "maintainMarginRatio": 0.005,
          "fundingFeeRatio": 0.025,
          "priceTickSize": 0.0001,
          "fundingFeeBaseRate": 0.0008,
          "fundingFeeLinearRate": 0.08,
          "maxliquidityLockRatio": 0.2
        }
      ],
    [CHAINS_ID.arbitrum]: [{
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
    }, {
        symbolName: 'PIXEL',
        decimal: 6,
        tag: ['GameFi', 'New'],
        futureLongId: 70,
        futureShortId: 70,
        pars: 1,
        displayDecimal: 4,
        maxProfitRatio: 10,
        maxLeverage: 50,
        borrowingFeeRatio: 0.0,
        maintainMarginRatio: 0.005,
        fundingFeeRatio: 0.025,
        priceTickSize: 0.0001,
        fundingFeeBaseRate: 0.0008,
        fundingFeeLinearRate: 0.08,
        maxliquidityLockRatio: 0.2,
    }],
    [CHAINS_ID.arbitrumGoerli]: [
      {
        "symbolName": "AAVE",
        "decimal": 6,
        "tag": [
          "Defi",
          "RWA"
        ],
        "futureLongId": 1,
        "futureShortId": 1,
        "pars": 0.01,
        "displayDecimal": 2,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.01,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "ADA",
        "decimal": 6,
        "tag": [
          "Public Chain"
        ],
        "futureLongId": 2,
        "futureShortId": 2,
        "pars": 1,
        "displayDecimal": 3,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "APE",
        "decimal": 6,
        "tag": [
          "Metaverse",
          "NFT"
        ],
        "futureLongId": 3,
        "futureShortId": 3,
        "pars": 1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "ARB",
        "decimal": 6,
        "tag": [
          "Layer2",
          "ARB Eco.",
          "Hot"
        ],
        "futureLongId": 4,
        "futureShortId": 4,
        "pars": 1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.5
      },
      {
        "symbolName": "ATOM",
        "decimal": 6,
        "tag": [
          "Public Chain",
          "Cross Chain"
        ],
        "futureLongId": 5,
        "futureShortId": 5,
        "pars": 0.1,
        "displayDecimal": 3,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "AVAX",
        "decimal": 6,
        "tag": [
          "Public Chain"
        ],
        "futureLongId": 6,
        "futureShortId": 6,
        "pars": 0.1,
        "displayDecimal": 3,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "AXS",
        "decimal": 6,
        "tag": [
          "Metaverse",
          "GameFi"
        ],
        "futureLongId": 7,
        "futureShortId": 7,
        "pars": 0.1,
        "displayDecimal": 3,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "BNB",
        "decimal": 6,
        "tag": [
          "Public Chain",
          "Option Token"
        ],
        "futureLongId": 8,
        "futureShortId": 8,
        "pars": 0.01,
        "displayDecimal": 2,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.01,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "COMP",
        "decimal": 6,
        "tag": [
          "Defi",
          "RWA"
        ],
        "futureLongId": 10,
        "futureShortId": 10,
        "pars": 0.01,
        "displayDecimal": 2,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.01,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "CRV",
        "decimal": 6,
        "tag": [
          "Defi"
        ],
        "futureLongId": 11,
        "futureShortId": 11,
        "pars": 1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "DOGE",
        "decimal": 6,
        "tag": [
          "Meme",
          "PoW"
        ],
        "futureLongId": 12,
        "futureShortId": 12,
        "pars": 1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "DOT",
        "decimal": 6,
        "tag": [
          "Public Chain",
          "Web3.0"
        ],
        "futureLongId": 13,
        "futureShortId": 13,
        "pars": 0.1,
        "displayDecimal": 3,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "FTM",
        "decimal": 6,
        "tag": [
          "Public Chain"
        ],
        "futureLongId": 15,
        "futureShortId": 15,
        "pars": 1,
        "displayDecimal": 3,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "GMX",
        "decimal": 6,
        "tag": [
          "Layer2",
          "ARB Eco."
        ],
        "futureLongId": 16,
        "futureShortId": 16,
        "pars": 0.01,
        "displayDecimal": 2,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.01,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "LINK",
        "decimal": 6,
        "tag": [
          "DeFi",
          "Oracle"
        ],
        "futureLongId": 17,
        "futureShortId": 17,
        "pars": 0.1,
        "displayDecimal": 3,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "MATIC",
        "decimal": 6,
        "tag": [
          "Layer2"
        ],
        "futureLongId": 18,
        "futureShortId": 18,
        "pars": 1,
        "displayDecimal": 3,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "MKR",
        "decimal": 6,
        "tag": [
          "Defi",
          "RWA"
        ],
        "futureLongId": 19,
        "futureShortId": 19,
        "pars": 0.001,
        "displayDecimal": 1,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.1,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "NEAR",
        "decimal": 6,
        "tag": [
          "Layer2",
          "Public Chain"
        ],
        "futureLongId": 20,
        "futureShortId": 20,
        "pars": 1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "OP",
        "decimal": 6,
        "tag": [
          "Layer2"
        ],
        "futureLongId": 21,
        "futureShortId": 21,
        "pars": 1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "RDNT",
        "decimal": 6,
        "tag": [
          "Defi"
        ],
        "futureLongId": 22,
        "futureShortId": 22,
        "pars": 1,
        "displayDecimal": 3,
        "maxProfitRatio": 10,
        "maxLeverage": 20,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.1
      },
      {
        "symbolName": "SNX",
        "decimal": 6,
        "tag": [
          "Defi",
          "RWA"
        ],
        "futureLongId": 23,
        "futureShortId": 23,
        "pars": 1,
        "displayDecimal": 3,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "SOL",
        "decimal": 6,
        "tag": [
          "Public Chain",
          "Hot"
        ],
        "futureLongId": 24,
        "futureShortId": 24,
        "pars": 0.01,
        "displayDecimal": 3,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "UNI",
        "decimal": 6,
        "tag": [
          "Defi",
          "Option Token"
        ],
        "futureLongId": 25,
        "futureShortId": 25,
        "pars": 0.1,
        "displayDecimal": 3,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "XRP",
        "decimal": 6,
        "tag": [
          "Public Chain",
          "Pay"
        ],
        "futureLongId": 26,
        "futureShortId": 26,
        "pars": 1,
        "displayDecimal": 5,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.00001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.5
      },
      {
        "symbolName": "TIA",
        "decimal": 6,
        "tag": [
          "Public Chain",
          "New"
        ],
        "futureLongId": 30,
        "futureShortId": 30,
        "pars": 0.1,
        "displayDecimal": 3,
        "maxProfitRatio": 5,
        "maxLeverage": 20,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "ORDI",
        "decimal": 6,
        "tag": [
          "BRC-20",
          "BTC.Eco",
          "New"
        ],
        "futureLongId": 31,
        "futureShortId": 31,
        "pars": 0.1,
        "displayDecimal": 3,
        "maxProfitRatio": 5,
        "maxLeverage": 20,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "BEAM",
        "decimal": 6,
        "tag": [
          "GameFi",
          "New"
        ],
        "futureLongId": 32,
        "futureShortId": 32,
        "pars": 100,
        "displayDecimal": 6,
        "maxProfitRatio": 5,
        "maxLeverage": 20,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.000001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "BLUR",
        "decimal": 6,
        "tag": [
          "NFT",
          "New"
        ],
        "futureLongId": 35,
        "futureShortId": 35,
        "pars": 1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "1MSATS",
        "decimal": 6,
        "tag": [
          "BRC-20",
          "New"
        ],
        "futureLongId": 36,
        "futureShortId": 36,
        "pars": 1,
        "displayDecimal": 6,
        "maxProfitRatio": 5,
        "maxLeverage": 5,
        "borrowingFeeRatio": 0.02,
        "maintainMarginRatio": 0.02,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.000001,
        "fundingFeeBaseRate": 0.0016,
        "fundingFeeLinearRate": 0.16,
        "maxliquidityLockRatio": 0.1
      },
      {
        "symbolName": "1MRATS",
        "decimal": 6,
        "tag": [
          "BRC-20",
          "Meme",
          "New"
        ],
        "futureLongId": 37,
        "futureShortId": 37,
        "pars": 0.01,
        "displayDecimal": 6,
        "maxProfitRatio": 5,
        "maxLeverage": 5,
        "borrowingFeeRatio": 0.02,
        "maintainMarginRatio": 0.02,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.000001,
        "fundingFeeBaseRate": 0.0016,
        "fundingFeeLinearRate": 0.16,
        "maxliquidityLockRatio": 0.08
      },
      {
        "symbolName": "USTC",
        "decimal": 6,
        "tag": [
          "Stable Coin",
          "New"
        ],
        "futureLongId": 38,
        "futureShortId": 38,
        "pars": 1,
        "displayDecimal": 6,
        "maxProfitRatio": 5,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.000001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "FLIP",
        "decimal": 6,
        "tag": [
          "Defi",
          "New"
        ],
        "futureLongId": 39,
        "futureShortId": 39,
        "pars": 0.1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 5,
        "borrowingFeeRatio": 0.02,
        "maintainMarginRatio": 0.02,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0016,
        "fundingFeeLinearRate": 0.16,
        "maxliquidityLockRatio": 0.08
      },
      {
        "symbolName": "PYTH",
        "decimal": 6,
        "tag": [
          "Defi",
          "New"
        ],
        "futureLongId": 40,
        "futureShortId": 40,
        "pars": 1,
        "displayDecimal": 4,
        "maxProfitRatio": 5,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "VRTX",
        "decimal": 6,
        "tag": [
          "Arbitrum Eco.",
          "New"
        ],
        "futureLongId": 41,
        "futureShortId": 41,
        "pars": 1,
        "displayDecimal": 6,
        "maxProfitRatio": 10,
        "maxLeverage": 5,
        "borrowingFeeRatio": 0.02,
        "maintainMarginRatio": 0.02,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.000001,
        "fundingFeeBaseRate": 0.0016,
        "fundingFeeLinearRate": 0.16,
        "maxliquidityLockRatio": 0.08
      },
      {
        "symbolName": "1000LUNC",
        "decimal": 6,
        "tag": [
          "Defi",
          "New"
        ],
        "futureLongId": 42,
        "futureShortId": 42,
        "pars": 1,
        "displayDecimal": 5,
        "maxProfitRatio": 5,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.00001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "FTT",
        "decimal": 6,
        "tag": [
          "Option Token",
          "New"
        ],
        "futureLongId": 43,
        "futureShortId": 43,
        "pars": 0.1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 20,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.02,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.1
      },
      {
        "symbolName": "TOKEN",
        "decimal": 6,
        "tag": [
          "Meme",
          "New"
        ],
        "futureLongId": 44,
        "futureShortId": 44,
        "pars": 1,
        "displayDecimal": 5,
        "maxProfitRatio": 5,
        "maxLeverage": 5,
        "borrowingFeeRatio": 0.02,
        "maintainMarginRatio": 0.02,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.00001,
        "fundingFeeBaseRate": 0.0016,
        "fundingFeeLinearRate": 0.16,
        "maxliquidityLockRatio": 0.1
      },
      {
        "symbolName": "RUNE",
        "decimal": 6,
        "tag": [
          "Defi",
          "BTC.Eco",
          "New"
        ],
        "futureLongId": 45,
        "futureShortId": 45,
        "pars": 0.1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "STX",
        "decimal": 6,
        "tag": [
          "BTC.Eco",
          "New"
        ],
        "futureLongId": 46,
        "futureShortId": 46,
        "pars": 1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "BIGTIME",
        "decimal": 6,
        "tag": [
          "GameFi",
          "New"
        ],
        "futureLongId": 47,
        "futureShortId": 47,
        "pars": 1,
        "displayDecimal": 5,
        "maxProfitRatio": 10,
        "maxLeverage": 5,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.00001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "1MBONK",
        "decimal": 6,
        "tag": [
          "Meme",
          "New"
        ],
        "futureLongId": 48,
        "futureShortId": 48,
        "pars": 0.1,
        "displayDecimal": 4,
        "maxProfitRatio": 5,
        "maxLeverage": 5,
        "borrowingFeeRatio": 0.02,
        "maintainMarginRatio": 0.02,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0016,
        "fundingFeeLinearRate": 0.16,
        "maxliquidityLockRatio": 0.1
      },
      {
        "symbolName": "JTO",
        "decimal": 6,
        "tag": [
          "LSD",
          "New"
        ],
        "futureLongId": 49,
        "futureShortId": 49,
        "pars": 1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "INJ",
        "decimal": 6,
        "tag": [
          "Public Chain",
          "New"
        ],
        "futureLongId": 50,
        "futureShortId": 50,
        "pars": 0.1,
        "displayDecimal": 3,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "ACE",
        "decimal": 6,
        "tag": [
          "GameFi",
          "Web3.0",
          "New"
        ],
        "futureLongId": 51,
        "futureShortId": 51,
        "pars": 0.1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "WLD",
        "decimal": 6,
        "tag": [
          "Web3.0",
          "New"
        ],
        "futureLongId": 52,
        "futureShortId": 52,
        "pars": 0.1,
        "displayDecimal": 3,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "ICP",
        "decimal": 6,
        "tag": [
          "Public Chain",
          "Web3.0",
          "New"
        ],
        "futureLongId": 53,
        "futureShortId": 53,
        "pars": 0.1,
        "displayDecimal": 3,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "SEI",
        "decimal": 6,
        "tag": [
          "Public Chain",
          "New"
        ],
        "futureLongId": 54,
        "futureShortId": 54,
        "pars": 1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "SUI",
        "decimal": 6,
        "tag": [
          "Public Chain",
          "New"
        ],
        "futureLongId": 55,
        "futureShortId": 55,
        "pars": 1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "APT",
        "decimal": 6,
        "tag": [
          "Public Chain",
          "New"
        ],
        "futureLongId": 56,
        "futureShortId": 56,
        "pars": 0.1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "CAKE",
        "decimal": 6,
        "tag": [
          "BSC",
          "New"
        ],
        "futureLongId": 57,
        "futureShortId": 57,
        "pars": 0.1,
        "displayDecimal": 3,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "MOVR",
        "decimal": 6,
        "tag": [
          "Dot eco.",
          "New"
        ],
        "futureLongId": 58,
        "futureShortId": 58,
        "pars": 0.01,
        "displayDecimal": 3,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "TRX",
        "decimal": 6,
        "tag": [
          "Public Chain",
          "New"
        ],
        "futureLongId": 59,
        "futureShortId": 59,
        "pars": 1,
        "displayDecimal": 5,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.00001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "ENS",
        "decimal": 6,
        "tag": [
          "DID",
          "NFT",
          "New"
        ],
        "futureLongId": 60,
        "futureShortId": 60,
        "pars": 0.01,
        "displayDecimal": 3,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "GMT",
        "decimal": 6,
        "tag": [
          "GameFi",
          "Web3.0",
          "New"
        ],
        "futureLongId": 61,
        "futureShortId": 61,
        "pars": 1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "PEOPLE",
        "decimal": 6,
        "tag": [
          "Meme",
          "New"
        ],
        "futureLongId": 62,
        "futureShortId": 62,
        "pars": 10,
        "displayDecimal": 5,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.00001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "MAGIC",
        "decimal": 6,
        "tag": [
          "GameFi",
          "ARB Eco.",
          "New"
        ],
        "futureLongId": 63,
        "futureShortId": 63,
        "pars": 1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "ZKF",
        "decimal": 6,
        "tag": [
          "Layer 2",
          "New"
        ],
        "futureLongId": 64,
        "futureShortId": 64,
        "pars": 10,
        "displayDecimal": 6,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.000001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "XAI",
        "decimal": 6,
        "tag": [
          "Layer 3",
          "GameFi",
          "New"
        ],
        "futureLongId": 65,
        "futureShortId": 65,
        "pars": 1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "MANTA",
        "decimal": 6,
        "tag": [
          "Layer 2",
          "New"
        ],
        "futureLongId": 66,
        "futureShortId": 66,
        "pars": 1,
        "displayDecimal": 5,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.00001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "LDO",
        "decimal": 6,
        "tag": [
          "LSD",
          "DeFi",
          "New"
        ],
        "futureLongId": 67,
        "futureShortId": 67,
        "pars": 1,
        "displayDecimal": 3,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "SSV",
        "decimal": 6,
        "tag": [
          "LSD",
          "New"
        ],
        "futureLongId": 68,
        "futureShortId": 68,
        "pars": 0.01,
        "displayDecimal": 2,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.01,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "ALT",
        "decimal": 6,
        "tag": [
          "RaaS",
          "LSD",
          "New"
        ],
        "futureLongId": 69,
        "futureShortId": 69,
        "pars": 0.1,
        "displayDecimal": 5,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.00001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "API3",
        "decimal": 6,
        "tag": [
          "Defi",
          "Oracle",
          "New"
        ],
        "futureLongId": 70,
        "futureShortId": 70,
        "pars": 0.1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "UMA",
        "decimal": 6,
        "tag": [
          "RWA",
          "Oracle",
          "New"
        ],
        "futureLongId": 71,
        "futureShortId": 71,
        "pars": 0.1,
        "displayDecimal": 3,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "JUP",
        "decimal": 6,
        "tag": [
          "DeFi",
          "Solana Eco.",
          "New"
        ],
        "futureLongId": 72,
        "futureShortId": 72,
        "pars": 1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "ZETA",
        "decimal": 6,
        "tag": [
          "Public Chain",
          "New"
        ],
        "futureLongId": 73,
        "futureShortId": 73,
        "pars": 0.1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "RON",
        "decimal": 6,
        "tag": [
          "DeFi",
          "New"
        ],
        "futureLongId": 74,
        "futureShortId": 74,
        "pars": 0.1,
        "displayDecimal": 3,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "PIXEL",
        "decimal": 6,
        "tag": [
          "GameFi",
          "New"
        ],
        "futureLongId": 75,
        "futureShortId": 75,
        "pars": 1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "STRK",
        "decimal": 6,
        "tag": [
          "Layer2",
          "New"
        ],
        "futureLongId": 76,
        "futureShortId": 76,
        "pars": 1,
        "displayDecimal": 2,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.01,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "KAS",
        "decimal": 6,
        "tag": [
          "PoW",
          "New"
        ],
        "futureLongId": 77,
        "futureShortId": 77,
        "pars": 1,
        "displayDecimal": 5,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.00001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "CKB",
        "decimal": 6,
        "tag": [
          "Public Chain",
          "PoW",
          "New"
        ],
        "futureLongId": 78,
        "futureShortId": 78,
        "pars": 1,
        "displayDecimal": 6,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.000001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "RNDR",
        "decimal": 6,
        "tag": [
          "VR",
          "Depin",
          "New"
        ],
        "futureLongId": 79,
        "futureShortId": 79,
        "pars": 0.1,
        "displayDecimal": 3,
        "maxProfitRatio": 10,
        "maxLeverage": 100,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.3
      },
      {
        "symbolName": "IOTX",
        "decimal": 6,
        "tag": [
          "Depin",
          "New"
        ],
        "futureLongId": 80,
        "futureShortId": 80,
        "pars": 1,
        "displayDecimal": 5,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.00001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "1000PEPE",
        "decimal": 6,
        "tag": [
          "Meme",
          "New"
        ],
        "futureLongId": 81,
        "futureShortId": 81,
        "pars": 10,
        "displayDecimal": 5,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.00001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "1000FLOKI",
        "decimal": 6,
        "tag": [
          "Meme",
          "New"
        ],
        "futureLongId": 82,
        "futureShortId": 82,
        "pars": 1,
        "displayDecimal": 5,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.00001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      },
      {
        "symbolName": "WIF",
        "decimal": 6,
        "tag": [
          "Meme",
          "New"
        ],
        "futureLongId": 83,
        "futureShortId": 83,
        "pars": 1,
        "displayDecimal": 4,
        "maxProfitRatio": 10,
        "maxLeverage": 50,
        "borrowingFeeRatio": 0,
        "maintainMarginRatio": 0.005,
        "fundingFeeRatio": 0.025,
        "priceTickSize": 0.0001,
        "fundingFeeBaseRate": 0.0008,
        "fundingFeeLinearRate": 0.08,
        "maxliquidityLockRatio": 0.2
      }
    ],
};

export const tokens: Record<string, Token[]> = Object.keys(baseTokens).reduce((result, cur) => {
  return {
    ...result,
    [cur]: baseTokens[cur].map(tk =>  extendToken(tk))
  }
}, {});

// 获取整个token相关的map
export const tokensMap: Record<string, Record<string, Token>> = Object.keys(tokens).reduce((result, curChain)=> {
  return {
    ...result,
    [curChain]: tokens[curChain].reduce((result, token_) => {
      return {
        ...result,
        [token_.symbolName]: token_,
      }
    }, {})
  }
}, {});