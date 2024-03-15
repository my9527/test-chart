"use client";
import { memo } from "react";
import styled from "styled-components";
import Image from "next/image";
import Icon from "@/app/assets/perpetual/draggable.svg";
const Wrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 16px;
  max-height: 48px;
  user-select: none;
  cursor: grab;
  transition: all 0.3s ease-in-out;
  &:hover {
    opacity: 0.6;
  }
`;
const DraggableIcon = () => {
  return (
    <Wrapper className="components-draggable">
      <Image src={Icon} alt="" width={10} height={10} />
    </Wrapper>
  );
};
export default memo(DraggableIcon);
