
import { defineChain } from "viem";
import { iotexTestnet } from "viem/chains";
export const iotexTest = /*#__PURE__*/ defineChain({
    id: 4_690,
    name: 'IoTeX Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'IoTeX',
      symbol: 'IOTX',
    },
    rpcUrls: {
      default: {
        http: ['https://babel-api.testnet.iotex.io'],
        webSocket: ['wss://babel-api.testnet.iotex.io'],
      },
    },
    blockExplorers: {
      default: {
        name: 'IoTeXScan',
        url: 'https://testnet.iotexscan.io',
      },
    },
    contracts: {
        multicall3: {
          address: '0x022831C01390280BD03Ed2681cD96b49B9018c4E',
          blockCreated: 25342260,
        },
      },
    testnet: true,
  })
  