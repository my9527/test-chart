import { GraphQLClient } from "graphql-request";
import { useAppConfig } from "./useAppConfig";

let clientMap: Record<string, GraphQLClient | null> = {
  baseBlock: null,
  perpetual: null,
  base: null,
};
type GraphqlType = "baseBlock" | "perpetual" | "base";

const useGraphqlFetch = (type: GraphqlType, gql: any) => {
  const config = useAppConfig();

  let client: GraphQLClient | null;
  if (clientMap[type]) {
    client = clientMap[type];
  } else {
    Object.keys(clientMap).map((i) => {
      if (i === type) {
        clientMap[type] = new GraphQLClient(config?.graph[type], {
          headers: {},
        });
      }
    });
  }
  client = clientMap[type];

  return async (...args: any) => {
    return client?.request(gql, ...args);
  };
};
export default useGraphqlFetch;
