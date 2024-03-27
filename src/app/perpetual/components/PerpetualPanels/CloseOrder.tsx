"use client";
import styled from "styled-components";
import Price from "./Price";
import CurrencySelect from "@/app/components/CurrencySelect";
import Button from "../Button";
import Slider from "../Slider";
import { Token } from "@/app/config/tokens";
import { useEffect, useState, useRef, useMemo } from "react";
import Input from "@/app/components/Input";
import { verifyValidNumber } from "@/app/utils/tools";
import {
  filterPrecision,
  getExponent,
  filterThousands,
} from "@/app/utils/tools";
import Btns from "./Btns";
import Modal from "@/app/components/Modal";
import OrderConfirm from "./OrderConfirm";
// import { ParamsProps } from "./OrderConfirm";
import { ParamsProps } from "../PerpetualOrders/AdjustMargin";
import BigNumber from "bignumber.js";
import { BasicTradingFeeRatio, FutureType } from "@/app/config/common";
import { useTokenByName } from "@/app/hooks/useTokens";
import { usePositionsById } from "@/app/hooks/usePositions";
import { ethers } from "ethers";
import dayjs from "dayjs";
import { getMaxProfitPrice } from "../../lib/getMaxProfitPrice";
import { useIndexPricesById } from "@/app/hooks/useIndexPrices";
import { useContractParams } from "@/app/hooks/useContractParams";
import { useAppConfig } from "@/app/hooks/useAppConfig";
import { encodeTx } from "@/app/lib/txTools";
import { useSendTxByDelegate } from "@/app/hooks/useSendTxByDelegate";
const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 15px;
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
  .input_area {
    display: flex;
    align-items: center;
    gap: 20px;
  }
`;
const StyledInput = styled(Input)`
  flex: 1;
