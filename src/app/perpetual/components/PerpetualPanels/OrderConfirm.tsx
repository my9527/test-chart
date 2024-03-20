"use client";
import styled from "styled-components";
import TokenImage from "@/app/components/TokenImage";
import CheckBox from "@/app/components/CheckBox";
import { useState, useEffect } from "react";

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
const StopOrder = styled.div`
  padding: 0px 13px 10px 13px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  border-bottom: ${(props) => `1px solid ${props.theme.colors.border1}`};
  .item {
    color: ${(props) => props.theme.colors.text4};
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
  }
`;
const Tips = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 0 13px;
  .tips {
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    color: ${(props) => props.theme.colors.text4};
  }
`;
const Pnl = styled.div`
  padding: 0px 13px 10px 13px;
  display: flex;
  flex-direction: column;
  border-bottom: ${(props) => `1px solid ${props.theme.colors.border1}`};
  .item {
    color: ${(props) => props.theme.colors.text4};
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    .pnl_long {
      color: ${(props) => props.theme.colors.text2};
    }
    .pnl_short {
      color: ${(props) => props.theme.colors.text5};
    }
  }
`;
type TypeMap = { [key: string]: string };
export type ParamsProps = {
  symbolName: string;
  futureType: string;
  orderType: string;
  margin: string;
  amount: string;
  slippage?: string;
  fees: string;
  tradeFee: string;
  impactFee: string;
  longStopPrice?: string;
  shortStopPrice?: string;
  price: string;
  pnl?: string;
};
const OrderConfirm: React.FC<{ params: ParamsProps; actionType: string }> = ({
  params,
  actionType,
}) => {
  const futureTypeMap: TypeMap = { long: "Long", short: "Short" };
  const orderTypeMap: TypeMap = {
    limit: "Limit Open",
    market: "Market Open",
  };
  const [showAgain, setShowAgain] = useState(false);
  useEffect(() => {
    localStorage.setItem("showAgain", showAgain ? "true" : "false");
  }, [showAgain]);
  return (
    <Wrapper>
      <Symbol>
        <TokenImage name={params?.symbolName} width={20} height={20} />
        <p className="symbol_name">{params?.symbolName}USD</p>
        <p className={`future_type future_type_${params?.futureType}`}>
          {futureTypeMap[params?.futureType]}
        </p>
      </Symbol>
      <OrderInfo>
        <div className="item">
          <p className="label">Type</p>
          <p className="value">{orderTypeMap[params?.orderType]}</p>
        </div>
        <div className="item">
          <p className="label">Order price</p>
          <p className="value">{params?.price}</p>
        </div>
        <div className="item">
          <p className="label">Margin</p>
          <p className="margin">{params?.margin} USD</p>
        </div>
        <div className="item">
          <p className="label">Size</p>
          <p className="value">
            {params?.amount} {params?.symbolName}
          </p>
        </div>
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
      </OrderInfo>
      {actionType === "close" ? (
        <Pnl>
          <div className="item">
            <p className="label">Est. PnL</p>
            {params?.pnl && (
              <p
                className={`${
                  +params?.pnl > 0
                    ? "pnl_long"
                    : +params?.pnl < 0
                    ? "pnl_short"
                    : ""
                }`}
              >
                {params?.pnl}
              </p>
            )}
          </div>
        </Pnl>
      ) : (
        <StopOrder>
          <div className="item">Stop Orders</div>
          <div className="item">
            <p className="label">TP trigger price</p>
            <p>{params?.longStopPrice}</p>
          </div>
          <div className="item">
            <p className="label">SL trigger price</p>
            <p>{params?.shortStopPrice}</p>
          </div>
        </StopOrder>
      )}
      <Tips>
        <CheckBox handleClick={() => setShowAgain(!showAgain)} />
        <p className="tips">Don't show this message again</p>
      </Tips>
    </Wrapper>
  );
};
export default OrderConfirm;
