"use client";
import styled from "styled-components";
import DraggableIcon from "../DraggableIcon";
import { useEffect, useState, useMemo } from "react";
import { ethers } from "ethers";
import { useRequest } from "ahooks";
import {
  futureTradesById,
  futureTrades,
} from "@/app/graphql/future/tradeOrders";
import BigNumber from "bignumber.js";
import { filterPrecision } from "@/app/utils/tools";
import dayjs from "dayjs";
import useGraphqlFetch from "@/app/hooks/useGraphqlFetch";

interface TdType {
  width?: string;
  key: string;
  text_align?: string;
}

const Wrapper = styled.div`
  position: relative;
  background: ${(props) => props.theme.colors.fill1};
  width: 100%;
  height: 100%;
  cursor: pointer;
`;
const Tabs = styled.div`
  display: flex;
  align-items: center;
  border-bottom: ${(props) => `1px solid ${props.theme.colors.border1}`};
  .tab {
    color: ${(props) => props.theme.colors.text4};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    position: relative;
    padding: 15px 7px;
    cursor: pointer;
  }
  .active_tab {
    color: ${(props) => props.theme.colors.primary1};
    &::after {
      content: "";
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: ${(props) => props.theme.colors.primary1};
    }
  }
`;
const Table = styled.div`
  height: calc(100% - 45px);
`;
const THeader = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 34px 10px 8px;
`;
const BaseTd = styled.div<TdType>`
  text-align: ${(props) => props?.text_align || "left"};
  font-family: Arial;
  font-size: ${(props) => props.theme.fontSize.medium};
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
  color: ${(props) => props.theme.colors.text1};

  ${(props) => {
    return props?.width ? `width:${props?.width}` : "flex:1";
  }}
`;
const Th = styled(BaseTd)`
  color: ${(props) => props.theme.colors.text4};
`;
const Tbody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 0px 26px 0px 8px;
  height: calc(100% - 34px);
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: #292929;
  }
`;
const TItem = styled.div`
  display: flex;
  align-items: center;
`;
const LongPrice = styled.p`
  color: ${(props) => props.theme.colors.text2};
`;
const ShortPrice = styled.p`
  color: ${(props) => props.theme.colors.text5};
`;

type columnsType = {
  key: string;
  width?: string;
  label: string;
  Components?: Function;
  text_align?: string;
};
type dataSourceType = {
  [key: string]: string;
};

const PerpetualTrades = () => {
  const fun = useGraphqlFetch("perpetual", futureTradesById);
  const _fun = useGraphqlFetch("perpetual", futureTrades);
  const { run, data, cancel }: any = useRequest(
    ({ futureId }) => {
      return Promise.all([fun({ futureId }), _fun()]);
    },
    {
      pollingInterval: 10000,
      manual: true,
    }
  );

  const curTokenWithValue = {
    futureLongId: 14,
    kLineSymbol: {},
  };

  useEffect(() => {
    if (curTokenWithValue?.kLineSymbol) {
      run({ futureId: curTokenWithValue?.futureLongId?.toString() });
    } else {
      cancel();
    }
    return () => {
      cancel();
    };
  }, []);
  const [activeTab, setActiveTab] = useState(0);
  const dataSource = useMemo(
    () => data?.[activeTab]?.futureTrades || [],
    [data, activeTab]
  );

  const columns: columnsType[] = [
    {
      key: "price",
      label: "Price",
      width: "35%",
      Components: (v: string, item: dataSourceType) => {
        const _v = BigNumber(ethers?.utils.formatUnits(v, 6)).toFixed(
          4,
          BigNumber.ROUND_DOWN
        );
        return item?.pair?.toLowerCase()?.includes("short") ? (
          <ShortPrice>{_v}</ShortPrice>
        ) : (
          <LongPrice>{_v}</LongPrice>
        );
      },
    },
    {
      key: "size",
      label: "Size",
      width: "35%",
      Components: (v: string, item: dataSourceType) => {
        return (
          <>
            {filterPrecision(BigNumber(item?.size || "0").toString(), 4)}
            {/* {filterPrecision(
              BigNumber(item?.size || "0")
                .multipliedBy(
                  getPar(
                    getTokenByIdAndContract(item?.futureId, item?.future)
                      ?.kLineSymbol
                  )
                )
                .toString(),
              getTokenByIdAndContract(item?.futureId, item?.future)?.parDecimal
            )} */}
          </>
        );
      },
    },
    {
      key: "time",
      label: "Time",
      text_align: "right",
      Components: (v: string, item: dataSourceType) => {
        return <>{dayjs.unix(+item?.time).format("HH:mm:ss")}</>;
      },
    },
  ];

  return (
    <Wrapper>
      <Tabs>
        <div
          className={`tab ${activeTab === 0 ? "active_tab" : ""}`}
          onClick={() => setActiveTab(0)}
        >
          Last Trades
        </div>
        <div
          className={`tab ${activeTab === 1 ? "active_tab" : ""}`}
          onClick={() => setActiveTab(1)}
        >
          All Trades
        </div>
      </Tabs>
      <Table>
        <THeader>
          {columns.map((i) => {
            return (
              <Th key={i?.key} width={i?.width} text_align={i?.text_align}>
                {i?.label}
              </Th>
            );
          })}
        </THeader>
        <Tbody>
          {dataSource.map((item: Record<string, any>, index: number) => {
            return (
              <TItem key={index}>
                {columns.map((i) => {
                  const Components = i?.Components as Function;
                  return (
                    <BaseTd
                      key={i?.key + index}
                      width={i?.width}
                      text_align={i?.text_align}
                    >
                      {Components
                        ? Components(item[i?.key], item)
                        : item[i?.key]}
                    </BaseTd>
                  );
                })}
              </TItem>
            );
          })}
        </Tbody>
      </Table>
      <DraggableIcon />
    </Wrapper>
  );
};
export default PerpetualTrades;