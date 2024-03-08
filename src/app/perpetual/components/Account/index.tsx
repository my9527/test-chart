"use client";
import styled from "styled-components";
import DraggableIcon from "../DraggableIcon";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: black;
`;
const Account = () => {
  return (
    <Wrapper>
      Account
      <DraggableIcon />
    </Wrapper>
  );
};
export default Account;
