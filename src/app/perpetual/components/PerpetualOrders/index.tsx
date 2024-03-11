"use client";
import styled from "styled-components";
import DraggableIcon from "../DraggableIcon";
import { OrderHeader } from "./Header";

import { PositionList } from "./PositionList";
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;


// 1.  通过graphql 获取已经完成的订单，
// 2. 监听事件，获取用户新下的单，并及时更新



const PerpetualOrders = () => {



  return (
    <Wrapper>
      <DraggableIcon />
      <OrderHeader />
      <PositionList />
      
    </Wrapper>
  );
};
export default PerpetualOrders;
