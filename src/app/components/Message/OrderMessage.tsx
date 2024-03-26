"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled, { keyframes } from "styled-components";
import CloseIcon from "../Modal/CloseIcon";
import FilledIcon from "@/app/assets/message/filled.svg";
import UnfilledIcon from "@/app/assets/message/unfilled.svg";
import Image from "next/image";
import TokenImage from "@/app/components/TokenImage";
import { useRecoilState } from "recoil";
import { recoilGlobalMessage } from "@/app/models";

const Wrapper = styled.div`
  width: 400px;
  border-radius: 8px;
  border: ${(props) => `1px solid ${props.theme.colors.fill2}`};
  background: ${(props) => props.theme.colors.fill2};
  padding: 10px 20px;
`;
const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    display: flex;
    align-items: center;
    gap: 20px;
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    color: ${(props) => props.theme.colors.text1};
    .type {
    }
    .line {
      width: 1px;
      height: 20px;
      background: ${(props) => props.theme.colors.border1};
    }
    .status {
      display: flex;
      align-items: center;
      gap: 10px;
      svg {
        width: 14px;
        height: 14px;
      }
    }
  }
`;
const StyledCloseIcon = styled(CloseIcon)`
  flex-shrink: 0;
  cursor: pointer;
  &:hover,
  &:active {
    path {
      fill: ${(props) => props.theme.colors.primary1};
    }
  }
`;

const width_change = keyframes`
  0% {
   width:100%;
  }
  50% {
    width:50%;
  }
  100% {
    width:0;
  }
`;

const SplitLine = styled.div`
  width: 100%;
  height: 1px;
  margin: 20px 0;
  /* transition: width 3s linear; */
`;
const PendingSplitLine = styled(SplitLine)`
  background: ${(props) => props.theme.colors.border1};
`;
const FilledSplitLine = styled(SplitLine)`
  background: ${(props) => props.theme.colors.text2};
  animation: ${width_change} 3s linear;
  animation-fill-mode: forwards;
`;
const UnfilledSplitLine = styled(SplitLine)`
  background: ${(props) => props.theme.colors.text5};
  animation: ${width_change} 3s linear;
  animation-fill-mode: forwards;
`;
const Symbol = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    display: flex;
    align-items: center;

    gap: 10px;
    .symbol_name {
      color: ${(props) => props.theme.colors.text1};
      font-family: Arial;
      font-size: ${(props) => props.theme.fontSize.header2};
      font-style: normal;
      font-weight: 700;
      line-height: 100%;
    }
    .future_type {
      font-family: Arial;
      font-size: ${(props) => props.theme.fontSize.small};
      font-style: normal;
      font-weight: 400;
      line-height: 120%;
    }
    .future_type_long {
      color: ${(props) => props.theme.colors.text2};
    }
    .future_type_short {
      color: ${(props) => props.theme.colors.text5};
    }
    img {
      border-radius: 50%;
    }
  }
  .view {
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    text-decoration-line: underline;
    cursor: pointer;
  }
`;
type TypeMap = { [key: string]: React.ReactNode };

const OrderMessage: React.FC<{
  orderStatus: string;
  orderType: string;
  symbolName: string;
  isLong: boolean;
  hash?: string;
  index: number;
  position: string;
}> = ({
  orderType,
  orderStatus,
  symbolName,
  isLong,
  hash,
  index,
  position,
}) => {
  const splitLineMap: TypeMap = {
    pending: <PendingSplitLine />,
    filled: <FilledSplitLine />,
    unfilled: <UnfilledSplitLine />,
  };
  const futureTypeMap: TypeMap = { long: "Long", short: "Short" };

  const orderTypeMap: TypeMap = {
    limit_open: "Limit Order",
    market_open: "Market Order",
    stop: "Stop Order",
    market_close: "Market Close",
    limit_close: "Limit Close",
  };

  const [msgs, updateMsgState] = useRecoilState(recoilGlobalMessage);

  const handleClose = () => {
    const _msgs = [...msgs[position]];
    _msgs.splice(index, 1);
    updateMsgState({ ...msgs, [position]: _msgs });
  };
  return (
    <Wrapper>
      <Title>
        <div className="left">
          <p className="type">{orderTypeMap[orderType]}</p>
          <p className="line"></p>
          <div className="status">
            <p>{orderStatus}</p>
            {orderStatus !== "pending" && (
              <Image
                src={orderStatus === "filled" ? FilledIcon : UnfilledIcon}
                alt=""
              />
            )}
          </div>
        </div>

        <StyledCloseIcon
          onClick={() => {
            handleClose();
          }}
        />
      </Title>
      {splitLineMap[orderStatus]}
      <Symbol>
        <div className="left">
          <TokenImage name={symbolName} width={20} height={20} />
          <p className="symbol_name">{symbolName}USD</p>
          <p className={`future_type future_type_${isLong ? "long" : "short"}`}>
            {futureTypeMap[isLong ? "long" : "short"]}
          </p>
        </div>
        {hash && (
          <p
            className="view"
            onClick={() => {
              window.open(hash, "_blank");
            }}
          >
            view
          </p>
        )}
      </Symbol>
    </Wrapper>
  );
};
export default OrderMessage;
