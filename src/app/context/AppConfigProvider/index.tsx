"use client";
import { memo, createContext, useContext, useMemo, useEffect } from "react";
import BigNumber from "bignumber.js";
import { defineChain } from "viem";
import { useChainId } from "wagmi";

import { CHAINS_ID, DEFAULT_CHAIN_ID } from "@/app/config/common";
import { arbitrumGoerliTest, arbitrumOne, iotexTest, zkFair, zkFairTestnet } from "@/app/config/chains";

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
    common?: string;
  };

  rpc: {
    http: string;
    wss?: string;
  };

    executionFee: string | number | BigNumber;
    contract_address: {
      [key in keyof typeof addressMap[CHAINS_ID.zkfair]]: `0x${string}`
    };
    epoch_duration: number; // 每个epoch 的周期 ， h 为单位

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
    epoch_duration: 4,
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
      http: "https://api-zkfair-testnet.substancex.io/api/backend/",
      wss: "wss://api-testnet.substancex.io/",
    },

    executionFee: "2500000000000000000",
    contract_address: addressMap[CHAINS_ID.zkfairtest],
    epoch_duration: 4,
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
    epoch_duration: 1,
  },
  [CHAINS_ID.arbitrumGoerli]: {
    chain: arbitrumGoerliTest,
    // config graphhql
    // config graphhql
    graph: {
      base: 'https://api.thegraph.com/subgraphs/name/substanceexchangedevelop/core',
      perpetual: 'https://gql-testnet.substancex.io/subgraphs/name/sex/user',
      baseBlock: 'https://api.thegraph.com/subgraphs/name/iliaazhel/arbitrum-goerli-blocklytics',
    },

    // config rpc
    rpc: {
      http: "https://arb.substancex.io/",
      wss: "wss://api-testnet.substancex.io/",
    },

    // config api
    api: {
      http: "https://arbitrum-goerli.blastapi.io/5eda3ae1-cf24-4a67-86b6-3727bdd0d816",
      wss: "wss://api-testnet.substancex.io/",
    },

    executionFee: '300000000000000',
    contract_address: addressMap[CHAINS_ID.arbitrumGoerli],

    epoch_duration: 1,
  },
  [CHAINS_ID.iotxTest]: {
    chain: iotexTest,
    // config graphhql
    // config graphhql
    graph: {
      base: 'https://gql-testnet.substancex.io/subgraphs/name/substanceexchangedevelop/iotex_testnet',
      perpetual: 'https://gql-testnet.substancex.io/subgraphs/name/substanceexchangedevelop/iotex_testnet',
      baseBlock: 'https://gql-testnet.substancex.io/subgraphs/name/substanceexchangedevelop/iotex_blocks',
    },

    // config rpc
    rpc: {
      http: "https://babel-api.testnet.iotex.one",
      wss: "https://babel-api.testnet.iotex.one/wss",
    },

    // config api
    api: {
      http: "https://api-iotex-test.substancex.io/api/backend/",
      common: "https://api-testnet.substancex.io/api/backend/",
      wss: "wss://api-testnet.substancex.io/",
    },

    executionFee: '500000000000000',
    contract_address: addressMap[CHAINS_ID.iotxTest],
    epoch_duration: 1,
  }
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
    <AppConfigContext.Provider value={config} key={chainId}>
      {children}
    </AppConfigContext.Provider>
  );
});

AppConfigProvider.displayName = "AppConfigProvider";
