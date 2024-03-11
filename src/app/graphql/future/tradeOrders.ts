import { getGraphqlClient } from "@/app/config/getGraphqlClient";
import { gql } from "graphql-request";

const futureTradesById = gql`
  query FutureTrades($futureId: String) {
    futureTrades(
      where: { futureId: $futureId }
      orderBy: "time"
      orderDirection: desc
    ) {
      address
      blockNumber
      blockTimestamp
      futureId
      future
      id
      pair
      price
      size
      time
      transactionHash
      type
    }
  }
`;

const futureTrades = gql`
  query FutureTrades {
    futureTrades(orderBy: "time", orderDirection: desc) {
      address
      blockNumber
      blockTimestamp
      futureId
      future
      id
      pair
      price
      size
      time
      transactionHash
      type
    }
  }
`;

const fetchFutureTradesById = async (futureId: string) => {
  const { perpetualClient } = getGraphqlClient();

  return perpetualClient.request(futureTradesById, { futureId: futureId });
};

const fetchFutureTrades = async () => {
  const { perpetualClient } = getGraphqlClient();
  return perpetualClient.request(futureTrades);
};

export { futureTradesById, futureTrades };
