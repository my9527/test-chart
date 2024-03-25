'use client';


import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { WagmiProvider, createConfig} from 'wagmi';

import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';

import {
  argentWallet,
  trustWallet,
  ledgerWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets';

import {
  iotexTest,
  arbitrumSepoliaTest,
  arbitrumOne,
  zkFair,
  zkFairTestnet,
  arbitrumGoerliTest,


} from "../../config/chains";



const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
  
  appName: 'nextjs-quenta',
  projectId: '8335051b217e5d8cbd9ecdcabdd0ebd2',
  wallets: [
    ...wallets,
    {
      groupName: 'Other',
      wallets: [walletConnectWallet],
    },
  ],
  chains: [
    // arbitrumOne,
    iotexTest,
    arbitrumSepoliaTest,
    zkFairTestnet,
    zkFair,
    arbitrumOne,
    arbitrumGoerliTest
  ],
  ssr: false, // 设置为false， 避免因服务端导致初始Chain 为 chains 的第一个
  syncConnectedChain:true,

});

const queryClient = new QueryClient();

export function RainbowProvider({ children }: { children: React.ReactNode }) {

  return (
    <WagmiProvider config={config} >
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}  
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}