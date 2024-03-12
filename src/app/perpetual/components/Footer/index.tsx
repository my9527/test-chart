"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { recoilFavoriateList } from "@/app/models";
import { useBlockNumber } from "wagmi";
import { useInterval } from "ahooks";
import metaQuery from "@/app/graphql/meta/meta";
import BigNumber from "bignumber.js";
import useGraphqlFetch from "@/app/hooks/useGraphqlFetch";

const Wrapper = styled.div`
  background: ${(props) => props.theme.colors.fill2};
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
`;
const Left = styled.div`
  padding-left: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
`;
const ScrollWrapper = styled.div`
  cursor: pointer;
  margin-left: 30px;
  width: 660px;
  overflow: hidden;
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
`;
const Trades = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  height: 100%;
`;
const Trade = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  .token {
    color: ${(props) => props.theme.colors.text1};
    font-family: "HarmonyOS Sans";
    font-size: ${(props) => props.theme.fontSize.small};
    font-style: normal;
    font-weight: 500;
    line-height: 120%;
  }
  .change,
  .price {
    color: ${(props) => props.theme.colors.text2};
    font-family: "HarmonyOS Sans";
    font-size: ${(props) => props.theme.fontSize.small};
    font-style: normal;
    font-weight: 500;
    line-height: 120%; /* 14.4px */
  }
`;
const Line = styled.div`
  width: 1px;
  height: 10px;
  background: ${(props) => props.theme.colors.text4};
`;
const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding-right: 15px;
  color: ${(props) => props.theme.colors.text4};
  font-family: Arial;
  font-size: ${(props) => props.theme.fontSize.small};
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
  text-decoration-line: underline;
`;
const Copyright = styled.div``;
const Menu = styled.div`
  cursor: pointer;
`;
const NetworkStatus = styled.div`
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

const Footer = () => {
  const router = useRouter();
  const [favoriateList] = useRecoilState(recoilFavoriateList);

  const tokenList = useMemo(() => {
    return Object.keys(favoriateList).map((i) => {
      return { token: i + "USD", change: "20%", price: "88888.99" };
    });
  }, [favoriateList]);

  let timer: NodeJS.Timeout | number;

  const scrollFun = () => {
    const wrapper = document.getElementById("wrapper") as HTMLElement;
    const trades = document.getElementById("trades") as HTMLElement;
    const trades_copy = document.getElementById("trades_copy") as HTMLElement;

    trades_copy.innerHTML = trades?.innerHTML;
    if (trades_copy?.scrollWidth - wrapper?.scrollLeft <= 0) {
      wrapper.scrollLeft -= trades?.scrollWidth;
    } else {
      wrapper.scrollLeft++;
    }
  };
  const useBlockDelay = () => {
    const [status, updateStatus] = useState(NetworkStatusMap.NUL);

    const curBlock = useRef("0");

    const { data } = useBlockNumber({
      cacheTime: 1000,
    });

    const fun = useGraphqlFetch("base", metaQuery);

    const getBlockDelay = async () => {
      const { _meta }: any = await fun();
      const deltaBlock = BigNumber(data?.toString() || 0).minus(
        _meta?.block.number
      );
      console.log(
        "blockin",
        data,
        deltaBlock,
        deltaBlock.lt(30),
        BigNumber(0).lt(30)
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

  useEffect(() => {
    timer = setInterval(scrollFun, 50);
    return () => {
      clearInterval(timer);
    };
  }, [tokenList.length]);

  return (
    <Wrapper>
      <Left>
        <ScrollWrapper
          id="wrapper"
          onMouseOver={() => clearInterval(timer)}
          onMouseOut={() => {
            timer = setInterval(scrollFun, 50);
          }}
        >
          <Trades id="trades">
            {tokenList.map((item, index) => {
              return (
                <Trade key={item?.token}>
                  <p className="token">{item?.token}</p>
                  <p className="change">{item?.change}</p>
                  <p className="price">{item?.price}</p>
                  <Line />
                </Trade>
              );
            })}
          </Trades>
          <Trades id="trades_copy"></Trades>
        </ScrollWrapper>
      </Left>
      <Right>
        <Copyright>Quenta @2024</Copyright>
        <Line />
        <Menu
          onClick={() => {
            router.push("");
          }}
        >
          Docs
        </Menu>
        <Menu
          onClick={() => {
            router.push("");
          }}
        >
          Help
        </Menu>
        <Menu
          onClick={() => {
            router.push("");
          }}
        >
          Disclaimer
        </Menu>
        <Line />
        <NetworkStatus>
          {SubgraphStatusSVG[blockDelay]()}
          <p>{GraphStatusDesc[blockDelay]}</p>
        </NetworkStatus>
      </Right>
    </Wrapper>
  );
};
export default Footer;
