"use client";
import styled from "styled-components";
import DraggableIcon from "../DraggableIcon";
import { OrderHeader } from "./Header";

import { PositionList } from "./PositionList";
import { Col } from "@/app/components/Col";
import { useState } from "react";
import { NotAuthed } from "@/app/components/NotAuthed";
import { LimitMarketOrderList } from "./LimitOrders";
import { StopOrderList } from "./StopOrder";
import CloseOrder from "./CloseOrder";
import AdjustMargin from "./AdjustMargin";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Content = styled(Col)`
  width: 100%;
  height: 100%;
`;

// 1.  通过graphql 获取已经完成的订单，
// 2. 监听事件，获取用户新下的单，并及时更新

enum ListType {
  POSITIONS = "pos",
  LIMITMARKET = "lo",
  STOP = "ts",
}

const PerpetualOrders = () => {
  // const [] = useState();

  const [listType, updateListType] = useState(ListType.POSITIONS);

  return (
    <Wrapper>
      <DraggableIcon />
      <Content>
        <OrderHeader
          switchListType={(nextType: string) =>
            updateListType(nextType as ListType)
          }
        />
        <NotAuthed>
          {listType === ListType.POSITIONS && <PositionList />}
          {listType === ListType.LIMITMARKET && <LimitMarketOrderList />}
          {listType === ListType.STOP && <StopOrderList />}
        </NotAuthed>
      </Content>
      {/* <CloseOrder
        params={{
          amount: "10",
          symbolName: "ARB",
          price: "233.34",
          margin: "66",
          futureType: "long",
          fees: "233",
          tradeFee: "2323",
          impactFee: "2323",
        }}
      /> */}
      <AdjustMargin
        isVisible={true}
        params={{
          symbolName: "ARB",
          futureType: "long",
          margin: "233",
          leverage: 5,
          fundsAvailable: "3434",
        }}
      />
    </Wrapper>
  );
};
export default PerpetualOrders;
