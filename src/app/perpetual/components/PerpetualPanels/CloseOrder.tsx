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
const CloseOrder: React.FC<{
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
  const [amountPercent, setAmountPercent] = useState<number>(0);
  const [isInput, setIsInput] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const fundsAvailable = 2323;
  useEffect(() => {
    const arr = (+amount / fundsAvailable + "").split(".");
    const per = +(arr[0] + "." + (arr[1] ? arr[1].substring(0, 4) : "00"));
    setAmountPercent(+per > 1 ? 1 : +per);
  }, [amount, fundsAvailable]);
  const handleOpen = () => {
    console.log("close");
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
      <Layout>
        <p className="title">Amount</p>
        <div className="input_area">
          <StyledInput
            placeholder="input amount"
            value={amount}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              const value = e?.currentTarget.value;

              if (value && verifyValidNumber(value, curToken?.displayDecimal))
                return;
              setIsInput(true);
              setAmount(value);
            }}
          />
          <StyledCurrencySelect
            curCurrency={curCurrency}
            list={["USD", symbolName]}
            handleClick={(item: string) => {
              setCurCurrency(item);
            }}
          />
        </div>
      </Layout>
      <Slider
        onChange={(value) => {
          setAmount(
            filterPrecision(
              (value / 100) * fundsAvailable,
              curToken?.displayDecimal
            )
          );
          setIsInput(false);
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
          <p>2000 USD</p>
        </DataItem>
        <DataItem>
          <p>Short Position:</p>
          <p>6000 USD</p>
        </DataItem>
      </Data>
      <Btns
        handleClick={handleOpen}
        longBtnText="CLOSE LONG"
        shortBtnText="CLOSE SHORT"
        showIcon={false}
      />
    </>
  );
};
export default CloseOrder;
