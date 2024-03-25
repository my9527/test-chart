"use client";
import styled from "styled-components";
import Btns from "../PerpetualPanels/Btns";
import Modal from "@/app/components/Modal";
import { useState, useEffect, useMemo } from "react";
import TokenImage from "@/app/components/TokenImage";
import Input from "@/app/components/Input";
import { useRecoilValue } from "recoil";
import { PositionType, recoilIndexPrices } from "@/app/models";
import { getExponent, filterPrecision } from "@/app/utils/tools";
import { verifyValidNumber } from "@/app/utils/tools";
import CurrencySelect from "@/app/components/CurrencySelect";
import Slider from "../Slider";
import { useTokenByFutureId, useTokenByName } from "@/app/hooks/useTokens";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import useTickerPrice from "@/app/hooks/useTickerPrice";
import dayjs from "dayjs";
import { useContractParams } from "@/app/hooks/useContractParams";
import { useAppConfig } from "@/app/hooks/useAppConfig";
import { encodeTx } from "@/app/lib/txTools";
import { useSendTxByDelegate } from "@/app/hooks/useSendTxByDelegate";
import { useIndexPrices, useIndexPricesById } from "@/app/hooks/useIndexPrices";
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
  input {
    color: ${(props) => props.theme.colors.text1};
    background: ${(props) => props.theme.colors.fill3}!important;
    border: none !important;
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
  MARKET: 'makeDecreaseMarketOrder',
  LIMIT: 'makeDecreaseLimitOrder'
}

