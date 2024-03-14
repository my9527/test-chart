"use client";
import styled from "styled-components";
import DraggableIcon from "../DraggableIcon";
import { useState } from "react";
import Tabs from "../Tabs";
import { tabProps } from "../Tabs";
import Slider from "../Slider";
import Image from "next/image";
import ArrowIcon from "@/app/assets/header/arrow.svg";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
const ActionTabs = styled(Tabs)`
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  gap: 0;
  &::before {
    top: 0;
    z-index: 4;
  }
  .tab {
    height: 41px;
    flex: 1;
    justify-content: center;
    color: ${(props) => props.theme.colors.text1};
    font-size: ${(props) => props.theme.fontSize.reguar};
    background-color: ${(props) => props.theme.colors.fill2};

    &:hover {
      background-color: ${(props) => props.theme.colors.fill1};
    }
  }
  .active_tab {
    background-color: ${(props) => props.theme.colors.fill1};
    color: ${(props) => props.theme.colors.primary1};
  }
`;

const Content = styled.div`
  padding: 0 14px 18px 14px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
const OrderTypeTabsWrapper = styled.div`
  margin-bottom: 15px;
  position: relative;
`;
const OrderTypeTabs = styled(Tabs)`
  padding: 10px 0 5px 0;
  .tab {
    padding: 0px 8px 5px 0px;
  }
`;
const Margin = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  .label {
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
  }
  .img {
    width: 8px;
    height: 6px;
    flex-shrink: 0;
  }
`;
const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  .title {
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
  }
`;
const Input = styled.input`
  height: 41px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  border-radius: 8px;
  border: ${(props) => `1px solid ${props.theme.colors.border1}`};
  background: ${(props) => props.theme.colors.fill2};
  outline-style: none;
  padding-left: 8px;
  color: ${(props) => props.theme.colors.text1};
  font-family: Arial;
  font-size: ${(props) => props.theme.fontSize.medium};
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
  &::-webkit-input-placeholder {
    color: ${(props) => props.theme.colors.text4};
    font-size: ${(props) => props.theme.fontSize.medium};
  }
  &:-moz-placeholder {
    color: ${(props) => props.theme.colors.text4};
    font-size: ${(props) => props.theme.fontSize.medium};
  }
  &::-moz-placeholder {
    color: ${(props) => props.theme.colors.text4};
    font-size: ${(props) => props.theme.fontSize.medium};
  }
  &:-ms-input-placeholder {
    color: ${(props) => props.theme.colors.text4};
    font-size: ${(props) => props.theme.fontSize.medium};
  }
  &:focus {
    border: ${(props) => `1px solid ${props.theme.colors.primary1}`};
  }
`;
const Price = styled(Layout)``;
const MarginAmount = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const PerpetualPanels = () => {
  const [activeTab, setActiveTab] = useState<string>("open");
  const [activeOrderTab, setActiveOrderTab] = useState<string>("limit");
  const [margin, setMargin] = useState(3.0);
  const actionTabList = [
    { label: "OPEN", key: "open" },
    { label: "CLOSE", key: "close" },
  ];
  const orderTypeTabList = [
    { label: "Limit", key: "limit" },
    { label: "Market", key: "market" },
  ];

  return (
    <Wrapper>
      <ActionTabs
        gap={0}
        list={actionTabList}
        handleClick={(item: tabProps) => {
          setActiveTab(item?.key);
        }}
      />

      <Content>
        <OrderTypeTabsWrapper>
          <OrderTypeTabs
            gap={20}
            list={orderTypeTabList}
            handleClick={(item: tabProps) => {
              setActiveOrderTab(item?.key);
            }}
          />
          <Margin>
            <p className="label">{margin}X</p>
            <Image src={ArrowIcon} width={8} height={6} alt="" />
          </Margin>
        </OrderTypeTabsWrapper>
        <Price>
          <p className="title">Price</p>
          <Input placeholder="input price" />
        </Price>
        <MarginAmount>
          <Layout>
            <p className="title">Margin</p>
            <Input placeholder="input price" />
          </Layout>
          <Layout>
            <p className="title">Amount</p>
            <Input placeholder="input price" />
          </Layout>
        </MarginAmount>
        <Slider
          value={40}
          marks={[
            {
              label: "1X",
              value: 1,
            },
            {
              label: "25X",
              value: 25,
            },
            {
              label: "50X",
              value: 50,
            },

            {
              label: "75X",
              value: 75,
            },
            {
              label: "100X",
              value: 100,
            },
          ]}
          min={1}
          max={100}
          step={25}
        />
      </Content>
      <DraggableIcon />
    </Wrapper>
  );
};
export default PerpetualPanels;
