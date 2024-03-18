

import { gql } from "graphql-request";
// [
//   'updateOffsets', 不记录order内
//   ‘updateCollateralOrders’, 不记录order内

//   'futureStopOrders',
//   'increaseMarketOrders',
//   'decreaseMarketOrders',
//   'increaseLimitOrders',
//   'decreaseLimitOrders',
// ];

export const futureOrders = gql`
  query FutureOrders($address: String) {
    updateOffsets(where: { user: $address }) {
      blockNumber
      blockTimestamp
      id
      futureId
      future
      offset
      transactionHash
      user
    }

    updateCollateralOrders(where: { user: $address }, orderBy: nonce, orderDirection: desc) {
      user
      status
      offset
      nonce
      increase
      id
      futureId
      future
      deltaAmount
      executionFee
      createTime
      createHash
      createBlock
      cancelReason
    }

    futureStopOrders(where: { user: $address }, orderBy: nonce, orderDirection: desc) {
      id
      cancelReason
      createBlock
      createHash
      createTime
      decreaseTokenSize
      executeDecreaseTokenSize
      executePrice
      future
      futureId
      isStopLoss
      nonce
      status
      triggerPrice
      user
      offset
    }

    increaseMarketOrders(where: { user: $address }, orderBy: nonce, orderDirection: desc) {
      id
      future
      futureId
      user
      nonce
      increaseTokenSize
      increaseCollateral
      executePrice
      executionFee
      deadline
      # isLong
      status
      currentPrice
      cancelReason
      cancelled
      createTime
      createHash
      createBlock
      # offset
    }

    decreaseMarketOrders(where: { user: $address }, orderBy: nonce, orderDirection: desc) {
      user
      status
      nonce
      # isLong
      id
      futureId
      future
      executionFee
      executePrice
      decreaseTokenSize
      deadline
      currentPrice
      createTime
      createHash
      createBlock
      cancelled
      cancelReason
      # offset
    }

    increaseLimitOrders(where: { user: $address }, orderBy: nonce, orderDirection: desc) {
      id
      future
      user
      nonce
      futureId
      increaseCollateral
      increaseTokenSize
      price
      executionFee
      cancelReason
      status
      createTime
      createHash
      createBlock
      # offset
    }

    decreaseLimitOrders(where: { user: $address }, orderBy: nonce, orderDirection: desc) {
      user
      status
      price
      nonce
      id
      futureId
      future
      executionFee
      executePrice
      decreaseTokenSize
      createTime
      createHash
      createBlock
      cancelReason
      offset
    }
  }
`;
