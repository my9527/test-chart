import { defineChain } from 'viem';

export const arbitrumSepoliaTest = /*#__PURE__*/ defineChain({
  id: 421_614,
  name: 'Arbitrum Sepolia',
  network: 'arbitrum-Sepolia',
  nativeCurrency: {
    name: 'Arbitrum Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://arbitrum-sepolia-rpc.publicnode.com'],
    },
    public: {
      http: ['https://arbitrum-sepolia-rpc.publicnode.com'],
      webSocket: ['wss://arbitrum-sepolia-rpc.publicnode.com'],
    },
  },
  blockExplorers: {
    etherscan: { name: 'Arbiscan', url: 'https://sepolia.arbiscan.io/' },
    default: { name: 'Arbiscan', url: 'https://sepolia.arbiscan.io/' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 81930,
    },
  },
  testnet: true,
});
