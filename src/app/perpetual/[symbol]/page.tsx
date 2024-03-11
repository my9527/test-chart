"use client";
import styled from "styled-components";
import { FC, useCallback, useEffect, useState } from "react";
import RGL, { WidthProvider, Layout } from "react-grid-layout";
import { useRecoilState, useRecoilValue } from "recoil";

import PerpetualCharts from "../components/PerpetualCharts";
import PerpetualOrders from "../components/Orders/PerpetualOrders";
import PerpetualPanels from "../components/PerpetualPanels";
import PerpetualTrades from "../components/PerpetualTrades";
import Account from "../components/Account";
import PerpetualDetail from "../components/PerpetualDetail";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { recoilPanelSide } from "@/app/models";

const ReactGridLayout = WidthProvider(RGL);

const LAYOUT_LEFT_LIST: Layout[] = [
  { i: "charts", x: 0, y: 0, w: 12, h: 15, minW: 8 },
  { i: "trades", x: 12, y: 0, w: 4, h: 15, minW: 4 },
  { i: "orders", x: 0, y: 1, w: 16, h: 8, minW: 12 },
  { i: "panels", x: 16, y: 0, w: 4, h: 15, minW: 4 },
  { i: "account", x: 16, y: 1, w: 4, h: 8, minW: 4 },
];

const LAYOUT_RIGHT_LIST: Layout[] = [
  { i: "panels", x: 0, y: 0, w: 4, h: 15, minW: 4 },
  { i: "charts", x: 4, y: 0, w: 12, h: 15, minW: 8 },
  { i: "orders", x: 4, y: 1, w: 16, h: 8, minW: 8 },
  { i: "trades", x: 16, y: 0, w: 4, h: 15, minW: 4 },
  { i: "account", x: 0, y: 1, w: 4, h: 8, minW: 4 },
];

const Perpetual: FC = () => {
  const panelSide = useRecoilValue(recoilPanelSide);

  const [layout, setLayout] = useState<Layout[]>(
    panelSide === "left" ? LAYOUT_LEFT_LIST : LAYOUT_RIGHT_LIST
  );

  const onLayoutChange = useCallback((layout: Layout[]) => {
    setLayout([...layout]);
  }, []);

  return (
    <>
      <PerpetualDetail />
      <ReactGridLayout
        draggableHandle=".components-draggable"
        margin={[2, 2]}
        cols={20}
        rowHeight={35}
        layout={layout}
        onLayoutChange={onLayoutChange}
        isBounded
      >
        <div key="trades">
          <PerpetualTrades />
        </div>

        <div key="charts">
          <PerpetualCharts />
        </div>
        <div key="orders">
          <PerpetualOrders />
        </div>
        <div key="panels">
          <PerpetualPanels />
        </div>
        <div key="account">
          <Account />
        </div>
      </ReactGridLayout>
    </>
  );
};
export default Perpetual;
