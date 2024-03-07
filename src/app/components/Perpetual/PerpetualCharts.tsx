"use client";
import styled from "styled-components";
import DraggableIcon from "./DraggableIcon";
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: green;
`;

const PerpetualCharts = () => {
  return (
    <Wrapper>
      PerpetualCharts
      <DraggableIcon />
    </Wrapper>
  );
};
export default PerpetualCharts;
