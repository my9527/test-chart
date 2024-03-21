import { gql } from 'graphql-request';

export const userClaimWithdrawLiquidities = gql`
  query MyQuery($address: String) {
    userProvideLiquidities(first: 1000, orderBy: blockTimestamp, orderDirection: desc, where: { user: $address }) {
      amount
      blockTimestamp
      epoch
    }
    userWithdrawLiquidities(first: 1000, orderBy: blockTimestamp, orderDirection: desc, where: { user: $address }) {
      amount
      blockTimestamp
      epoch
    }
  }
`;
