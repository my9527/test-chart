import { defineChain } from 'viem';

export const zkFair = /*#__PURE__*/ defineChain({
  id: 42766,
  name: 'ZKFair Mainnet',
  network: 'zkfair-mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'USD Coin',
    symbol: 'USDC',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.zkfair.io'],
    },
    public: {
      http: ['https://rpc.zkfair.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'zkFair Explorer',
      url: 'https://scan.zkfair.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xA2576cBFc6bF07Dd29f2779A67c5680Ea5cc4DCC',
    },
  },
  testnet: false,
});
