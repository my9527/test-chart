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
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Content = styled(Col)`

width: 100%;
height: 100%;

`


// 1.  通过graphql 获取已经完成的订单，
// 2. 监听事件，获取用户新下的单，并及时更新



enum ListType {
  POSITIONS = 'pos',
  LIMITMARKET = 'lo',
  STOP = 'ts',
}



const PerpetualOrders = () => {

  // const [] = useState();

  const [listType, updateListType] = useState(ListType.POSITIONS);



  return (
    <Wrapper>
      <DraggableIcon />
      <Content>
        <OrderHeader switchListType={(nextType: string) => updateListType(nextType as ListType)} />
        <NotAuthed>
          {
            listType === ListType.POSITIONS && <PositionList />
          }
          {
            listType === ListType.LIMITMARKET && <LimitMarketOrderList />
          }
          {
            listType === ListType.STOP && <StopOrderList />
          }
        </NotAuthed>
      </Content>
    </Wrapper>
  );
};
export default PerpetualOrders;
