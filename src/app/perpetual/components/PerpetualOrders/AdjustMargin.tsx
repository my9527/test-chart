"use client";
import styled from "styled-components";
import Tabs from "../Tabs";
import { tabProps } from "../Tabs";
import { useState, useMemo } from "react";
import Modal from "@/app/components/Modal";
import TokenImage from "@/app/components/TokenImage";
import { useTokenByFutureId, useTokenByName } from "@/app/hooks/useTokens";
import BigNumber from "bignumber.js";
import Input from "@/app/components/Input";
import { getExponent, filterPrecision } from "@/app/utils/tools";
import { verifyValidNumber } from "@/app/utils/tools";
import Slider from "../Slider";
import { useEffect } from "react";
import { getLiqPrice } from "@/app/perpetual/lib/getLiqPrice";
import { recoilOpenInterests } from "@/app/models";
import { useRecoilValue } from "recoil";
import { useExchangeBalance } from "@/app/hooks/useBalance";
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
const StyledOrderInfo = styled(OrderInfo)`
  margin-top: 20px;
`;
type TypeMap = { [key: string]: string };
export type ParamsProps = {
  futureType: string;
  margin: string;
  fundsAvailable: string;
  leverage: string;
  tokenSize: string;
  isLong: boolean;
  futureId: string;
  entryPriceReadable: string;
  collateralReadable: string;
};
const AdjustMargin: React.FC<{
  params: ParamsProps;
  visible: boolean;
  setVisible: Function;
}> = ({ params, visible, setVisible }) => {
  const [activeTypeTab, setActiveTypeTab] = useState<string>("add");
  const curToken = useTokenByFutureId(params?.futureId);
  const [margin, setMargin] = useState<string>("");
  const [marginPercent, setMarginPercent] = useState<number>(0);
  const { currentTokenAvailableLiq } = useRecoilValue(recoilOpenInterests);
  const [isMarginInput, setIsMarginInput] = useState(false);
  const balance = useExchangeBalance();

  const maxAmount = useMemo(() => {
    const v =
      Math.max(
        0,
        Math.min(
          BigNumber(
            params?.isLong
              ? currentTokenAvailableLiq?.longReadable
              : currentTokenAvailableLiq?.shortReadable
          )
            .dividedBy(curToken?.maxProfitRatio || 1)
            .toNumber(),
          +balance["USDX"]?.balanceReadable,
          BigNumber(params?.tokenSize)
            .multipliedBy(params?.entryPriceReadable)
            .minus(params?.collateralReadable)
            .minus(0.1)
            .toNumber()
        )
      ) || 0;
    return filterPrecision(v, curToken?.displayDecimal);
  }, [
    curToken?.maxProfitRatio,
    currentTokenAvailableLiq,
    params?.tokenSize,
    params?.entryPriceReadable,
    balance,
    params?.collateralReadable,
    params?.isLong,
  ]);

  const liqPriceReadable = getLiqPrice({
    size: params?.tokenSize,
    // futureId: i.futureId,
    token: curToken,
    isLong: params?.isLong,
    collateral: params?.collateralReadable,
    fees: 0,
    entryPrice: params?.entryPriceReadable,
  });

  useEffect(() => {
    !isMarginInput &&
      curToken?.displayDecimal &&
      marginPercent &&
      maxAmount &&
      setMargin(
        filterPrecision(
          BigNumber(marginPercent).multipliedBy(maxAmount).toString(),
          curToken?.displayDecimal
        )
      );
  }, [marginPercent, curToken, isMarginInput, maxAmount]);

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
          <TokenImage name={curToken?.symbolName} width={20} height={20} />
          <p className="symbol_name">{curToken?.symbolName}USD</p>
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
              setMarginPercent(0);
              setIsMarginInput(true);
            }}
          />
        </Layout>
        <MaxAmount>
          <p className="label">Max adjustment amount</p>
          <p className="value">{maxAmount} USD</p>
        </MaxAmount>
        <Slider
          onChange={(value) => {
            setIsMarginInput(false);
            setMarginPercent(BigNumber(value).dividedBy(100).toNumber());
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
            <p className="value">{}X</p>
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
