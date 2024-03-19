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
import {
  filterPrecision,
  getExponent,
  filterThousands,
} from "@/app/utils/tools";
import { recoilOpenInterests } from "@/app/models";
import { useRecoilValue } from "recoil";
import BigNumber from "bignumber.js";
import { Token } from "@/app/config/tokens";
import Btns from "./Btns";

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

    padding: 0 4px;
    border-radius: 2px;
    background: ${(props) => props.theme.colors.fill2};
    display: flex;
    align-items: center;
    height: 20px;
  }
`;
const StyledLayout = styled(Layout)`
  flex: 1;
`;
const StyledCurrencySelect = styled(CurrencySelect)`
  padding: 0 4px;
  border-radius: 2px;
  background: ${(props) => props.theme.colors.fill2};
  .cur_currency {
    height: 20px;
    padding-right: 0px;
  }
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
  .slippage {
    border-radius: 999px;
    background: ${(props) => props.theme.colors.fill2};
    padding: 3px 8px;
    color: ${(props) => props.theme.colors.primary1};
    border: ${(props) => `1px solid transparent`};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.small};
    font-style: normal;
    font-weight: 400;
    line-height: 120%;

    box-sizing: border-box;
    display: flex;
    align-items: center;
    &:hover,
    &:active {
      border: ${(props) => `1px solid ${props.theme.colors.primary1}`};
    }
    span {
      line-height: 120%;
      display: inline-block;
      width: 40px;
      padding-right: 5px;
      text-align: right;
    }
    .input {
      background: ${(props) => props.theme.colors.fill2};
      outline-style: none;
      width: 40px;

      height: 100%;
      border: none;
      color: ${(props) => props.theme.colors.primary1};
      text-align: right;
      font-family: Arial;
      font-size: ${(props) => props.theme.fontSize.small};
      font-style: normal;
      font-weight: 400;
      line-height: 120%;
      padding-right: 5px;
    }
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

