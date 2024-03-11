import { gql } from 'graphql-request';

export const futurePositionsGql = gql`
  query FuturePositions($address: String) {
    futurePositions(where: { user: $address }, orderDirection: desc, orderBy: id) {
      user
      tokenSize
      openCost
      maxProfitRatio
      id
      futureId
      future
      entryFundingFeePerToken
      entryBorrowingFeePerToken
      cumulativeTeamFee
      cumulativeFundingFee
      cumulativeBorrowingFee
      collateral
    }
  }
`;
