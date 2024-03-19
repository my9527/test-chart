"use client";
import styled from "styled-components";
import DraggableIcon from "../DraggableIcon";
import { useEffect, useState } from "react";
import Tabs from "../Tabs";
import { tabProps } from "../Tabs";
import Slider from "../Slider";
import Image from "next/image";
import ArrowIcon from "@/app/assets/header/arrow.svg";
import CheckBox from "@/app/components/CheckBox";
import Input from "@/app/components/Input";
import CurrencySelect from "@/app/components/CurrencySelect";
import useCurToken from "../../hooks/useCurToken";
import Button from "../Button";
import LongIcon from "@/app/assets/perpetual/long.svg";
import ShortIcon from "@/app/assets/perpetual/short.svg";
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
  top: 50%;
  right: 14px;
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 14px;
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
  }
`;

const Price = styled(Layout)`
  .market {
    color: ${(props) => props.theme.colors.primary1};
    text-align: right;
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    cursor: pointer;
    padding: 0 8px;
  }
`;
const MarginAmount = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
  .unit {
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    padding-right: 8px;
  }
`;
const StyledLayout = styled(Layout)`
  flex: 1;
`;
const StyledCurrencySelect = styled(CurrencySelect)`
  padding: 0 4px;
  border-radius: 2px;
  background: ${(props) => props.theme.colors.fill2};
`;
const DataItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: Arial;
  font-size: ${(props) => props.theme.fontSize.small};
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
  .label {
    color: ${(props) => props.theme.colors.text4};
  }
  .value {
    color: ${(props) => props.theme.colors.text1};
  }
`;
const Data = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
`;
const StopOrder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  .title_area {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title_text {
      color: ${(props) => props.theme.colors.text1};
      font-family: Arial;
      font-size: ${(props) => props.theme.fontSize.medium};
      font-style: normal;
      font-weight: 400;
      line-height: 100%;
    }
  }
  .input_area {
    display: flex;
    align-items: center;
    gap: 20px;
    .item {
      display: flex;
      flex-direction: column;
      gap: 5px;
      .pnl {
        color: ${(props) => props.theme.colors.text1};
        font-family: Arial;
        font-size: ${(props) => props.theme.fontSize.small};
        font-style: normal;
        font-weight: 400;
        line-height: 120%;
        .long {
          color: ${(props) => props.theme.colors.text2};
        }
        .short {
          color: ${(props) => props.theme.colors.text5};
        }
      }
    }

    .unit {
      color: ${(props) => props.theme.colors.text1};
      font-family: Arial;
      font-size: ${(props) => props.theme.fontSize.medium};
      font-style: normal;
      font-weight: 400;
      line-height: 100%;
      padding-right: 8px;
    }
  }
`;
const Fee = styled(DataItem)`
  position: relative;
  & > .label {
    cursor: pointer;
    &:hover {
      color: ${(props) => props.theme.colors.primary1};
      .content {
        display: block;
      }
    }
  }

  .content {
    transition: all 0.3s linear;
    display: none;
    position: absolute;
    top: 15px;
    left: 0;
    right: 0;
    padding: 27px 20px;

    border-radius: 8px;
    border: ${(props) => `1px solid ${props.theme.colors.fill2}`};
    background: ${(props) => props.theme.colors.fill2};
    .upgrade_item {
      margin-bottom: 16px;
    }
    .upgrade {
      color: ${(props) => props.theme.colors.primary1};
      cursor: pointer;
    }
  }
`;
const Btns = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  img {
    width: 25px;
    height: 18px;
    flex-shrink: 0;
    margin-right: 14px;
  }
`;

