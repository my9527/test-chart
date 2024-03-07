"use client";
import styled from "styled-components";
import * as React from "react";
import RGL, { WidthProvider, Layout } from "react-grid-layout";
import { useRecoilState, useRecoilValue } from "recoil";
import { recoilPanelSide } from "@/app/model";
import PerpetualCharts from "../components/Perpetual/PerpetualCharts";
import PerpetualOrders from "../components/Perpetual/PerpetualOrders";
import PerpetualPanels from "../components/Perpetual/PerpetualPanels";
import PerpetualTrdes from "../components/Perpetual/PerpetualTrdes";
import Account from "../components/Perpetual/Account";
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

const Perpetual = () => {
  //   const panelSide = useRecoilValue(recoilPanelSide);
  const panelSide = "left";
  const [layout, setLayout] = React.useState<Layout[]>(
    panelSide === "left" ? LAYOUT_LEFT_LIST : LAYOUT_RIGHT_LIST
  );

  const onLayoutChange = (layout: Layout[]) => {
    setLayout([...layout]);
  };

  return (
    <div>
      <div>Perpetual detail</div>
      <ReactGridLayout
        draggableHandle=".components-draggable"
        margin={[4, 4]}
        cols={20}
        rowHeight={35}
        layout={layout}
        onLayoutChange={onLayoutChange}
        isBounded
      >
        <div key="trades">
          <PerpetualTrdes />
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
    </div>
  );
};
export default Perpetual;
