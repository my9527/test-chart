'use client';


import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { WagmiProvider} from 'wagmi';

import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';

import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';

import {
  arbitrumOne,
  zkFair,
  zkFairTestnet,
  arbitrumGoerliTest

} from "../../config/chains";



const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
  appName: 'nextjs-quenta',
  projectId: '8335051b217e5d8cbd9ecdcabdd0ebd2',
  wallets: [
    ...wallets,
    {
      groupName: 'Other',
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  chains: [
    // arbitrumOne,
    zkFairTestnet,
    zkFair,
    arbitrumOne,
    arbitrumGoerliTest
  ],
  ssr: true,

});

const queryClient = new QueryClient();

export function RainbowProvider({ children }: { children: React.ReactNode }) {

  return (
    <WagmiProvider config={config} >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}