"use client";
import styled from "styled-components";
import DraggableIcon from "../DraggableIcon";
import { useEffect, useState } from "react";

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
const Table = styled.div``;
const THeader = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 26px 10px 8px;
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
`;
const TItem = styled.div`
  display: flex;
  align-items: center;
`;
const UpPrice = styled.p`
  color: ${(props) => props.theme.colors.text2};
`;
const DownPrice = styled.p`
  color: ${(props) => props.theme.colors.text5};
`;
// const Size = styled.p`
//   color: ${(props) => props.theme.colors.text1};
// `;
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
  const [activeTab, setActiveTab] = useState("last_trades");
  const columns: columnsType[] = [
    {
      key: "price",
      label: "Price",
      width: "35%",
      Components: (v: string, item: dataSourceType) => {
        // const _v= {BigNumber(ethers.utils.formatUnits(v, 6)).toFixed(
        //   getTokenByIdAndContract(item?.futureId, item?.future)?.displayDecimal || 4,
        //   BigNumber.ROUND_DOWN,
        // )}
        return item?.pair?.toLowerCase()?.includes("short") ? (
          <DownPrice>{v}</DownPrice>
        ) : (
          <UpPrice>{v}</UpPrice>
        );
      },
    },
    {
      key: "size",
      label: "Size",
      width: "35%",
    },
    {
      key: "time",
      label: "Time",
      text_align: "right",
    },
  ];
  const dataSource: dataSourceType[] = [
    {
      price: "232323",
      size: "3343",
      time: Date.now() + "",
    },
    {
      price: "232323",
      size: "3233",
      time: Date.now() + "",
    },
    {
      price: "232323",
      size: "3393",
      time: Date.now() + "",
    },
  ];

  useEffect(() => {
    console.log("render1");
  }, [activeTab]);
  return (
    <Wrapper>
      <Tabs>
        <div
          className={`tab ${activeTab === "last_trades" ? "active_tab" : ""}`}
          onClick={() => setActiveTab("last_trades")}
        >
          Last Trades
        </div>
        <div
          className={`tab ${activeTab === "all_trades" ? "active_tab" : ""}`}
          onClick={() => setActiveTab("all_trades")}
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
          {dataSource.map((item, index) => {
            return (
              <TItem>
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
