"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import NetworkIcon from "@/app/assets/footer/network.svg";
import { useRouter } from "next/navigation";

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
  width: 700px;
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
const Footer = () => {
  const router = useRouter();
  const tokenList = [
    {
      token: "BTC/USDT",
      change: "20%",
      price: "88888.99",
    },
    {
      token: "ETH/USDT",
      change: "20%",
      price: "88888.99",
    },
    {
      token: "DOT/USDT",
      change: "20%",
      price: "88888.99",
    },
    {
      token: "ARB/USDT",
      change: "20%",
      price: "88888.99",
    },
    {
      token: "LUNC/USDT",
      change: "20%",
      price: "88888.99",
    },
  ];

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
  }, []);
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
                <Trade key={item.token}>
                  <p className="token">{item.token}</p>
                  <p className="change">{item.change}</p>
                  <p className="price">{item.price}</p>
                  {index !== tokenList.length - 1 && <Line />}
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
          <p>{"< 10 block delay"}</p>
        </NetworkStatus>
      </Right>
    </Wrapper>
  );
};
export default Footer;
