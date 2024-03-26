"use client";
import styled from "styled-components";
import { useEffect, useState, useMemo } from "react";
import Modal from "@/app/components/Modal";
import TokenImage from "@/app/components/TokenImage";
import { useTokenByFutureId } from "@/app/hooks/useTokens";
import BigNumber from "bignumber.js";
import Input from "@/app/components/Input";
import { getExponent, filterPrecision } from "@/app/utils/tools";
import { verifyValidNumber } from "@/app/utils/tools";
import Slider from "../Slider";
import { ParamsProps } from "./AdjustMargin";
import { useIndexPricesById } from "@/app/hooks/useIndexPrices";
import { getMaxProfitPrice } from "../../lib/getMaxProfitPrice";
import CheckBox from "@/app/components/CheckBox";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 10px;
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
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 14px;
  .title {
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
  }
`;
const StopContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  .suffix {
    color: var(--Quenta--FFFFFF, var(--text1, #fff));
    text-align: right;
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    display: flex;
    align-items: center;
    gap: 6px;
    .line {
      width: 1px;
      height: 14px;
      background: ${(props) => props.theme.colors.borde1};
    }
  }
  .tips {
    color: ${(props) => props.theme.colors.text4};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.min};
    font-style: normal;
    font-weight: 400;
    line-height: 120%;
    .price {
      color: ${(props) => props.theme.colors.text1};
    }
    .pnl {
      color: ${(props) => props.theme.colors.text2};
    }
  }

  .input {
    color: ${(props) => props.theme.colors.text1};
    background: ${(props) => props.theme.colors.fill3} !important;
    border: 1px solid transparent;
  }
`;
const StyledSlider = styled.div`
  padding: 0 14px;
  margin-top: 15px;
  margin-bottom: 5px;
`;

type TypeMap = { [key: string]: string };

