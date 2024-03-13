"use client";
import styled from "styled-components";
import DraggableIcon from "../DraggableIcon";
import { useState } from "react";
import Tabs from "../Tabs";
import { tabProps } from "../Tabs";

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
`;

const OrderTypeTabs = styled(Tabs)`
  padding: 10px 0 5px 0;
  .tab {
    padding: 0px 8px 5px 0px;
  }
`;
const PerpetualPanels = () => {
  const [activeTab, setActiveTab] = useState<string>("open");
  const [activeOrderTab, setActiveOrderTab] = useState<string>("limit");

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
        <OrderTypeTabs
          gap={20}
          list={orderTypeTabList}
          handleClick={(item: tabProps) => {
            setActiveOrderTab(item?.key);
          }}
        />
      </Content>
      <DraggableIcon />
    </Wrapper>
  );
};
export default PerpetualPanels;