const OpenOrder: React.FC<{
  activeOrderTab: string;
  margin: string;
  setMargin: Function;
  symbolName: string;
  leverage: number;
  curToken: Token;
}> = ({
  activeOrderTab,
  margin,
  setMargin,
  symbolName,
  leverage,
  curToken,
}) => {
  const [price, setPrice] = useState<string>("");
  const [curCurrency, setCurCurrency] = useState("USD");
  const [amount, setAmount] = useState<string>("");

  const [showStopOrder, setShowStopOrder] = useState<boolean>(false);
  const [longStopPrice, setLongStopPrice] = useState<string>("");
  const [shortStopPrice, setShortStopPrice] = useState<string>("");

  const { currentTokenAvailableLiq } = useRecoilValue(recoilOpenInterests);

  const [slippage, setSlippage] = useState(
    localStorage.getItem("slippage") ?? "0.5"
  );

  const longAvailableTokenForFutureResults = useMemo(() => {
    const long = currentTokenAvailableLiq?.longReadable || "0";

    return BigNumber(long).toString();
  }, [currentTokenAvailableLiq?.longReadable]);

  const shortAvailableTokenForFutureResults = useMemo(() => {
    const short = currentTokenAvailableLiq?.shortReadable || "0";

    return BigNumber(short).toString();
  }, [currentTokenAvailableLiq?.shortReadable]);

  const longPnl = useMemo(() => {
    let v = "--";
    if (amount && price && longStopPrice) {
      if (!shortStopPrice && shortStopPrice) {
        v = filterPrecision(
          BigNumber(
            curCurrency === "USD"
              ? ((+longStopPrice - +price) * +amount) / +price
              : (+longStopPrice - +price) * +amount
          )
            .abs()
            .toString(),
          curToken?.displayDecimal
        );
      } else {
        v = filterPrecision(
          BigNumber(
            curCurrency === "USD"
              ? ((+longStopPrice - +price) * +amount) / +price
              : (+longStopPrice - +price) * +amount
          ).toString(),
          curToken?.displayDecimal
        );
      }
    }
    return v;
  }, [amount, price, longStopPrice, curCurrency, shortStopPrice]);

  const shortPnl = useMemo(() => {
    let v = "--";
    if (amount && price && shortStopPrice) {
      if (!longStopPrice) {
        v = filterPrecision(
          BigNumber(
            curCurrency === "USD"
              ? ((+shortStopPrice - +price) * +amount) / +price
              : (+shortStopPrice - +price) * +amount
          )
            .abs()
            .toString(),
          curToken?.displayDecimal
        );
        v = "-" + v;
      } else {
        v = filterPrecision(
          BigNumber(
            curCurrency === "USD"
              ? ((+price - +shortStopPrice) * +amount) / +price
              : (+price - +shortStopPrice) * +amount
          ).toString(),
          curToken?.displayDecimal
        );
      }
    }
    return v;
  }, [amount, price, shortStopPrice, curCurrency, longStopPrice]);

  // u本位 amount=margin*leverage ,amount输入变化，leverage不变，margin变化，下面百分比变化，百分比*fund savailable=amount
  // 币本位 amount=margin*leverage/price，amount输入变化同上

  const [inputAmount, setInputAmount] = useState<string>("");
  const [marginPercent, setMarginPercent] = useState<number>(0);
  const fundsAvailable = 2000.66;
  const [isInput, setIsInput] = useState(false);

  useEffect(() => {
    if (!isInput) {
      if (curCurrency === "USD") {
        setAmount(
          +margin * leverage
            ? filterPrecision(+margin * +leverage, curToken?.displayDecimal)
            : ""
        );
      } else {
        const decimal = getExponent(
          Number(curToken?.perpConfig?.contractSize) || 1
        );

        setAmount(
          margin && price
            ? filterPrecision((+margin * leverage) / +price, decimal)
            : ""
        );
      }
    }
  }, [margin, leverage, curCurrency, price, isInput, curToken]);

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
          filterPrecision(+amount / leverage, curToken?.displayDecimal) || ""
        );
      } else {
        setMargin(
          filterPrecision(
            (+amount * +price) / leverage,
            curToken?.displayDecimal
          ) || ""
        );
      }
    }
  }, [inputAmount, isInput, curCurrency, price]);

  const formatPrice = (
    value: string,
    setFun: Function,
    originValue: string | number
  ) => {
    const reg = /^\d+(\.\d+)?$/;
    const len = value.length;

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
  const handleOpen = (type) => {
    const params = {
      price,
      margin,
      amount,
      longStopPrice,
      shortStopPrice,
      type,
    };
    console.log("handleOpen", params);
  };
  return (
    <>
      <Price
        displayDecimal={curToken?.displayDecimal}
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
            type={
              (margin && +margin > fundsAvailable) || +margin < 0
                ? "warn"
                : "normal"
            }
            placeholder="input margin"
            value={margin}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              const value = e?.currentTarget.value;

              if (value && verifyValidNumber(value, curToken?.displayDecimal)) {
                return;
              }

              setMargin(value);
              setIsInput(false);
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
              const value = e?.currentTarget.value;

              if (value && verifyValidNumber(value, curToken?.displayDecimal))
                return;
              setIsInput(true);
              setAmount(value);
            }}
          />
        </StyledLayout>
      </MarginAmount>
      <Slider
        onChange={(value) => {
          setMargin(
            filterPrecision(
              (value / 100) * fundsAvailable,
              curToken?.displayDecimal
            )
          );
          setIsInput(false);
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
          <p className="value">
            {" "}
            {longAvailableTokenForFutureResults
              ? filterThousands(longAvailableTokenForFutureResults, 2)
              : ""}
            USD
          </p>
        </DataItem>
        <DataItem className="item">
          <p className="label">Max Short</p>
          <p className="value">
            {" "}
            {shortAvailableTokenForFutureResults
              ? filterThousands(shortAvailableTokenForFutureResults, 2)
              : ""}
            USD
          </p>
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
                type={
                  longStopPrice &&
                  price &&
                  (+longStopPrice > +price * (curToken?.maxProfitRatio + 1) ||
                    +longStopPrice < +price)
                    ? "warn"
                    : "normal"
                }
                value={longStopPrice}
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                  const value = e?.currentTarget.value;

                  if (
                    value &&
                    verifyValidNumber(value, curToken?.displayDecimal)
                  )
                    return;

                  setLongStopPrice(value);
                }}
                placeholder="TP Trigger Price"
                // suffix={<div className="unit">USD</div>}
              />
              <div className="pnl">
                Est.pnl:<span className="long">{longPnl}USD</span>
              </div>
            </div>
            <div className="item">
              <Input
                type={
                  shortStopPrice && price && +shortStopPrice > +price
                    ? "warn"
                    : "normal"
                }
                value={shortStopPrice}
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                  const value = e?.currentTarget.value;

                  if (
                    value &&
                    verifyValidNumber(value, curToken?.displayDecimal)
                  )
                    return;
                  setShortStopPrice(value);
                }}
                placeholder="SL Trigger Price"
                // suffix={<div className="unit">USD</div>}
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

        <div className="slippage">
          <input
            onBlur={() => {
              localStorage.setItem("slippage", slippage);
            }}
            value={slippage}
            className="input"
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              const value = e?.currentTarget.value;

              if (value && verifyValidNumber(value, 2)) return;

              if (+value / 100 > curToken?.maxLeverage) {
                setSlippage(curToken?.maxLeverage * 100 + "");
                return;
              }
              setSlippage(value);
            }}
          />
          %
        </div>
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
        <p className="value">0.08%</p>
      </Fee>
      <Btns
        handleClick={handleOpen}
        longBtnText="LONG"
        shortBtnText="SHORT"
        showIcon={true}
      />
      {/* <Btns>
        <Button
          type="long"
          btnText="LONG"
          onClick={() => {
            handleOpen && handleOpen("long");
          }}
        >
          <Image src={LongIcon} alt="" width={25} height={18} />
        </Button>
        <Button
          type="short"
          btnText="SHORT"
          onClick={() => {
            handleOpen && handleOpen("short");
          }}
        >
          <Image src={ShortIcon} alt="" width={25} height={18} />
        </Button>
      </Btns> */}
    </>
  );
};
export default OpenOrder;