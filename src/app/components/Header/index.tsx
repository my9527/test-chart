"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import LogoIcon from "@/app/assets/header/logo.svg";
import Image from "next/image";
import Menu from "./Menu";
import Wallet from "./Wallet";
import { useAccount } from "wagmi";
import { shortenString } from "@/app/lib/shortenString";
import { walletsMap } from "./Wallet/contants";
import { Row } from "../Row";

const Wrapper = styled.div`
  background: ${(props) => props.theme.colors.fill1};
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  border-bottom: ${props=>`2px solid ${props.theme.colors.border1}`};
  justify-content: space-between;
`;
const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding-left: 34px;
`;
const Line = styled.div`
  width: 1px;
  height: 14px;
  background-color: rgba(255, 255, 255, 0.2);
`;
const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding-right: 15px;
  padding-right: 20px;

`;

const ConnectButton = styled(Row)`
  width: 144px;
  height: 26px;
  box-sizing: border-box;
  flex-shrink: 0;
  color: ${(props) => props.theme.colors.text1};
  font-family: Arial;
  font-size: ${(props) => props.theme.fontSize.medium};
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
  background: ${(props) => props.theme.colors.primary3};
  justify-content: center;
  border-radius: 26px;
  cursor: pointer;

`

const ConnectedButton = styled(Row)`
  align-items: center;
  border-radius: 26px;
  height: 26px;
  box-sizing: border-box;
  padding: 3px 8px;
  justify-content: center;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  width: auto;

  color: ${(props) => props.theme.colors.text1};

  font-family: Arial;
  font-size: ${(props) => props.theme.fontSize.medium};
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
  background: ${(props) => props.theme.colors.fill2};
  cursor: pointer;
  

`

const Header = () => {
  const [visible, setVisible] = useState(false);

  const { isConnected, address, connector } = useAccount();





  return (
    <Wrapper>
      <Left>
        <Image src={LogoIcon} width={23} height={22} alt="" />
        <Line />
        <Menu />
      </Left>
      <Right>
      {
        isConnected ? <ConnectedButton onClick={() => setVisible(true)}>{walletsMap[connector?.name as string]?.icon} <span>{shortenString(address as string)}</span></ConnectedButton> : <ConnectButton onClick={() => setVisible(true)}>Connect Wallet</ConnectButton> 
      }
      </Right>
      
      <Wallet visible={visible} onHide={() => setVisible(false)} />
    </Wrapper>
  );
};
export default Header;
