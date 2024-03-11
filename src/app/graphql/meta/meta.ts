import { getGraphqlClient } from "@/app/config/getGraphqlClient";
import { gql } from "graphql-request";
import useGraphqlFetch from "@/app/hooks/useGraphqlFetch";

const metaQuery = gql`
  query MyQuery {
    _meta {
      block {
        number
      }
    }
  }
`;
export default metaQuery;
