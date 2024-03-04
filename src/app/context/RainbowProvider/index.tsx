import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";


const config = getDefaultConfig({
    appName: 'nextjs-quenta',
    projectId: '8335051b217e5d8cbd9ecdcabdd0ebd2',
    chains: [mainnet, polygon, optimism, arbitrum, base, zora],
    ssr: false, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();
export const RainbowProvider: FCC<{}> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};