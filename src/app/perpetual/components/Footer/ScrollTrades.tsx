"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useRecoilValue, useRecoilState } from "recoil";
import { recoilIndexPrices, recoilFavoriateList } from "@/app/models";
import { filterPrecision } from "@/app/utils/tools";

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
const Trade = styled.div<{ change: string }>`
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
    color: ${(props) =>
      +props.change > 0
        ? props.theme.colors.text2
        : +props.change === 0
        ? props.theme.colors.text4
        : props.theme.colors.text5};
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
const ScrollTrades = () => {
  const indexPrices = useRecoilValue(recoilIndexPrices);

  const [favoriateList] = useRecoilState(recoilFavoriateList);

  const list = useMemo(() => {
    return Object.keys(favoriateList).map((i) => {
      const data = indexPrices[i];
      return {
        symbol: i + "USD",
        change: data?.change
          ? filterPrecision(data?.change || 0, 2) + "%"
          : "-",
        price: data?.price || "-",
      };
    });
  }, [favoriateList, indexPrices]);

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
  useEffect(() => {
    timer = setInterval(scrollFun, 50);
    return () => {
      clearInterval(timer);
    };
  }, [list.length]);
  return (
    <ScrollWrapper
      id="wrapper"
      onMouseOver={() => clearInterval(timer)}
      onMouseOut={() => {
        timer = setInterval(scrollFun, 50);
      }}
    >
      <Trades id="trades">
        {list.map((item) => {
          return (
            <Trade key={item?.symbol} change={item?.change}>
              <p className="token">{item?.symbol}</p>
              <p className="change">{item?.change}</p>
              <p className="price">{item?.price}</p>
              <Line />
            </Trade>
          );
        })}
      </Trades>
      <Trades id="trades_copy"></Trades>
    </ScrollWrapper>
  );
};
export default ScrollTrades;