export type ParamsProps = {
  symbolName: string;
  futureType: string;
  margin: string;
  amount: string;
  slippage?: string;
  fees: string;
  tradeFee: string;
  impactFee: string;
  price: string;
  pnl?: string;
} & PositionType;
const ClosePosition: React.FC<{
  params: ParamsProps;
  visible: boolean;
  setVisible: Function;
}> = ({ params, visible, setVisible }) => {
  
  const [price, setPrice] = useState<string>("");
  const [curType, setCurType] = useState<string>("limit");
  const [amount, setAmount] = useState<string>("");
  const [amountPercent, setAmountPercent] = useState<number>(0);
  
  const appConfig = useAppConfig();
  // const indexPrices = useIndexPrices();
  const indexPrices = useIndexPricesById(params.futureId);

  const MarketOrderContractParams = useContractParams(appConfig.contract_address.MarketOrderImplementationAddress);
  const LimitOrderContractParams = useContractParams(appConfig.contract_address.LimitOrderImplementationAddress);

  // const curToken = useTokenByName(params?.symbolName);
  const curToken = useTokenByFutureId(params.futureId);




  const { sendByDelegate } = useSendTxByDelegate();

  useEffect(() => {
    const per = +filterPrecision(+amount / +params?.tokenSize, 4);
    setAmountPercent(per > 1 ? 1 : per < 0 ? 0 : per);
  }, [amount]);

  const onClose = () => {
    setVisible(false);
  };
  const onConfirm = () => {


    async function _run() {
      const descAmount = BigNumber(amount).dividedBy(curToken.pars).toFixed(0, BigNumber.ROUND_DOWN);

      const _k =  params.isLong ? -1 : 1;
      let p = [];

      const isMarket = curType === 'market';

      if(isMarket) {
        p = [
          params.futureId,
          ethers.utils.parseUnits(
            BigNumber(indexPrices?.price || 0)
              .multipliedBy(1 + (_k * (params?.slippage  as unknown as number || 0.005)) / 100)
              .toFixed(6, BigNumber.ROUND_DOWN),
              6
          ).toString(),
          descAmount,
          +dayjs().unix() + 300,
          params.isLong ? FutureType.LONG : FutureType.SHORT
        ]
      }else {
        p = [
          params.futureId, ethers.utils.parseUnits(amount, 6).toString(), descAmount, params.isLong ? FutureType.LONG : FutureType.SHORT
        ]
      }


      const encodedData = encodeTx({
        abi: isMarket ? MarketOrderContractParams.abi : LimitOrderContractParams.abi,
        functionName: isMarket ? FuncNameMap.MARKET : FuncNameMap.LIMIT,
        args: p,
      });


      const res = await sendByDelegate({
        data: [
          isMarket ? MarketOrderContractParams.address : LimitOrderContractParams.address,
          false,
          appConfig.executionFee,
          encodedData,
        ],
        value: appConfig.executionFee,
        showMsg: false,
      })

    }
    

    _run();



    setVisible(false);
  };
  const onCancel = () => {
    setVisible(false);
  };


  const getMarketPrice = () => {
    setPrice(
      filterPrecision(
        indexPrices?.price,
        curToken?.displayDecimal
      )
    );
  };
  useEffect(() => {
    setPrice("");
  }, [curType]);

  useEffect(() => {
    if (curType === "market") {
      setPrice(
        filterPrecision(
          indexPrices?.price,
          curToken?.displayDecimal
        )
      );
    }
  }, [curType, indexPrices, params?.symbolName]);

  const amountDecimal = useMemo(() => {
    return getExponent(Number(curToken?.perpConfig?.contractSize) || 1);
  }, [curToken]);

  console.log("params", params);
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
          <p className={`future_type future_type_${params?.futureType}`}>
            {futureTypeMap[params?.futureType]}
          </p>
        </Symbol>
        <OrderInfo>
          <div className="item">
            <p className="label">Current Est. PnL</p>
            <p className="value">{}</p>
          </div>
          <div className="item">
            <p className="label">Entry price</p>
            <p className="value">{params?.entryPriceReadable}</p>
          </div>
          <div className="item">
            <p className="label">Market price</p>
            <p className="margin">{indexPrices?.price} USD</p>
          </div>
          <div className="item">
            <p className="label">Size</p>
            <p className="value">
              {params?.tokenSize} {params?.symbolName}
            </p>
          </div>
        </OrderInfo>
        <Layout>
          <p className="title">Order Price</p>
          <Input
            disabled={curType === "market"}
            value={
              curType === "market"
                ? filterPrecision(price, curToken?.displayDecimal)
                : price
            }
            onBlur={() => {
              setPrice(filterPrecision(price, curToken?.displayDecimal));
            }}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              const value = e?.currentTarget.value;

              if (value && verifyValidNumber(value, curToken?.displayDecimal))
                return;
              setPrice(value);
            }}
            placeholder="input price"
            suffix={
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
            type={BigNumber(amount).gt(params?.tokenSize) ? "warn" : "normal"}
            onBlur={() => {
              setAmount(amount ? filterPrecision(amount, amountDecimal) : "");
            }}
            placeholder="input amount"
            value={amount}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              const value = e?.currentTarget.value;
              console.log("value", value, amountDecimal);
              if (value && verifyValidNumber(value, amountDecimal)) return;

              setAmount(value);
            }}
            suffix={
              <Select showSelect={false} curCurrency={curToken?.symbolName} />
            }
          />
        </Layout>
        <StyledSlider>
          <Slider
            onChange={(value) => {
              setAmount(
                filterPrecision((value / 100) * +params?.tokenSize, amountDecimal)
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
          {" "}
          <div className="item">
            <p className="label">Slippage limit</p>
            <p className="value">{params?.slippage}%</p>
          </div>
          <div className="item">
            <p className="label">Fees</p>
            <p className="value">{params?.fees} USD</p>
          </div>
          <div className="item">
            <p className="label">--- Trading fee</p>
            <p className="value">{params?.tradeFee} USD</p>
          </div>
          <div className="item">
            <p className="label">--- Price impact fee</p>
            <p className="value">{params?.impactFee} USD</p>
          </div>
          <div className="item">
            <p className="label">Est. PnL</p>
            <p className="value">{params?.impactFee} USD</p>
          </div>
        </OrderInfo>
      </Wrapper>
    </Modal>
  );
};
export default ClosePosition;
