"use client";
import styled from "styled-components";
import Modal from "@/app/components/Modal";
import { useState, useEffect, useMemo } from "react";
import TokenImage from "@/app/components/TokenImage";
import Input from "@/app/components/Input";
import { getExponent, filterPrecision } from "@/app/utils/tools";
import { verifyValidNumber } from "@/app/utils/tools";
import CurrencySelect from "@/app/components/CurrencySelect";
import Slider from "../Slider";
import { useTokenByFutureId } from "@/app/hooks/useTokens";
import BigNumber from "bignumber.js";
import { ParamsProps } from "./AdjustMargin";
import { getLeverage } from "../../lib/getLeverage";
import { usePriceImpactK } from "../../hooks/usePriceImpactK";
import { usePriceImpactDepth } from "../../hooks/usePriceImpactDepth";
import { getTradeFee, getPriceImpactFee } from "../../lib/getFee";
import { useIndexPricesById } from "@/app/hooks/useIndexPrices";
import { getMaxProfitPrice } from "../../lib/getMaxProfitPrice";
import { ethers } from "ethers";
import dayjs from "dayjs";
import { useContractParams } from "@/app/hooks/useContractParams";
import { useAppConfig } from "@/app/hooks/useAppConfig";
import { encodeTx } from "@/app/lib/txTools";
import { useSendTxByDelegate } from "@/app/hooks/useSendTxByDelegate";
import { FutureType } from "@/app/config/common";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
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

  .input {
    color: ${(props) => props.theme.colors.text1};
    background: ${(props) => props.theme.colors.fill3} !important;
    border: 1px solid transparent;
  }
`;

const Select = styled(CurrencySelect)``;

const StyledSlider = styled.div`
  padding: 0 14px;
  margin-bottom: 15px;
`;
const StyledInput = styled(Input)`
  flex: 1;
  margin-bottom: 20px;
