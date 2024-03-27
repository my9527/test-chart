"use client";
import styled from "styled-components";
import { FC, useCallback, useMemo, useState, useEffect } from "react";
import RGL, { WidthProvider, Layout } from "react-grid-layout";
import { useRecoilState, useRecoilValue } from "recoil";

import PerpetualCharts from "../components/PerpetualCharts";
import PerpetualOrders from "../components/PerpetualOrders";
import PerpetualPanels from "../components/PerpetualPanels";
import PerpetualTrades from "../components/PerpetualTrades";
import Account from "../components/Account";
import PerpetualDetail from "../components/PerpetualDetail";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { recoilPanelSide } from "@/app/models";
import useCurToken from "../hooks/useCurToken";
import { useMessage } from "@/app/components/Message";
import { useOverview } from "@/app/hooks/useOverview";
import { useAccount } from "wagmi";

const ReactGridLayout = WidthProvider(RGL);

const LAYOUT_LEFT_LIST: Layout[] = [
  { i: "charts", x: 0, y: 0, w: 12, h: 15, minW: 8 },
  { i: "trades", x: 12, y: 0, w: 4, h: 15, minW: 4 },
  { i: "orders", x: 0, y: 1, w: 16, h: 9, minW: 12 },
  { i: "panels", x: 16, y: 0, w: 4, h: 15, minW: 4 },
  { i: "account", x: 16, y: 1, w: 4, h: 9, minW: 4 },
];

const LAYOUT_RIGHT_LIST: Layout[] = [
  { i: "panels", x: 0, y: 0, w: 4, h: 15, minW: 4 },
  { i: "charts", x: 4, y: 0, w: 12, h: 15, minW: 8 },
  { i: "orders", x: 4, y: 1, w: 16, h: 9, minW: 8 },
  { i: "trades", x: 16, y: 0, w: 4, h: 15, minW: 4 },
  { i: "account", x: 0, y: 1, w: 4, h: 9, minW: 4 },
];

const Perpetual: FC = () => {
  const msg = useMessage();
  const { run } = useOverview();
  const { address } = useAccount();
  useEffect(() => {
    if (address) {
      run(address);
    }
    // setTimeout(() => {
    //   msg({
    //     content: (index: number) => {
    //       return (
    //         <OrderMessage
    //           position="bottom_right"
    //           index={index}
    //           orderType="limit_open"
    //           orderStatus="filled"
    //           symbolName="BTC"
    //           isLong={true}
    //         />
    //       );
    //     },
    //     delay: 30000,
    //     position: "bottom_right",
    //   });
    //   msg({
    //     content: (index: number) => {
    //       return (
    //         <OrderMessage
    //           position="bottom_right"
    //           index={index}
    //           orderType="limit_open"
    //           orderStatus="unfilled"
    //           symbolName="BTC"
    //           isLong={true}
    //         />
    //       );
    //     },
    //     delay: 30000,
    //     position: "bottom_right",
    //   });
    //   msg({
    //     content: (index: number) => {
    //       return (
    //         <OrderMessage
    //           position="bottom_right"
    //           index={index}
    //           orderType="limit_open"
    //           orderStatus="pending"
    //           symbolName="BTC"
    //           isLong={false}
    //           hash="www.baidu.com"
    //         />
    //       );
    //     },
    //     delay: null,
    //     position: "bottom_right",
    //   });
    // }, 1000);
  }, [address]);

  const panelSide = useRecoilValue(recoilPanelSide);
  const { symbolName } = useCurToken();

  const [layout, setLayout] = useState<Layout[]>(
    panelSide === "left" ? LAYOUT_LEFT_LIST : LAYOUT_RIGHT_LIST
  );

  const onLayoutChange = useCallback((layout: Layout[]) => {
    setLayout([...layout]);
  }, []);
  const rowHeight = useMemo(() => {
    if (document.body.clientHeight) {
      return (document.body.clientHeight - 200) / 24;
    }
  }, [document.body.clientHeight]);
  return (
    <>
      <PerpetualDetail />
      <ReactGridLayout
        draggableHandle=".components-draggable"
        margin={[2, 2]}
        cols={20}
        rowHeight={rowHeight}
        layout={layout}
        onLayoutChange={onLayoutChange}
        isBounded
      >
        <div key="trades">
          <PerpetualTrades key={`trades_${symbolName}`} />
        </div>

        <div key="charts">
          <PerpetualCharts />
        </div>
        <div key="orders">
          <PerpetualOrders />
        </div>
        <div key="panels">
          <PerpetualPanels key={`panels_${symbolName}`} />
        </div>
        <div key="account">
          <Account />
        </div>
      </ReactGridLayout>
    </>
  );
};
export default Perpetual;
