"use client";
import styled from "styled-components";
import DraggableIcon from "./DraggableIcon";

const Wrapper = styled.div`
  position: relative;
  background-color: red;
  width: 100%;
  height: 100%;
`;
const PerpetualTrdes = () => {
  return (
    <Wrapper>
      PerpetualTrdes
      <DraggableIcon />
    </Wrapper>
  );
};
export default PerpetualTrdes;
