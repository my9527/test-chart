"use client";
import styled from "styled-components";
import Input from "@/app/components/Input";
import { useRecoilValue } from "recoil";
import { recoilIndexPrices } from "@/app/models";
import { filterPrecision } from "@/app/utils/tools";
import { useEffect } from "react";
import { verifyValidNumber } from "@/app/utils/tools";
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
  .market {
    color: ${(props) => props.theme.colors.primary1};
    text-align: right;
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    cursor: pointer;
    padding: 0 8px;
  }
`;
const Price: React.FC<{
  activeOrderTab: string;
  price: string;
  setPrice: Function;
  symbolName: string;
  displayDecimal: number;
}> = ({ activeOrderTab, price, setPrice, symbolName, displayDecimal }) => {
  const indexPrices = useRecoilValue(recoilIndexPrices);

  const getMarketPrice = () => {
    setPrice(filterPrecision(indexPrices[symbolName]?.price, displayDecimal));
  };
  useEffect(() => {
    setPrice("");
  }, [activeOrderTab]);

  useEffect(() => {
    if (activeOrderTab === "market") {
      setPrice(filterPrecision(indexPrices[symbolName]?.price, displayDecimal));
    }
  }, [activeOrderTab, indexPrices, symbolName]);

  return (
    <Layout>
      <p className="title">Price</p>
      <Input
        disabled={activeOrderTab === "market"}
        value={
          activeOrderTab === "market"
            ? filterPrecision(price, displayDecimal)
            : price
        }
        onBlur={() => {
          setPrice(filterPrecision(price, displayDecimal));
        }}
        onChange={(e: React.FormEvent<HTMLInputElement>) => {
          const value = e?.currentTarget.value;

          if (value && verifyValidNumber(value, displayDecimal)) return;
          setPrice(value);
        }}
        placeholder="input price"
        suffix={
          activeOrderTab === "limit" ? (
            <div
              className="market"
              onClick={() => {
                getMarketPrice && getMarketPrice();
              }}
            >
              Market
            </div>
          ) : null
        }
      />
    </Layout>
  );
};
export default Price;
