import { GraphQLClient } from "graphql-request";
import { useAppConfig } from "./useAppConfig";
import { CHAINS_ID } from "../config/common";
import { useChainId } from "wagmi";

let clientMap: Record<CHAINS_ID, Record<string, GraphQLClient>> = {

};




type GraphqlType = "baseBlock" | "perpetual" | "base";

const useGraphqlFetch = (type: GraphqlType, gql: any) => {
  const config = useAppConfig();
  const chainId = useChainId();

  let client: GraphQLClient | null;
  if (clientMap[chainId]?.[type]) {
    // client = clientMap[chainId]?.[type];
  } else {

    clientMap[chainId] = {
      baseBlock: new GraphQLClient(config?.graph.baseBlock, {
        headers: {},
      }),
      perpetual: new GraphQLClient(config?.graph.perpetual, {
        headers: {},
      }),
      base: new GraphQLClient(config?.graph.base, {
        headers: {},
      })
    }
  }
  client = clientMap[chainId][type];

  return async (...args: any) => {
    return client?.request(gql, ...args);
  };
};
export default useGraphqlFetch;
