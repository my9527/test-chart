"use client";
import styled from "styled-components";
import Tabs from "../Tabs";
import { tabProps } from "../Tabs";
import { useState } from "react";
import Modal from "@/app/components/Modal";
import TokenImage from "@/app/components/TokenImage";
import { useTokenByName } from "@/app/hooks/useTokens";
import BigNumber from "bignumber.js";
import Input from "@/app/components/Input";
import { getExponent, filterPrecision } from "@/app/utils/tools";
import { verifyValidNumber } from "@/app/utils/tools";
import Slider from "../Slider";
import { useEffect } from "react";
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const TypeTabs = styled(Tabs)`
  padding: 10px 0 10px 0;
  .tab {
    padding: 0px;
  }
`;
const Symbol = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  .symbol_name {
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.header2};
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
  }
  .future_type {
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.small};
    font-style: normal;
    font-weight: 400;
    line-height: 120%;
  }
  .future_type_long {
    color: ${(props) => props.theme.colors.text2};
  }
  .future_type_short {
    color: ${(props) => props.theme.colors.text5};
  }
  img {
    border-radius: 50%;
  }
`;
const OrderInfo = styled.div`
  border-radius: 8px;
  background: ${(props) => props.theme.colors.fill3};
  padding: 11px 13px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    .label {
      color: ${(props) => props.theme.colors.text4};
    }
    .value {
      color: ${(props) => props.theme.colors.text1};
    }
    .margin {
      color: ${(props) => props.theme.colors.primary1};
    }
  }
`;
const Layout = styled.div`
  .title {
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
    margin-bottom: 5px;
  }
  input {
    color: ${(props) => props.theme.colors.text1};
    background: ${(props) => props.theme.colors.fill3} !important;
    border: none !important;
  }
`;
const MaxAmount = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: Arial;
  font-size: ${(props) => props.theme.fontSize.min};
  font-style: normal;
  font-weight: 400;
  line-height: 120%; /* 12px */
  .label {
    color: ${(props) => props.theme.colors.text4};
  }
  .value {
    color: ${(props) => props.theme.colors.text1};
  }
`;
const StyledOrderInfo=styled(OrderInfo)`margin-top:20px;`
type TypeMap = { [key: string]: string };
export type ParamsProps = {
  symbolName: string;
  futureType: string;
  margin: string;
  fundsAvailable: string;
  leverage: number;
};
const AdjustMargin: React.FC<{ params: ParamsProps; isVisible: boolean }> = ({
  isVisible = false,
  params,
}) => {
  const [visible, setVisible] = useState(isVisible);
  const [activeTypeTab, setActiveTypeTab] = useState<string>("add");
  const curToken = useTokenByName(params?.symbolName);
  const [margin, setMargin] = useState<string>("");
  const [marginPercent, setMarginPercent] = useState<number>(0);

  const typeTabList = [
    { label: "Add Margin", key: "add" },
    { label: "Reduce Margin", key: "reduce" },
  ];
  const futureTypeMap: TypeMap = { long: "Long", short: "Short" };
  const actionTypeMap: TypeMap = {
    add: "Add margin",
    reduce: "Reduce margin",
  };
  const onClose = () => {
    setVisible(false);
  };
  const onConfirm = () => {
    setVisible(false);
  };
  const onCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    const per = filterPrecision(
      BigNumber(margin).dividedBy(params?.fundsAvailable).toString(),
      2
    );
    setMarginPercent(+per > 1 ? 1 : +per);
  }, [margin, params?.fundsAvailable]);

  return (
    <Modal
      height={600}
      onClose={onClose}
      visible={visible}
      title="Adjust Margin"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <Wrapper>
        <TypeTabs
          gap={20}
          list={typeTabList}
          handleClick={(item: tabProps) => {
            setActiveTypeTab(item?.key);
          }}
        />
        <Symbol>
          <TokenImage name={params?.symbolName} width={20} height={20} />
          <p className="symbol_name">{params?.symbolName}USD</p>
          <p className={`future_type future_type_${params?.futureType}`}>
            {futureTypeMap[params?.futureType]}
            &nbsp;
            {params?.leverage}X
          </p>
        </Symbol>
        <OrderInfo>
          <div className="item">
            <p className="label">Liq. price</p>
            <p className="value">{}</p>
          </div>
          <div className="item">
            <p className="label">Max profit price</p>
            <p className="value">{}</p>
          </div>
        </OrderInfo>
        <Layout>
          <p className="title">{actionTypeMap[activeTypeTab]}</p>
          <Input
            type={
              (margin && BigNumber(margin).gt(params?.fundsAvailable)) ||
              BigNumber(margin).lt(0)
                ? "warn"
                : "normal"
            }
            placeholder="input margin"
            value={margin}
            onBlur={() => {
              setMargin(
                margin ? filterPrecision(margin, curToken?.displayDecimal) : ""
              );
            }}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              const value = e?.currentTarget.value;

              if (value && verifyValidNumber(value, curToken?.displayDecimal)) {
                return;
              }

              setMargin(value);
            }}
          />
        </Layout>
        <MaxAmount>
          <p className="label">Max adjustment amount</p>
          <p className="value">{params?.fundsAvailable}</p>
        </MaxAmount>
        <Slider
          onChange={(value) => {
            setMargin(
              filterPrecision(
                (value / 100) * +params?.fundsAvailable,
                curToken?.displayDecimal
              )
            );
          }}
          per={marginPercent || 0}
          marks={[
            {
              label: "",
              value: 0,
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
          min={0}
          max={100}
          step={25}
          unit="%"
        />
        <StyledOrderInfo>
          <div className="item">
            <p className="label">Leverage after adjust</p>
            <p className="value">{}</p>
          </div>
          <div className="item">
            <p className="label">Liq. price after adjust</p>
            <p className="value">{}</p>
          </div>
          <div className="item">
            <p className="label">Max profit price after adjust</p>
            <p className="value">{}</p>
          </div>
        </StyledOrderInfo>
      </Wrapper>
    </Modal>
  );
};
export default AdjustMargin;
