"use client";
import styled from "styled-components";
import Price from "./Price";
import CurrencySelect from "@/app/components/CurrencySelect";
import Button from "../Button";
import Slider from "../Slider";
import LongIcon from "@/app/assets/perpetual/long.svg";
import ShortIcon from "@/app/assets/perpetual/short.svg";
import { useEffect, useState, useRef, useMemo } from "react";
import Input from "@/app/components/Input";
import CheckBox from "@/app/components/CheckBox";
import Image from "next/image";
import { verifyValidNumber } from "@/app/utils/tools";
import { filterPrecision } from "@/app/utils/tools";
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

// const Price = styled(Layout)`
//   .market {
//     color: ${(props) => props.theme.colors.primary1};
//     text-align: right;
//     font-family: Arial;
//     font-size: ${(props) => props.theme.fontSize.medium};
//     font-style: normal;
//     font-weight: 400;
//     line-height: 100%;
//     cursor: pointer;
//     padding: 0 8px;
//   }
// `;
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
const OpenOrder: React.FC<{
  activeOrderTab: string;
  margin: number | undefined;
  setMargin: Function;
  symbolName: string;
  leverage: number;
  displayDecimal: number;
}> = ({
  activeOrderTab,
  margin,
  setMargin,
  symbolName,
  leverage,
  displayDecimal,
}) => {
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [curCurrency, setCurCurrency] = useState("USD");
  const [amount, setAmount] = useState<number | undefined | string>(undefined);

  const [showStopOrder, setShowStopOrder] = useState<boolean>(false);
  const [longStopPrice, setLongStopPrice] = useState<
    number | undefined | string
  >(undefined);
  const [shortStopPrice, setShortStopPrice] = useState<
    number | undefined | string
  >(undefined);
  const longPnl = useMemo(() => {
    return (longStopPrice - price) / amount || "--";
  }, [amount, price, longStopPrice]);

  const shortPnl = useMemo(() => {
    return (shortStopPrice - price) / amount || "--";
  }, [amount, price, shortStopPrice]);

  const [inputAmount, setInputAmount] = useState<number | undefined | string>(
    undefined
  );
  const [marginPercent, setMarginPercent] = useState<number | undefined>();
  const fundsAvailable = 2000.66;
  const [isInput, setIsInput] = useState(false);

  // u本位 amount=margin*leverage ,amount输入变化，leverage不变，margin变化，下面百分比变化，百分比*fund savailable=amount
  //币本位 amount=margin*leverage/price，amount输入变化同上

  useEffect(() => {
    if (curCurrency === "USD") {
      setAmount(
        filterPrecision(margin * leverage, displayDecimal) || undefined
      );
    } else {
      setAmount(
        filterPrecision((margin * leverage) / price, displayDecimal) ||
          undefined
      );
    }
  }, [margin, leverage, curCurrency, price]);

  useEffect(() => {
    const arr = (+margin / fundsAvailable + "").split(".");
    const per = +(arr[0] + "." + (arr[1] ? arr[1].substring(0, 4) : "00"));
    setMarginPercent(+per > 1 ? 1 : +per);
  }, [margin, fundsAvailable]);

  useEffect(() => {
    setInputAmount(amount);
  }, [amount]);

  useEffect(() => {
    if (isInput) {
      if (curCurrency === "USD") {
        setMargin(
          filterPrecision(+amount / leverage, displayDecimal) || undefined
        );
      } else {
        setMargin(
          filterPrecision((+amount * price) / leverage, displayDecimal) ||
            undefined
        );
      }
      setIsInput(false);
    }
  }, [inputAmount, isInput, curCurrency, price]);

  const formatPrice = (
    value: string,
    setFun: Function,
    originValue: string | number
  ) => {
    const reg = /^\d+(\.\d+)?$/;
    const len = value.length;
    console.log(
      "stop_price",
      value,
      reg.test(value),
      value[len - 1] === ".",
      value.substring(0, len - 1)?.includes("."),
      reg.test(value) ||
        (value[len - 1] === "." && !value.substring(0, len - 1)?.includes("."))
    );
    if (!value) {
      setFun(undefined);
      return;
    }
    if (
      reg.test(value) ||
      (value[len - 1] === "." && !value.substring(0, len - 1)?.includes("."))
    ) {
      setFun(value);
    } else {
      console.log("in");
      setFun(originValue);
    }
  };

  return (
    <>
      <Price
        displayDecimal={displayDecimal}
        symbolName={symbolName}
        price={price}
        setPrice={setPrice}
        activeOrderTab={activeOrderTab}
      />
      <MarginAmount>
        <StyledLayout>
          <div className="title">
            Margin
            <div className="unit">USD</div>
          </div>
          <Input
            type={margin && margin > fundsAvailable ? "warn" : "normal"}
            placeholder="input margin"
            value={margin}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              const value = e?.currentTarget.value;

              if (value && verifyValidNumber(value, displayDecimal)) return;
              setMargin(value);
              return;
              //   const reg = /^\d+(\.\d+)?$/;
              //   const len = value.length;
              //   if (!value) {
              //     setMargin(undefined);
              //     return;
              //   }
              //   if (
              //     reg.test(value) ||
              //     (value[len - 1] === "." &&
              //       !value.substring(0, len - 1)?.includes("."))
              //   ) {
              //     setMargin(value);
              //   } else {
              //     setMargin(margin);
              //   }
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
            value={inputAmount}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              const reg = /^\d+(\.\d+)?$/;
              const value = e?.currentTarget.value;
              const len = value.length;
              setIsInput(true);
              if (!value) {
                setAmount(undefined);
                return;
              }
              if (
                reg.test(value) ||
                (value[len - 1] === "." &&
                  !value.substring(0, len - 1)?.includes("."))
              ) {
                setAmount(value);
              } else {
                setAmount(amount);
              }
            }}
          />
        </StyledLayout>
      </MarginAmount>
      <Slider
        onChange={(value) => {
          setMargin((value / 100) * fundsAvailable);
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
                value={longStopPrice}
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                  const value = e?.currentTarget.value;

                  if (value && verifyValidNumber(value, displayDecimal)) return;
                  setLongStopPrice(value);
                  return;

                  formatPrice(
                    e?.currentTarget.value,
                    setLongStopPrice,
                    longStopPrice
                  );
                  //   setLongStopPrice(+e?.currentTarget.value || undefined);
                }}
                placeholder="TP Trigger Price"
                suffix={<div className="unit">USD</div>}
              />
              <div className="pnl">
                Est.pnl:<span className="long">{longPnl}USD</span>
              </div>
            </div>
            <div className="item">
              <Input
                value={shortStopPrice}
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                  const value = e?.currentTarget.value;

                  if (value && verifyValidNumber(value, displayDecimal)) return;
                  setShortStopPrice(value);
                  return;
                  formatPrice(
                    e?.currentTarget.value,
                    setShortStopPrice,
                    shortStopPrice
                  );
                  //   setShortStopPrice(+e?.currentTarget.value || undefined);
                }}
                placeholder="SL Trigger Price"
                suffix={<div className="unit">USD</div>}
              />
              <div className="pnl">
                Est.pnl:<span className="short">{shortPnl}USD</span>
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
      </Btns>
    </>
  );
};
export default OpenOrder;
