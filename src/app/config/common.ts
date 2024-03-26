

import { zkFair, arbitrumOne, zkFairTestnet, arbitrumGoerliTest, arbitrumSepoliaTest, iotexTest } from "./chains";

export const IS_LOCAL = process.env.NODE_ENV === "development";

//
export const IS_PROD = IS_LOCAL
  ? process.env.NODE_ENV === 'production'
  : !["feature", "localhost"].some((v) => window.location.origin.includes(v));

// config chainid with name
export enum CHAINS_ID {
    'zkfair' = zkFair.id,
    'arbitrum' = arbitrumOne.id,
    'zkfairtest' = zkFairTestnet.id,
    'arbitrumGoerli' = arbitrumGoerliTest.id,
    'arbitrumSepolia' = arbitrumSepoliaTest.id,
    'iotxTest' = iotexTest.id,
}

// default chain id for app
// different env may requires different default chain

export const DEFAULT_CHAIN_ID = (IS_PROD ? CHAINS_ID.zkfairtest: CHAINS_ID.zkfair);


export const DEFAULT_TOKEN_SYMBOL = 'ETH';


// 数字转换readable 格式
export const NUMBER_READABLE_DECIMAL = 1e6;




export enum FutureType {
  LONG = 0,
  SHORT = 1
}


// default remain Collateral ratio
export const DefaultRemainCollateralRatio = 0.5 / 100;



// default tradingFeeRatio
export const  BasicTradingFeeRatio = 0.08; // 这里指代的是 0.0008, 计算使用时需要 0.08 / 100;


// 
export const generateSignApiTokenMessage = (address: string, now: number) => `
Welcome!
Your address: ${address}
Timestamp: ${now}
`