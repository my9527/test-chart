import { defineChain } from 'viem';

export const zkFairTestnet = /*#__PURE__*/ defineChain({
  id: 43851,
  name: 'ZKFair Testnet',
  network: 'zkfair-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'USD Coin',
    symbol: 'USDC',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.zkfair.io'],
    },
    public: {
      http: ['https://testnet-rpc.zkfair.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'zkFair Explorer',
      url: 'https://testnet-scan.zkfair.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xa83512674d4e41914b8a15E5C153FaC31415AF21',
    },
  },
  testnet: true,
});
