"use client";
import styled from "styled-components";
import DraggableIcon from "../DraggableIcon";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { recoilDepositModalShow, recoilFutureLimitOrMarketOrders, recoilPositions } from "@/app/models";
import { calcPnl } from "../../lib/getPnl";
import {
  useIndexPricesIdMap,
  useIndexPricesById,
  useIndexPrices,
} from "@/app/hooks/useIndexPrices";
import { useTokensIdMap } from "@/app/hooks/useTokens";
import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { filterPrecision } from "@/app/utils/tools";
import { useExchangeBalance } from "@/app/hooks/useBalance";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.colors.fill1};
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Title = styled.p`
  color: ${(props) => props.theme.colors.text1};
  font-family: Arial;
  font-size: ${(props) => props.theme.fontSize.reguar};
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  .item {
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
    .long {
      color: ${(props) => props.theme.colors.text2};
    }
    .short {
      color: ${(props) => props.theme.colors.text5};
    }
  }
`;
const Btns = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  .btn {
    width: 150px;
    border-radius: 999px;
    background: ${(props) => props.theme.colors.fill2};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 7px 0;
    cursor: pointer;
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.header2};
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
    border: 1px solid transparent;
    &:hover,
    &:active {
      color: ${(props) => props.theme.colors.primary1};
      border: ${(props) => `1px solid ${props.theme.colors.primary1}`};
      background: ${(props) => props.theme.colors.border1};
    }
  }
`;
const Account = () => {
  const openPositions = useRecoilValue(recoilPositions);
  const limitOrMarketOrder = useRecoilValue(recoilFutureLimitOrMarketOrders);
  const prices = useIndexPricesIdMap();
  const tokens = useTokensIdMap();
  const balance = useExchangeBalance();

  const openDepositionModal = useSetRecoilState(recoilDepositModalShow);

  const totalMargin = useMemo(() => {
    let _total = "0";
    openPositions.map((pos) => {
      _total = BigNumber(_total).plus(pos?.collateralReadable).toString();
    });

    limitOrMarketOrder.map((pos) => {
      _total = BigNumber(_total)
        .plus(pos?.collateralReadable === "NaN" ? "0" : pos?.collateralReadable)
        .toString();
    });

    return _total;
  }, [limitOrMarketOrder, openPositions]);

  const totalPnl = useMemo(() => {
    if (prices && tokens) {
      let _total = "0";
      openPositions.map((pos) => {
        const token = tokens[pos.futureId];
        const tickPrice = prices[pos.futureId];
        const pnl = calcPnl({
          isLong: pos.isLong,
          entryPrice: pos.entryPriceReadable,
          tickPrice: tickPrice?.price,
          size: pos.tokenSize,
          pars: token.pars,
        });
        _total = BigNumber(_total).plus(pnl).toString();
      });
      return _total;
    }
    return "0";
  }, [prices, tokens, openPositions]);

  const equity = useMemo(() => {
    return filterPrecision(
      BigNumber(balance["USDX"]?.balanceReadable)
        .plus(totalMargin)
        .minus(+totalPnl)
        .toString(),
      2
    );
  }, [balance, totalMargin, totalPnl]);
  const marginUsage = useMemo(() => {
    return filterPrecision(
      BigNumber(totalMargin)
        .dividedBy(
          BigNumber(totalMargin).plus(balance["USDX"]?.balanceReadable)
        )
        .multipliedBy(100)
        .toString(),
      2
    );
  }, []);
  const list = useMemo(() => {
    return [
      {
        label: "Equity",
        value: `${equity} USD`,
        id: "equity",
      },
      {
        label: "Margin Usage",
        value: `${marginUsage}%`,
        id: "margin",
      },
      {
        label: "Floating PNL",
        value: `${filterPrecision(totalPnl, 2)} USD`,
        id: "pnl",
      },
    ];
  }, [totalPnl]);
  return (
    <Wrapper>
      <Title>Account</Title>
      <Content>
        {list.map((i) => {
          return (
            <div className="item" key={i?.label}>
              <p className="label">{i?.label}</p>
              <p
                className={`value ${
                  i?.id === "pnl"
                    ? BigNumber(i?.value).gt(0)
                      ? "long"
                      : "short"
                    : ""
                }`}
              >
                {i?.value}
              </p>
            </div>
          );
        })}
      </Content>
      <Btns>
        <div className="btn" onClick={() => openDepositionModal(true)}>Deposit</div>
      </Btns>
      <DraggableIcon />
    </Wrapper>
  );
};
export default Account;
