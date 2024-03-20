"use client";
import styled from "styled-components";
import DraggableIcon from "../DraggableIcon";
import { useEffect, useState } from "react";
import Tabs from "../Tabs";
import { tabProps } from "../Tabs";
import Image from "next/image";
import ArrowIcon from "@/app/assets/header/arrow.svg";
import useCurToken from "../../hooks/useCurToken";
import Modal from "@/app/components/Modal";
import AdjustLeverage from "./AdjustLeverage";
import OpenOrder from "./OpenOrder";
import CloseOrder from "./CloseOrder";

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
  height: calc(100% - 42px);
`;
const OrderTypeTabsWrapper = styled.div`
  padding: 0 14px;

  position: relative;
`;
const OrderTypeTabs = styled(Tabs)`
  padding: 10px 0 5px 0;
  .tab {
    padding: 0px 8px 5px 0px;
  }
`;
const ScrollWrapper = styled.div`
  padding: 15px 14px 18px 14px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: calc(100% - 35px);
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: #292929;
  }
`;
const Leverage = styled.div`
  position: absolute;
  bottom: 0;
  right: 14px;

  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  background: ${(props) => props.theme.colors.border1};
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

const PerpetualPanels = () => {
  const { symbolName } = useCurToken();

  const [activeTab, setActiveTab] = useState<string>("open");
  const [activeOrderTab, setActiveOrderTab] = useState<string>("limit");
  const defaultLeverage = 5;
  const [leverage, setLeverage] = useState<number>(defaultLeverage);
  const [confirmedLeverage, setConfirmedLeverage] =
    useState<number>(defaultLeverage);

  const [margin, setMargin] = useState<string>("");

  const [visible, setVisible] = useState(false);

  const { token: curToken } = useCurToken();

  const onClose = () => {
    setVisible(false);
  };
  const actionTabList = [
    { label: "OPEN", key: "open" },
    { label: "CLOSE", key: "close" },
  ];
  const orderTypeTabList = [
    { label: "Limit", key: "limit" },
    { label: "Market", key: "market" },
  ];

  const onConfirm = () => {
    setConfirmedLeverage(leverage);
    setVisible(false);
  };
  const onCancel = () => {
    setVisible(false);
  };
  useEffect(() => {
    if (!visible) {
      setLeverage(confirmedLeverage);
    }
  }, [visible]);

  useEffect;
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
          {activeTab === "close" ? null : (
            <Leverage onClick={() => setVisible(true)}>
              <p className="label">{confirmedLeverage}X</p>
              <Image src={ArrowIcon} width={8} height={6} alt="" />
            </Leverage>
          )}
        </OrderTypeTabsWrapper>
        <ScrollWrapper>
          {activeTab === "close" ? (
            <CloseOrder
              curToken={curToken}
              leverage={confirmedLeverage}
              activeOrderTab={activeOrderTab}
              margin={margin}
              setMargin={setMargin}
              symbolName={symbolName}
            />
          ) : (
            <OpenOrder
              curToken={curToken}
              leverage={confirmedLeverage}
              activeOrderTab={activeOrderTab}
              margin={margin}
              setMargin={setMargin}
              symbolName={symbolName}
            />
          )}
        </ScrollWrapper>
      </Content>
      <DraggableIcon />
      <Modal
        onClose={onClose}
        visible={visible}
        title="Adjusting leverage"
        onConfirm={onConfirm}
        onCancel={onCancel}
      >
        <AdjustLeverage
          leverage={leverage}
          setLeverage={(v) => {
            setLeverage(v);
          }}
          max={curToken?.maxLeverage || 5}
        />
      </Modal>
    </Wrapper>
  );
};
export default PerpetualPanels;