`;
type TypeMap = { [key: string]: string };

const futureTypeMap: TypeMap = { long: "Long", short: "Short" };

const FuncNameMap = {
  MARKET: "makeDecreaseMarketOrder",
  LIMIT: "makeDecreaseLimitOrder",
};

// export type ParamsProps = {
//   symbolName: string;
//   futureType: string;
//   margin: string;
//   amount: string;
//   slippage?: string;
//   fees: string;
//   tradeFee: string;
//   impactFee: string;
//   price: string;
//   pnl?: string;
// } & PositionType;
const ClosePosition: React.FC<{
  params: ParamsProps;
  visible: boolean;
  setVisible: Function;
}> = ({ params, visible, setVisible }) => {
  const [price, setPrice] = useState<string>("");
  const [curType, setCurType] = useState<string>("limit");
  const [amount, setAmount] = useState<string>("");
  const [inputAmount, setInputAmount] = useState<string>("");
  const [amountPercent, setAmountPercent] = useState<number>(0);
  const [isInput, setIsInput] = useState(false);

  const appConfig = useAppConfig();

  const indexPrices = useIndexPricesById(params.futureId);

  const curToken = useTokenByFutureId(params?.futureId);

  const amountDecimal = useMemo(() => {
    return getExponent(Number(curToken?.perpConfig?.contractSize) || 1);
  }, [curToken]);

  useEffect(() => {
    setInputAmount(amount);
  }, [amount]);

  useEffect(() => {
    amountPercent &&
      !isInput &&
      setAmount(
        filterPrecision(
          BigNumber(amountPercent).multipliedBy(params?.positionReadable).toString(),
          amountDecimal
        )
      );
  }, [amountPercent, isInput, amountDecimal, params?.positionReadable]);

  useEffect(() => {
    isInput && setAmountPercent(0);
  }, [isInput]);

  const MarketOrderContractParams = useContractParams(
    appConfig.contract_address.MarketOrderImplementationAddress
  );
  const LimitOrderContractParams = useContractParams(
    appConfig.contract_address.LimitOrderImplementationAddress
  );

  // const curToken = useTokenByName(params?.symbolName);

  const { sendByDelegate } = useSendTxByDelegate();

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

  useEffect(() => {
    if (curType === "market") {
      setPrice(filterPrecision(indexPrices?.price, curToken?.displayDecimal));
    }
  }, [curType, indexPrices, curToken?.symbolName]);

  const slippage = localStorage.getItem("slippage") || "0.5";

  const tradeFee = useMemo(() => {
    return getTradeFee({
      size:
        amount ||
        BigNumber(amountPercent).multipliedBy(params?.tokenSize).toString(),
      price: params?.entryPriceReadable,
      tradingFeeRatio: curToken?.tradingFeeRatio as number,
      displayDecimal: curToken?.displayDecimal,
    });
  }, [
    amount,
    amountPercent,
    params.tokenSize,
    params?.entryPriceReadable,
    curToken?.tradingFeeRatio,
    curToken?.displayDecimal,
  ]);

  const leverage = useMemo(() => {
    return getLeverage({
      size: params?.tokenSize,
      price: params?.entryPriceReadable,
      margin: params?.collateralReadable,
      pnl: params?.pnl,
      fees: params?.feesReadable,
    });
  }, [
    params?.tokenSize,
    params?.entryPriceReadable,
    params?.collateralReadable,
    params?.pnl,
    params?.feesReadable,
  ]);
  const priceImpactK = usePriceImpactK(curToken?.symbolName);
  const { buyPriceImpactDepth, sellPriceImpactDepth } = usePriceImpactDepth();

  const priceImpactFee = useMemo(() => {
    return getPriceImpactFee({
      leverage,
      margin: params?.collateralReadable,
      isLong: params?.isLong,
      displayDecimal: curToken?.displayDecimal,
      priceImpactK,
      sellPriceImpactDepth: sellPriceImpactDepth as string,
      buyPriceImpactDepth: buyPriceImpactDepth as string,
    });
  }, [
    curToken?.displayDecimal,
    params?.collateralReadable,
    leverage,
    params?.isLong,
    sellPriceImpactDepth,
    buyPriceImpactDepth,
    priceImpactK,
  ]);

  const fees = useMemo(() => {
    return BigNumber(tradeFee).plus(priceImpactFee).toString();
  }, [tradeFee, priceImpactFee]);

  const markPrice = useMemo(() => {
    return filterPrecision(indexPrices?.price, curToken?.displayDecimal);
  }, [indexPrices?.price, curToken?.displayDecimal]);

  const pnl = useMemo(() => {
    return filterPrecision(
      BigNumber(price)
        .minus(params?.entryPriceReadable)
        .multipliedBy(
          amount ||
            BigNumber(amountPercent).multipliedBy(params?.tokenSize).toString()
        )
        .minus(fees)
        .toString(),
      2
    );
  }, [
    price,
    params?.entryPriceReadable,
    amount,
    amountPercent,
    params?.tokenSize,
    fees,
  ]);

  const onClose = () => {
    setVisible(false);
  };
  const onConfirm = async () => {
    if (price && amount) {
      if (
        !BigNumber(price).gt(maxProfitPrice) &&
        !BigNumber(amount).gt(params?.tokenSize)
      ) {
        //发起交易
        const _run = async () => {
          const descAmount = BigNumber(amount)
            .dividedBy(curToken.pars)
            .toFixed(0, BigNumber.ROUND_DOWN);

            console.log("descAmount: 111", descAmount);

          const _k = params.isLong ? -1 : 1;
          let p = [];

          const isMarket = curType === "market";

          if (isMarket) {
            p = [
              params.futureId,
              ethers.utils
                .parseUnits(
                  BigNumber(indexPrices?.price || 0)
                    .multipliedBy(
                      BigNumber(_k).multipliedBy(slippage || 0.005).dividedBy(100).plus(1)
                      // 1 + (_k * ((slippage as unknown as number) || 0.005)) / 100
                    )
                    .toFixed(6, BigNumber.ROUND_DOWN),
                  6
                )
                .toString(),
              descAmount,
              +dayjs().unix() + 300,
              params.isLong ? FutureType.LONG : FutureType.SHORT,
            ];
          } else {
            p = [
              params.futureId,
              ethers.utils.parseUnits(amount, 6).toString(),
              descAmount,
              params.isLong ? FutureType.LONG : FutureType.SHORT,
            ];
          }

          const encodedData = encodeTx({
            abi: isMarket
              ? MarketOrderContractParams.abi
              : LimitOrderContractParams.abi,
            functionName: isMarket ? FuncNameMap.MARKET : FuncNameMap.LIMIT,
            args: p,
          });

          const res = await sendByDelegate({
            data: [[
              isMarket
                ? MarketOrderContractParams.address
                : LimitOrderContractParams.address,
              false,
              appConfig.executionFee,
              encodedData,
            ]],
            value: appConfig.executionFee,
            showMsg: false,
          });
        };

        await _run();

        setVisible(false);
      }
    }
  };
  const onCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (curType === "market") {
      setPrice(filterPrecision(indexPrices?.price, curToken?.displayDecimal));
    }
  }, [curType, indexPrices, curToken?.displayDecimal]);

  return (
    <Modal
      height={600}
      onClose={onClose}
      visible={visible}
      title="Close Position"
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
            <p className="label">Current Est. PnL</p>
            <p className="value">{filterPrecision(params?.pnl, 2)}</p>
          </div>
          <div className="item">
            <p className="label">Entry price</p>
            <p className="value">{params?.entryPriceReadable}</p>
          </div>
          <div className="item">
            <p className="label">Market price</p>
            <p className="margin">{markPrice} USD</p>
          </div>
          <div className="item">
            <p className="label">Size</p>
            <p className="value">
              {params?.tokenSize} {curToken?.symbolName}
            </p>
          </div>
        </OrderInfo>
        <Layout>
          <p className="title">Order Price</p>
          <Input
            type={BigNumber(price).gt(maxProfitPrice) ? "warn" : "normal"}
            disabled={curType === "market"}
            value={
              curType === "market"
                ? filterPrecision(price, curToken?.displayDecimal)
                : price
            }
            onBlur={() => {
              setPrice(
                price ? filterPrecision(price, curToken?.displayDecimal) : ""
              );
            }}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              const value = e?.currentTarget.value;

              if (value && verifyValidNumber(value, curToken?.displayDecimal))
                return;
              setPrice(value);
            }}
            placeholder="input price"
            suffixNode={
              <Select
                curCurrency={curType}
                list={["Limit", "Market"]}
                handleClick={(item: string) => {
                  setCurType(item.toLocaleLowerCase());
                }}
              />
            }
          />
        </Layout>
        <Layout>
          <p className="title">Size</p>

          <StyledInput
            type={BigNumber(amount).gt(params?.positionReadable) ? "warn" : "normal"}
            onBlur={() => {
              setAmount(amount ? filterPrecision(amount, amountDecimal) : "");
            }}
            placeholder="input amount"
            value={inputAmount}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              const value = e?.currentTarget.value;

              if (value && verifyValidNumber(value, amountDecimal)) return;

              setIsInput(true);
              setAmount(value);
            }}
            suffixNode={
              <Select showSelect={false} curCurrency={curToken?.symbolName} />
            }
          />
        </Layout>
        <StyledSlider>
          <Slider
            onChange={(value) => {
              setIsInput(false);
              setAmountPercent(
                +filterPrecision(BigNumber(value).dividedBy(100).toString(), 2)
              );
            }}
            per={amountPercent || 0}
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
        <OrderInfo>
          <div className="item">
            <p className="label">Slippage limit</p>
            <p className="value">{slippage}%</p>
          </div>
          <div className="item">
            <p className="label">Fees</p>
            <p className="value">{fees} USD</p>
          </div>
          <div className="item">
            <p className="label">--- Trading fee</p>
            <p className="value">{tradeFee} USD</p>
          </div>
          <div className="item">
            <p className="label">--- Price impact fee</p>
            <p className="value">{priceImpactFee} USD</p>
          </div>
          <div className="item">
            <p className="label">Est. PnL</p>
            <p className="value">{pnl} USD</p>
          </div>
        </OrderInfo>
      </Wrapper>
    </Modal>
  );
};
export default ClosePosition;
