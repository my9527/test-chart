
import Image from "next/image";

import MetaMaskIcon from "@/app/assets/header/metamask.svg";
import WalletConnectIcon from "@/app/assets/header/walletconnect.svg";
import { ReactNode } from "react";


export const walletConfigs = [
    {
      name: 'MetaMask',
      icon: <Image alt="MetaMask logo" src={MetaMaskIcon} width={24} height={24} />,
    },
    {
      name: 'WalletConnect',
      icon: <Image alt="WalletConnect logo" src={WalletConnectIcon} width={24} height={24} />,
    },
]


/**
 * wallet configs map 映射
 */
export const walletsMap: Record<string, { name: string, icon: ReactNode }> = walletConfigs.reduce((result, cur) => {
  return {
    ...result,
    [cur.name]: {
      ...cur,
    }
  }
}, {});