const StopOrdersModal: React.FC<{
  params: ParamsProps;
  visible: boolean;
  setVisible: Function;
}> = ({ params, visible, setVisible }) => {
  const curToken = useTokenByFutureId(params?.futureId);
  const futureTypeMap: TypeMap = { long: "Long", short: "Short" };
  const [showTakeProfit, setShowTakeProfit] = useState(false);
  const [showStopLoss, setShowStopLoss] = useState(false);
  const [takeProfitPrice, setTakeProfitPrice] = useState("");

  const [takeProfitAmount, setTakeProfitAmount] = useState<string>("");
  const [takeProfitAmountPercent, setTakeProfitAmountPercent] =
    useState<number>(0);
  const [takeProfitInputAmount, setTakeProfitInputAmount] =
    useState<string>("");
  const [takeProfitIsInput, setTakeProfitIsInput] = useState(false);

  const indexPrices = useIndexPricesById(params.futureId);
  const markPrice = useMemo(() => {
    return filterPrecision(indexPrices?.price, curToken?.displayDecimal);
  }, [indexPrices?.price, curToken?.displayDecimal]);

  const amountDecimal = useMemo(() => {
    return getExponent(Number(curToken?.perpConfig?.contractSize) || 1);
  }, [curToken]);

  useEffect(() => {
    setTakeProfitInputAmount(takeProfitAmount);
  }, [takeProfitAmount]);

  useEffect(() => {
    takeProfitAmountPercent &&
      !takeProfitIsInput &&
      setTakeProfitAmount(
        filterPrecision(
          BigNumber(takeProfitAmountPercent)
            .multipliedBy(params?.tokenSize)
            .toString(),
          amountDecimal
        )
      );
  }, [
    takeProfitAmountPercent,
    takeProfitIsInput,
    amountDecimal,
    params?.tokenSize,
  ]);

  const maxProfitPrice = useMemo(() => {
    return getMaxProfitPrice({
      margin: params?.collateralReadable,
      maxProfitRatio: curToken?.maxProfitRatio || 1,
      isLong: params?.isLong,
      price: params?.entryPriceReadable,
      size: params?.tokenSize,
      displayDecimal: curToken?.displayDecimal,
    });
  }, [
    curToken?.maxProfitRatio,
    params?.collateralReadable,
    params?.tokenSize,
    params?.entryPriceReadable,
    curToken?.displayDecimal,
    params?.isLong,
  ]);

  const takeProfitPnl = useMemo(() => {
    return filterPrecision(
      BigNumber(takeProfitPrice)
        .minus(params?.entryPriceReadable)
        .multipliedBy(takeProfitAmount)
        .toString(),
      2
    );
  }, [takeProfitPrice, params?.entryPriceReadable, takeProfitAmount]);

  useEffect(() => {
    takeProfitIsInput && setTakeProfitAmountPercent(0);
  }, [takeProfitIsInput]);

  const onCancel = () => {
    setVisible(false);
  };
  const onClose = () => {
    setVisible(false);
  };
  const onConfirm = () => {
    setVisible(false);
  };
  return (
    <Modal
      height={600}
      onClose={onClose}
      visible={visible}
      title="Stop Orders"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <Wrapper>
        <Symbol>
          <TokenImage name={curToken?.symbolName} width={20} height={20} />
          <p className="symbol_name">{curToken?.symbolName}USD</p>
          <p
            className={`future_type future_type_${
              params?.isLong ? "long" : "short"
            }`}
          >
            {futureTypeMap[params?.isLong ? "long" : "short"]}
          </p>
        </Symbol>
        <OrderInfo>
          <div className="item">
            <p className="label">Entry price</p>
            <p className="value">{params?.entryPriceReadable}</p>
          </div>
          <div className="item">
            <p className="label">Market price</p>
            <p className="value">{markPrice} USD</p>
          </div>
          <div className="item">
            <p className="label">Est. liq. price</p>
            <p className="value">{params?.liqPrice}</p>
          </div>
          <div className="item">
            <p className="label">Max profit price</p>
            <p className="value">{params?.liqPrice}</p>
          </div>
          <div className="item">
            <p className="label">Size</p>
            <p className="value">
              {params?.tokenSize} {curToken?.symbolName}
            </p>
          </div>
        </OrderInfo>
        <Layout>
          <CheckBox
            handleClick={() => {
              setShowTakeProfit(!showTakeProfit);
            }}
          />
          <p className="title">Take Profit</p>
        </Layout>
        {showTakeProfit && (
          <StopContent>
            <Input
              type={
                BigNumber(takeProfitPrice).gt(maxProfitPrice)
                  ? "warn"
                  : "normal"
              }
              value={takeProfitPrice}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                const value = e?.currentTarget.value;

                if (value && verifyValidNumber(value, curToken?.displayDecimal))
                  return;

                setTakeProfitPrice(value);
              }}
              placeholder="TP Trigger Price"
            />

            <div className="tips">
              When the price reaches 
              <span className="price">{takeProfitPrice}</span>, the order will
              trigger, and your est. pnl will be 
              <span className="pnl">{takeProfitPnl}</span> USD.
            </div>
            <Input
              type={
                BigNumber(takeProfitInputAmount).gt(params?.tokenSize)
                  ? "warn"
                  : "normal"
              }
              value={takeProfitInputAmount}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                const value = e?.currentTarget.value;

                if (value && verifyValidNumber(value, amountDecimal)) return;
                setTakeProfitIsInput(true);
                setTakeProfitAmount(value);
              }}
              placeholder="Size"
            />
            <StyledSlider>
              <Slider
                onChange={(value) => {
                  setTakeProfitIsInput(false);
                  setTakeProfitAmountPercent(
                    +filterPrecision(
                      BigNumber(value).dividedBy(100).toString(),
                      curToken?.displayDecimal
                    )
                  );
                }}
                per={takeProfitAmountPercent || 0}
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
            </StyledSlider>
          </StopContent>
        )}
        <Layout>
          <CheckBox
            handleClick={() => {
              setShowStopLoss(!showStopLoss);
            }}
          />
          <p className="title">Stop Loss</p>
        </Layout>
      </Wrapper>
    </Modal>
  );
};
export default StopOrdersModal;
