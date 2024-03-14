"use client";
import { memo, createContext, useContext, useMemo, useEffect } from "react";
import BigNumber from "bignumber.js";
import { defineChain } from "viem";
import { useChainId } from "wagmi";

import { CHAINS_ID, DEFAULT_CHAIN_ID } from "@/app/config/common";
import { arbitrumOne, zkFair, zkFairTestnet } from "@/app/config/chains";

import addressMap from "@/app/config/contract_address";

export type AppConfigType = {
  chain: ReturnType<typeof defineChain>;
  graph: {
    base: string;
    baseBlock: string;
    perpetual: string;
  };
  api: {
    http: string;
    wss: string;
  };

  rpc: {
    http: string;
    wss?: string;
  };

    executionFee: string | number | BigNumber;
    contract_address: typeof addressMap[CHAINS_ID.zkfair];

}


const AppConfigOnChain: Record<number, AppConfigType> = {
  [CHAINS_ID.zkfair]: {
    chain: zkFair,
    graph: {
      base: "https://gql.hyperionx.xyz/subgraphs/name/hyperionx/zkfair",
      perpetual: "https://gql.hyperionx.xyz/subgraphs/name/hyperionx/zkfair",
      baseBlock:
        "https://gql.hyperionx.xyz/subgraphs/name/hyperionx/zkfair-blocks",
    },

    // config rpc
    rpc: {
      http: "https://rpc.zkfair.io",
      wss: "wss://rpc.hyperionx.xyz/",
    },

    // config api
    api: {
      http: "https://api.hyperionx.xyz/",
      wss: "wss://api.hyperionx.xyz/",
    },

    executionFee: "2500000000000000000",
    contract_address: addressMap[CHAINS_ID.zkfair],
  },
  [CHAINS_ID.zkfairtest]: {
    chain: zkFairTestnet,
    graph: {
      base: 'https://gql-testnet.substancex.io/subgraphs/name/substanceexchangedevelop/zktest',
      perpetual: 'https://gql-testnet.substancex.io/subgraphs/name/substanceexchangedevelop/zktest',
      baseBlock: 'https://gql-testnet.substancex.io/subgraphs/name/substanceexchangedevelop/zktest-blocks',
    },

    // config rpc
    rpc: {
      http: "https://testnet-rpc.zkfair.io",
      wss: "wss://rpc.hyperionx.xyz/",
    },

    // config api
    api: {
      http: "https://api-testnet.substancex.io/",
      wss: "wss://api-testnet.substancex.io/",
    },

    executionFee: "2500000000000000000",
    contract_address: addressMap[CHAINS_ID.zkfairtest],
  },
  [CHAINS_ID.arbitrum]: {
    chain: arbitrumOne,
    // config graphhql
    graph: {
      base: "https://api.thegraph.com/subgraphs/name/substanceexchangedevelop/coreprod",
      perpetual:
        "https://gql.substancex.io/subgraphs/name/substanceexchangedevelop/coreprod",
      baseBlock:
        "https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-one-blocks",
    },

    // config rpc
    rpc: {
      http: "https://arb.substancex.io/",
      wss: "wss://arb.substancex.io/",
    },

    // config api
    api: {
      http: "https://api.substancex.io/",
      wss: "wss://api.substancex.io/",
    },

    executionFee: "2500000000000000000",
    contract_address: addressMap[CHAINS_ID.arbitrum],
  },
};

// config app config on default chain id, if chain changes, then the provider should update
export const AppConfigContext = createContext(
  AppConfigOnChain[DEFAULT_CHAIN_ID]
);

export const AppConfigProvider: FCC<{}> = memo(({ children }) => {
  const chainId = useChainId();

  console.log("chainId", chainId);
  // const chainId = 1;

  const config = useMemo(() => {
    return AppConfigOnChain[chainId] || AppConfigOnChain[DEFAULT_CHAIN_ID];
  }, [chainId]);

  return (
    <AppConfigContext.Provider value={config}>
      {children}
    </AppConfigContext.Provider>
  );
});

AppConfigProvider.displayName = "AppConfigProvider";