const PerpetualPanels = () => {
  const { symbolName } = useCurToken();
  const [curCurrency, setCurCurrency] = useState("USD");

  const [activeTab, setActiveTab] = useState<string>("open");
  const [activeOrderTab, setActiveOrderTab] = useState<string>("limit");
  const defaultLeverage = 5;
  const [leverage, setLeverage] = useState<number>(defaultLeverage);
  const [confirmedLeverage, setConfirmedLeverage] =
    useState<number>(defaultLeverage);
  const [price, setPrice] = useState<string>("");
  const [margin, setMargin] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
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
          {/* <Price>
            <p className="title">Price</p>
            <Input
              disabled={activeOrderTab === "market"}
              value={price}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setPrice(+e?.currentTarget.value || undefined);
              }}
              placeholder="input price"
              suffix={
                activeOrderTab === "market" ? (
                  <div className="market" onClick={getMarketPrice}>
                    market
                  </div>
                ) : null
              }
            />
          </Price>
          <MarginAmount>
            <StyledLayout>
              <div className="title">
                Margin
                <div className="unit">USD</div>
              </div>
              <Input
                placeholder="input margin"
                value={margin}
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                  SetMargin(+e?.currentTarget.value || undefined);
                }}
              />
            </StyledLayout>
            <StyledLayout>
              <div className="title">
                Amount
                <StyledCurrencySelect
                  curCurrency={curCurrency}
                  list={["USD", symbolName]}
                  handleClick={(item: string) => {
                    setCurCurrency(item);
                  }}
                />
              </div>
              <Input
                placeholder="input amount"
                value={amount}
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                  SetAmount(+e?.currentTarget.value || undefined);
                }}
              />
            </StyledLayout>
          </MarginAmount>
          <Slider
            value={40}
            marks={[
              {
                label: "",
                value: 1,
              },
              {
                label: "",
                value: 25,
              },
              {
                label: "",
                value: 50,
              },

              {
                label: "",
                value: 75,
              },
              {
                label: "",
                value: 100,
              },
            ]}
            min={1}
            max={100}
            step={25}
            unit="%"
          />
          <Data>
            <DataItem className="item">
              <p className="label">Funds Available</p>
              <p className="value">{fundsAvailable} USD</p>
            </DataItem>
            <DataItem className="item">
              <p className="label">Max Long</p>
              <p className="value">2000.00 USD</p>
            </DataItem>
            <DataItem className="item">
              <p className="label">Max Short</p>
              <p className="value">2000.00 USD</p>
            </DataItem>
          </Data>
          <StopOrder>
            <div className="title_area">
              <p className="title_text">Stop Order</p>
              <CheckBox handleClick={() => setShowStopOrder(true)} />
            </div>
            {showStopOrder && (
              <div className="input_area">
                <div className="item">
                  <Input
                    value={price}
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                      setPrice(+e?.currentTarget.value || undefined);
                    }}
                    placeholder="TP Trigger Price"
                    suffix={<div className="unit">USD</div>}
                  />
                  <div className="pnl">
                    Est.pnl:<span className="long">{"+6666.00"}USD</span>
                  </div>
                </div>
                <div className="item">
                  <Input
                    value={price}
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                      setPrice(+e?.currentTarget.value || undefined);
                    }}
                    placeholder="SL Trigger Price"
                    suffix={<div className="unit">USD</div>}
                  />
                  <div className="pnl">
                    Est.pnl:<span className="short">{"+6666.00"}USD</span>
                  </div>
                </div>
              </div>
            )}
          </StopOrder>
          <DataItem className="item">
            <p className="label">Slippage tolerance</p>
            <p className="value">0.5%</p>
          </DataItem>
          <Fee>
            <p className="label">
              Fee
              <div className="content">
                <DataItem className="item upgrade_item">
                  <p className="label">VIP Level:Tier</p>
                  <p className="value upgrade">upgrade</p>
                </DataItem>
                <DataItem className="item">
                  <p className="label">Fee discount</p>
                  <p className="value">20%</p>
                </DataItem>
              </div>
            </p>
            <p className="value">0.05%</p>
          </Fee>
          <Btns>
            <Button type="long" btnText="LONG">
              <Image src={LongIcon} alt="" width={25} height={18} />
            </Button>
            <Button type="short" btnText="SHORT">
              <Image src={ShortIcon} alt="" width={25} height={18} />
            </Button>
          </Btns> */}
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