`;
const StyledCurrencySelect = styled(CurrencySelect)`
  border-radius: 8px;
  background: ${(props) => props.theme.colors.fill2};

  border: ${[(props) => `1px solid transparent`]};
  .cur_currency {
    padding: 0;
    width: 90px;
    height: 41px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .currency_list {
    top: 43px;
  }
  &:hover,
  &:active {
    border: ${[(props) => `1px solid ${props.theme.colors.primary1}`]};
  }
`;
const Data = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
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
  color: ${(props) => props.theme.colors.text1};
`;
const EstPosition = styled.p`
  color: ${(props) => props.theme.colors.text1};
  font-family: Arial;
  font-size: ${(props) => props.theme.fontSize.min};
  font-style: normal;
  font-weight: 700;
  line-height: 100%;
  text-transform: uppercase;
`;
const DefaultBtn = styled.div`
  border-radius: 40px;
  background: ${(props) => props.theme.colors.fill2};
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.text4};
  font-family: Arial;
  font-size: ${(props) => props.theme.fontSize.medium};
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
  padding: 13px 0;
`;
const EstPnl = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  .item {
    display: flex;
    align-items: center;
    flex: 1;
    text-align: left;

    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 100%;

    .long {
      color: ${(props) => props.theme.colors.text2};
    }
    .short {
      color: ${(props) => props.theme.colors.text5};
    }
  }
`;

const FuncNameMap = {
  MARKET: "makeDecreaseMarketOrder",
  LIMIT: "makeDecreaseLimitOrder",
};

const CloseOrder: React.FC<{
  activeOrderTab: string;
  margin: string;
  setMargin: Function;
  symbolName: string;
  leverage: string;
  curToken: Token;
  entryPrice: number;
}> = ({
  activeOrderTab,
  margin,
  setMargin,
  symbolName,
  leverage,
  curToken,
  entryPrice,
}) => {
  const [price, setPrice] = useState<string>("");
  const [amountPercent, setAmountPercent] = useState<number>(0);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [inputType, setInputType] = useState("normal");
  const [clickType, setClickType] = useState("");

  const { sendByDelegate } = useSendTxByDelegate();

  const slippage = localStorage.getItem("slippage") || "0.005";

  const appConfig = useAppConfig();

  const MarketOrderContractParams = useContractParams(
    appConfig.contract_address.MarketOrderImplementationAddress
  );
  const LimitOrderContractParams = useContractParams(
    appConfig.contract_address.LimitOrderImplementationAddress
  );

  // futureLongId = futureShortId 时只需一个，如果不等，那么应该分别获取
  const positions = usePositionsById(curToken.futureLongId);

  // const [shortPositionI, longPositionI] = positions.sort(po => po.isLong ? 1 : -1);
  const longPositions = positions.filter(po => po.isLong)[0];
  const shortPositions = positions.filter(po => !po.isLong)[0];
  

  const longPosition = longPositions?.positionReadable || 0;
  const shortPosition = shortPositions?.positionReadable || 0;

  const indexPrices = useIndexPricesById(curToken.futureLongId);

  const [visible, setVisible] = useState(false);
  const [confirmedParams, setConfirmedParams] = useState<
    ParamsProps
  >();
  const onClose = () => {
    setVisible(false);
  };
  const onConfirm1 = () => {




    setVisible(false);
  };
  const maxProfitPrice = useMemo(() => {
    // getMaxProfitPrice
    return getMaxProfitPrice({
      margin: confirmedParams?.collateralReadable || '0',
      maxProfitRatio: curToken?.maxProfitRatio || 1,
      isLong: !!confirmedParams?.isLong,
      price: confirmedParams?.entryPriceReadable as string,
      size: confirmedParams?.tokenSize as string,
      displayDecimal: curToken?.displayDecimal,
    });
  }, [
    curToken?.maxProfitRatio,
    confirmedParams?.collateralReadable,
    confirmedParams?.tokenSize,
    confirmedParams?.entryPriceReadable,
    curToken?.displayDecimal,
    confirmedParams?.isLong,
  ]);

  const onConfirm = async () => {
    
    const amountToClose = confirmedParams?.isLong ? longAmount:shortAmount;

    if (price && amountToClose) {
      if (
        !BigNumber(price).gt(maxProfitPrice) &&
        !BigNumber(amountToClose).gt(confirmedParams?.positionReadable || '0')
      ) {
        //发起交易
        const _run = async () => {
          const descAmount = BigNumber(amountToClose)
            .dividedBy(curToken.pars)
            .toFixed(0, BigNumber.ROUND_DOWN);

            console.log("descAmount", descAmount);

          const _k = confirmedParams?.isLong ? -1 : 1;
          let p = [];

          const isMarket = activeOrderTab === "market";

          if (isMarket) {
            p = [
              confirmedParams?.futureId,
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
              confirmedParams?.isLong ? FutureType.LONG : FutureType.SHORT,
            ];
          } else {
            p = [
              confirmedParams?.futureId,
              ethers.utils.parseUnits(amountToClose, 6).toString(),
              descAmount,
              confirmedParams?.isLong ? FutureType.LONG : FutureType.SHORT,
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
    amountPercent && setInputAmount("");
  }, [amountPercent]);

  useEffect(() => {
    inputAmount && setAmountPercent(0);
  }, [inputAmount]);

  useEffect(() => {
    if (clickType && inputAmount) {
      if (clickType === "long") {
        setInputType(BigNumber(inputAmount).gt(longPosition) ? "warn" : "normal");
      }
      if (clickType === "short") {
        setInputType( BigNumber(inputAmount).gt(shortPosition)? "warn" : "normal");
      }
    }
  }, [inputAmount, clickType, longPosition, shortPosition]);


  const longAmount = useMemo(() => {

    return  inputAmount || BigNumber(amountPercent).multipliedBy(longPosition).toString();

  }, [amountPercent, longPosition, inputAmount]);

  const shortAmount = useMemo(() => {

    return  inputAmount || BigNumber(amountPercent).multipliedBy(shortPosition).toString();

  }, [amountPercent, shortPosition, inputAmount]);

  const handleClose = (type: string) => {

    setClickType(type);
    const targetPos = type === 'long' ? longPositions : shortPositions;
    let _amount: string | number = '0';
    if (type === "long") {
      // _amount = +inputAmount || amountPercent * longPosition;
      // _amount = +inputAmount || BigNumber(amountPercent).multipliedBy(longPosition).toNumber();
      _amount = longAmount;
      setInputType(BigNumber(inputAmount).gt(longPosition) ? "warn" : "normal");
    }
    if (type === "short") {
      // _amount = +inputAmount || amountPercent * shortPosition;
      // _amount = +inputAmount || BigNumber(amountPercent).multipliedBy(shortPosition).toNumber();
      _amount = shortAmount;
      setInputType(BigNumber(inputAmount).gt(shortPosition) ? "warn" : "normal");
    }

    const tradeFee = filterPrecision(
      // BigNumber(+price * +_amount * 0.0008).toString(),
      BigNumber(price)
        .multipliedBy(_amount)
        .multipliedBy(curToken.tradingFeeRatio || BasicTradingFeeRatio)
        .div(100)
        .toString(),
      curToken?.displayDecimal
    );
    const impactFee = "0";
    const params = {
      symbolName,
      price,
      margin,
      amount: BigNumber(_amount).toString(),
      futureType: type,
      orderType: activeOrderTab,
      tradeFee,
      impactFee,
      fees: tradeFee + impactFee,
      pnl: "",
      liqPrice: '',
      feesReadable: '',
      ...targetPos,
    };
    console.log("handleClose", params);
    setConfirmedParams(params);
    const show = localStorage.getItem("showAgain_open");
    if (show === "true") {
      setVisible(true);
    }
  };

  const longPnl = useMemo(() => {
    // const _amount = +inputAmount || amountPercent * longPosition;
    // const _amount = +inputAmount || BigNumber(amountPercent).multipliedBy(longPosition).toString()
    const _amount = longAmount;

    return filterPrecision(
      BigNumber(price).minus(entryPrice).multipliedBy(_amount).toString(),
      curToken?.displayDecimal
    );
  }, [entryPrice, price, inputAmount, amountPercent, longPosition, longAmount]);

  const shortPnl = useMemo(() => {
    // const _amount = +inputAmount || BigNumber(amountPercent).multipliedBy(shortPosition).toString();
    const _amount = shortAmount;
    return filterPrecision(
      BigNumber(entryPrice).minus(price).multipliedBy(_amount).toString(),
      curToken?.displayDecimal
    );
  }, [entryPrice, price, inputAmount, amountPercent, shortPosition, shortAmount]);

  return (
    <>
      <Price
        displayDecimal={curToken?.displayDecimal}
        symbolName={symbolName}
        price={price}
        setPrice={setPrice}
        activeOrderTab={activeOrderTab}
      />
      <Layout>
        <p className="title">Amount</p>
        <div className="input_area">
          <StyledInput
            type={inputType}
            placeholder="input amount"
            value={inputAmount}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              const value = e?.currentTarget.value;

              if (value && verifyValidNumber(value, curToken?.displayDecimal))
                return;

              setInputAmount(value);
            }}
          />
          <StyledCurrencySelect showSelect={false} curCurrency={symbolName} />
        </div>
      </Layout>
      <Slider
        onChange={(value) => {
          setAmountPercent(
            +filterPrecision(
              BigNumber(value).dividedBy(100).toString(),
              curToken?.displayDecimal
            )
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
      <Data>
        <DataItem>
          <p>Long Position:</p>
          <p>{longPosition} USD</p>
        </DataItem>
        <DataItem>
          <p>Short Position:</p>
          <p>{shortPosition} USD</p>
        </DataItem>
      </Data>
      {price && (inputAmount || amountPercent) ? (
        <Btns
          handleClick={handleClose}
          longBtnText="CLOSE LONG"
          shortBtnText="CLOSE SHORT"
          showIcon={false}
          longSuffixChildren={
            inputAmount || amountPercent ? (
              <EstPosition>
                ≈{longAmount} {symbolName}
              </EstPosition>
            ) : null
          }
          shortSuffixChildren={
            inputAmount || amountPercent ? (
              <EstPosition>
                ≈{shortAmount} {symbolName}
              </EstPosition>
            ) : null
          }
        />
      ) : (
        <DefaultBtn>Please enter the price</DefaultBtn>
      )}
      {price && (inputAmount || amountPercent) && (
        <EstPnl>
          <div className="item">
            Est.pnl:&nbsp;
            <p className={`${BigNumber(longPnl).gt(0) ? "long" : "short"}`}>
              {longPnl} USD
            </p>
          </div>
          <div className="item">
            Est.pnl:&nbsp;
            <p className={`${BigNumber(shortPnl).gt(0) ? "long" : "short"}`}>
              {shortPnl} USD
            </p>
          </div>
        </EstPnl>
      )}
      <Modal
        height={500}
        onClose={onClose}
        visible={visible}
        title="Close Position"
        onConfirm={onConfirm}
        onCancel={onCancel}
      >
        {confirmedParams && (
          // @ts-ignore
          <OrderConfirm params={confirmedParams} actionType="close" />
        )}
      </Modal>
    </>
  );
};
export default CloseOrder;
