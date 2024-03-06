"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import LogoIcon from "@/app/assets/header/logo.svg";
import Image from "next/image";
import Menu from "./Menu";

const Wrapper = styled.div`
  background: #121212;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
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
`;
const Header = () => {
  return (
    <Wrapper>
      <Left>
        <Image src={LogoIcon} width={23} height={22} alt="" />
        <Line />
        <Menu />
      </Left>
    </Wrapper>
  );
};
export default Header;
