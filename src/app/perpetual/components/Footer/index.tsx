"use client";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import Image from "next/image";
import NetworkIcon from "@/app/assets/footer/network.svg";
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
`;

enum NetworkStatusMap {
  NUL = 4,
  FINE = 0,
  OK = 1,
  BAD = 2,
  OFFLINE = 3,
}

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
      return { token: i + "/USDT", change: "20%", price: "88888.99" };
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

    useBlockNumber({
      cacheTime: 1000,
      onBlock(block: any) {
        curBlock.current = block.toString();
      },
    });
    const fun = useGraphqlFetch("base", metaQuery);

    const getBlockDelay = async () => {
      const { _meta }: any = await fun();
      const deltaBlock = BigNumber(curBlock.current?.toString() || 0).minus(
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
          <Image src={NetworkIcon} alt="" width={11} height={11} />
          <p>{GraphStatusDesc[blockDelay]}</p>
        </NetworkStatus>
      </Right>
    </Wrapper>
  );
};
export default Footer;
