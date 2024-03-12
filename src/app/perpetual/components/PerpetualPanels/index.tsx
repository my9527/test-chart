"use client";
import styled from "styled-components";
import DraggableIcon from "../DraggableIcon";
import { useState } from "react";

type ActionTabsProps = {
  activeTab: string;
};
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
const ActionTabs = styled.div<ActionTabsProps>`
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  &::before {
    width: 50%;
    height: 2px;
    background-color: ${(props) => props.theme.colors.primary1};
    content: "";
    position: absolute;
    top: 0;
    transition: all 0.3s linear;
    left: ${(props) => {
      return props.activeTab === "open" ? "0" : "50%";
    }};
  }
  .tab {
    box-sizing: border-box;
    height: 41px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.reguar};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    background-color: ${(props) => props.theme.colors.fill2};
    cursor: pointer;
    transition: all 0.3s linear;
    &:hover {
      background-color: ${(props) => props.theme.colors.fill1};
    }
  }
  .active {
    background-color: ${(props) => props.theme.colors.fill1};
    color: ${(props) => props.theme.colors.primary1};
  }
`;
const Content = styled.div`
  padding: 0 14px 18px 14px;
`;
const OrderTypeTabs = styled.div`
  display: flex;
  align-items: center;
  border-bottom: ${(props) => `1px solid ${props.theme.colors.border1}`};
  padding: 10px 0 5px 0;
  .tab {
    color: ${(props) => props.theme.colors.text4};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
  }
`;
const PerpetualPanels = () => {
  const [activeTab, setActiveTab] = useState("open");
  const actionTabList = [
    { label: "OPEN", key: "open" },
    { label: "CLOSE", key: "close" },
  ];
  return (
    <Wrapper>
      <ActionTabs activeTab={activeTab}>
        {actionTabList.map((i) => {
          return (
            <div
              onClick={() => setActiveTab(i?.key)}
              key={i?.key}
              className={`tab ${activeTab === i?.key ? "active" : ""}`}
            >
              {i?.label}
            </div>
          );
        })}
      </ActionTabs>
      <Content>
        <OrderTypeTabs></OrderTypeTabs>
      </Content>
      <DraggableIcon />
    </Wrapper>
  );
};
export default PerpetualPanels;
