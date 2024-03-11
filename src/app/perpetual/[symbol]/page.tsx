"use client";
import styled from "styled-components";
import { FC, useCallback, useMemo, useState } from "react";
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
  const panelSide = useRecoilValue(recoilPanelSide);

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
