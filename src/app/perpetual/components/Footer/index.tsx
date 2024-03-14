"use client";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import NetworkStatus from "./NetworkStatus";
import ScrollTrades from "./ScrollTrades";

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

const Footer = () => {
  const router = useRouter();

  return (
    <Wrapper>
      <Left>
        <ScrollTrades />
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
        <NetworkStatus />
      </Right>
    </Wrapper>
  );
};
export default Footer;
