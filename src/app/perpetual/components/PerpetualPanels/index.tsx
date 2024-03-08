"use client";
import styled from "styled-components";
import DraggableIcon from "../DraggableIcon";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: blue;
`;
const PerpetualPanels = () => {
  return (
    <Wrapper>
      PerpetualPanels
      <DraggableIcon />
    </Wrapper>
  );
};
export default PerpetualPanels;
