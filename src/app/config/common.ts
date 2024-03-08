

import { zkFair, arbitrumOne } from "./chains";



export const IS_LOCAL = process.env.NODE_ENV === 'development';

// 
export const IS_PROD = IS_LOCAL ? process.env.NODE_ENV : !['feature', 'localhost'].some(v => window.location.origin.includes(v));


// config chainid with name
export enum CHAINS_ID {
    'zkfair' = zkFair.id,
    'arbitrum' = arbitrumOne.id
}

// default chain id for app
// different env may requires different default chain
export const DEFAULT_CHAIN_ID = IS_PROD ? CHAINS_ID.zkfair : CHAINS_ID.arbitrum;










