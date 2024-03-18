"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useBlockNumber } from "wagmi";
import { useInterval } from "ahooks";
import metaQuery from "@/app/graphql/meta/meta";
import BigNumber from "bignumber.js";
import useGraphqlFetch from "@/app/hooks/useGraphqlFetch";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  svg {
    width: 11px;
    height: 11px;
  }
`;

enum NetworkStatusMap {
  NUL = 4,
  FINE = 0,
  OK = 1,
  BAD = 2,
  OFFLINE = 3,
}
const SubgraphStatusSVG = {
  [NetworkStatusMap.NUL]: () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.375 1.33203H12.125C11.8484 1.33203 11.625 1.55547 11.625 1.83203V14.832C11.625 15.1086 11.8484 15.332 12.125 15.332H14.375C14.6516 15.332 14.875 15.1086 14.875 14.832V1.83203C14.875 1.55547 14.6516 1.33203 14.375 1.33203Z"
          fill="#5B5A5A"
        />
        <path
          d="M4.72868 10.4219H2.49612C2.22171 10.4219 2 10.6414 2 10.9131V14.8429C2 15.1146 2.22171 15.3342 2.49612 15.3342H4.72868C5.0031 15.3342 5.22481 15.1146 5.22481 14.8429V10.9131C5.22481 10.6414 5.0031 10.4219 4.72868 10.4219Z"
          fill="#FD4772"
        />
        <path
          d="M9.50407 6H7.27151C6.9971 6 6.77539 6.21952 6.77539 6.49123V14.8421C6.77539 15.1138 6.9971 15.3333 7.27151 15.3333H9.50407C9.77849 15.3333 10.0002 15.1138 10.0002 14.8421V6.49123C10.0002 6.21952 9.77849 6 9.50407 6Z"
          fill="#5B5A5A"
        />
      </svg>
    );
  },
  [NetworkStatusMap.FINE]: () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.125 5.5H6.875C6.59844 5.5 6.375 5.72344 6.375 6V14.5C6.375 14.7766 6.59844 15 6.875 15H9.125C9.40156 15 9.625 14.7766 9.625 14.5V6C9.625 5.72344 9.40156 5.5 9.125 5.5ZM13.9375 1H11.6875C11.4109 1 11.1875 1.22344 11.1875 1.5V14.5C11.1875 14.7766 11.4109 15 11.6875 15H13.9375C14.2141 15 14.4375 14.7766 14.4375 14.5V1.5C14.4375 1.22344 14.2141 1 13.9375 1ZM4.3125 10H2.0625C1.78594 10 1.5625 10.2234 1.5625 10.5V14.5C1.5625 14.7766 1.78594 15 2.0625 15H4.3125C4.58906 15 4.8125 14.7766 4.8125 14.5V10.5C4.8125 10.2234 4.58906 10 4.3125 10Z"
          fill="#29C18B"
        />
      </svg>
    );
  },
  [NetworkStatusMap.OK]: () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.375 1.33203H12.125C11.8484 1.33203 11.625 1.55547 11.625 1.83203V14.832C11.625 15.1086 11.8484 15.332 12.125 15.332H14.375C14.6516 15.332 14.875 15.1086 14.875 14.832V1.83203C14.875 1.55547 14.6516 1.33203 14.375 1.33203Z"
          fill="#5B5A5A"
        />
        <path
          d="M9.50388 6H7.27132C6.9969 6 6.77519 6.21952 6.77519 6.49123V14.8421C6.77519 15.1138 6.9969 15.3333 7.27132 15.3333H9.50388C9.77829 15.3333 10 15.1138 10 14.8421V6.49123C10 6.21952 9.77829 6 9.50388 6ZM4.72868 10.4211H2.49612C2.22171 10.4211 2 10.6406 2 10.9123V14.8421C2 15.1138 2.22171 15.3333 2.49612 15.3333H4.72868C5.0031 15.3333 5.22481 15.1138 5.22481 14.8421V10.9123C5.22481 10.6406 5.0031 10.4211 4.72868 10.4211Z"
          fill="#E8C352"
        />
      </svg>
    );
  },
  [NetworkStatusMap.BAD]: () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.375 1.33203H12.125C11.8484 1.33203 11.625 1.55547 11.625 1.83203V14.832C11.625 15.1086 11.8484 15.332 12.125 15.332H14.375C14.6516 15.332 14.875 15.1086 14.875 14.832V1.83203C14.875 1.55547 14.6516 1.33203 14.375 1.33203Z"
          fill="#5B5A5A"
        />
        <path
          d="M4.72868 10.4219H2.49612C2.22171 10.4219 2 10.6414 2 10.9131V14.8429C2 15.1146 2.22171 15.3342 2.49612 15.3342H4.72868C5.0031 15.3342 5.22481 15.1146 5.22481 14.8429V10.9131C5.22481 10.6414 5.0031 10.4219 4.72868 10.4219Z"
          fill="#FD4772"
        />
        <path
          d="M9.50407 6H7.27151C6.9971 6 6.77539 6.21952 6.77539 6.49123V14.8421C6.77539 15.1138 6.9971 15.3333 7.27151 15.3333H9.50407C9.77849 15.3333 10.0002 15.1138 10.0002 14.8421V6.49123C10.0002 6.21952 9.77849 6 9.50407 6Z"
          fill="#5B5A5A"
        />
      </svg>
    );
  },
  [NetworkStatusMap.OFFLINE]: () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.125 5.5H6.875C6.59844 5.5 6.375 5.72344 6.375 6V14.5C6.375 14.7766 6.59844 15 6.875 15H9.125C9.40156 15 9.625 14.7766 9.625 14.5V6C9.625 5.72344 9.40156 5.5 9.125 5.5ZM13.9375 1H11.6875C11.4109 1 11.1875 1.22344 11.1875 1.5V14.5C11.1875 14.7766 11.4109 15 11.6875 15H13.9375C14.2141 15 14.4375 14.7766 14.4375 14.5V1.5C14.4375 1.22344 14.2141 1 13.9375 1ZM4.3125 10H2.0625C1.78594 10 1.5625 10.2234 1.5625 10.5V14.5C1.5625 14.7766 1.78594 15 2.0625 15H4.3125C4.58906 15 4.8125 14.7766 4.8125 14.5V10.5C4.8125 10.2234 4.58906 10 4.3125 10Z"
          fill="#5B5A5A"
        />
      </svg>
    );
  },
};
const GraphStatusDesc = {
  [NetworkStatusMap.FINE]: `< 30 block delay`,
  [NetworkStatusMap.OK]: `> 30 block delay`,
  [NetworkStatusMap.BAD]: `> 100 block delay`,
  [NetworkStatusMap.OFFLINE]: "--",
  [NetworkStatusMap.NUL]: "--",
};

const NetworkStatus = () => {
  const useBlockDelay = () => {
    const [status, updateStatus] = useState(NetworkStatusMap.NUL);

    const { data } = useBlockNumber({
      cacheTime: 1000,
    });

    const fun = useGraphqlFetch("base", metaQuery);

    const getBlockDelay = async () => {
      const { _meta }: any = await fun();
      const deltaBlock = BigNumber(data?.toString() || 0).minus(
        _meta?.block.number
      );
     
      let _status = NetworkStatusMap.OFFLINE;
      if (deltaBlock.lt(30)) {
        _status = NetworkStatusMap.FINE;
      } else if (deltaBlock.gt(30) && deltaBlock.lt(100)) {
        _status = NetworkStatusMap.OK;
      } else if (deltaBlock.gt(100)) {
        _status = NetworkStatusMap.BAD;
      } else {
        _status = NetworkStatusMap.OFFLINE;
      }
      updateStatus(_status);
    };

    const clearInter = useInterval(
      () => {
        getBlockDelay();
      },
      30 * 1000,
      { immediate: true }
    );

    useEffect(() => {
      return () => {
        clearInter && clearInter();
      };
    }, []);

    return status;
  };
  const blockDelay = useBlockDelay();
  return (
    <Wrapper>
      {SubgraphStatusSVG[blockDelay]()}
      <p>{GraphStatusDesc[blockDelay]}</p>
    </Wrapper>
  );
};
export default NetworkStatus;
