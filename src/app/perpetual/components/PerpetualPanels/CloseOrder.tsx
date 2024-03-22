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
import { ParamsProps } from "./OrderConfirm";
import BigNumber from "bignumber.js";
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
  const longPosition = 2323;
  const shortPosition = 2003;

  const [visible, setVisible] = useState(false);
  const [confirmedParams, setConfirmedParams] = useState<
    ParamsProps | undefined
  >();
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
    amountPercent && setInputAmount("");
  }, [amountPercent]);

  useEffect(() => {
    inputAmount && setAmountPercent(0);
  }, [inputAmount]);

  useEffect(() => {
    if (clickType && inputAmount) {
      if (clickType === "long") {
        setInputType(+inputAmount > longPosition ? "warn" : "normal");
      }
      if (clickType === "short") {
        setInputType(+inputAmount > shortPosition ? "warn" : "normal");
      }
    }
  }, [inputAmount, clickType, longPosition, shortPosition]);

  const handleClose = (type: string) => {
    console.log("close", type);
    setClickType(type);
    let _amount = 0;
    if (type === "long") {
      _amount = +inputAmount || amountPercent * longPosition;
      setInputType(+inputAmount > longPosition ? "warn" : "normal");
    }
    if (type === "short") {
      _amount = +inputAmount || amountPercent * shortPosition;
      setInputType(+inputAmount > shortPosition ? "warn" : "normal");
    }

    const tradeFee = filterPrecision(
      BigNumber(+price * +_amount * 0.0008).toString(),
      curToken?.displayDecimal
    );
    const impactFee = "0";
    const params = {
      symbolName,
      price,
      margin,
      amount: _amount + "",
      futureType: type,
      orderType: activeOrderTab,
      tradeFee,
      impactFee,
      fees: tradeFee + impactFee,
      pnl: "",
    };
    console.log("handleClose", params);
    setConfirmedParams(params);
    const show = localStorage.getItem("showAgain_open");
    if (show === "true") {
      setVisible(true);
    }
  };
  const longPnl = useMemo(() => {
    const _amount = +inputAmount || amountPercent * longPosition;

    return filterPrecision(
      BigNumber(price).minus(entryPrice).multipliedBy(_amount).toString(),
      curToken?.displayDecimal
    );
  }, [entryPrice, price, inputAmount, amountPercent, longPosition]);

  const shortPnl = useMemo(() => {
    const _amount = +inputAmount || amountPercent * shortPosition;
    return filterPrecision(
      BigNumber(entryPrice).minus(price).multipliedBy(_amount).toString(),
      curToken?.displayDecimal
    );
  }, [entryPrice, price, inputAmount, amountPercent, shortPosition]);

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
            +filterPrecision(value / 100, curToken?.displayDecimal)
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
                ≈{inputAmount || amountPercent * longPosition} {symbolName}
              </EstPosition>
            ) : null
          }
          shortSuffixChildren={
            inputAmount || amountPercent ? (
              <EstPosition>
                ≈{inputAmount || amountPercent * shortPosition} {symbolName}
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
          <OrderConfirm params={confirmedParams} actionType="close" />
        )}
      </Modal>
    </>
  );
};
export default CloseOrder;
