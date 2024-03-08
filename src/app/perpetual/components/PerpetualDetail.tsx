"use client";
import styled from "styled-components";
import DraggableIcon from "./DraggableIcon";
import ArrowIcon from "@/app/assets/header/arrow.svg";
import Image from "next/image";

const Wrapper = styled.div`
  width: 100%;
  height: 50px;
  background: ${(props) => props.theme.colors.fill1};
  border-bottom: ${(props) => `1px solid ${props.theme.colors.border1}`};
  padding-left: 34px;
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Layout = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;
const Token = styled(Layout)`
  gap: 10px;
  .label {
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.header0};
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
  }
  .arrow {
    width: 11px;
    height: 6px;
  }
  .changePrice {
    color: ${(props) => props.theme.colors.text2};
    font-family: Arial;
    font-style: normal;
    line-height: 100%;
    font-weight: 700;
    .change {
      font-size: ${(props) => props.theme.fontSize.header2};
      margin-bottom: 3px;
    }
    .price {
      font-size: ${(props) => props.theme.fontSize.header5};
    }
  }
`;
const PerpetualDetail = () => {
  return (
    <Wrapper>
      <Layout>
        <Token>
          <h3>BTCUSDT</h3>
          <Image src={ArrowIcon} width={11} height={6} alt="" />
          
        </Token>
      </Layout>
      <DraggableIcon />
    </Wrapper>
  );
};
export default PerpetualDetail;
