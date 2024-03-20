"use client";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import ArrowIcon from "@/app/assets/header/arrow.svg";
import Image from "next/image";
const Wrapper = styled.div`
  position: relative;
  .cur_currency {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    height: 41px;
    padding-right: 8px;
    .label {
      color: ${(props) => props.theme.colors.text1};
      font-family: Arial;
      font-size: ${(props) => props.theme.fontSize.medium};
      font-style: normal;
      font-weight: 400;
      line-height: 100%;
    }
    .img {
      width: 10px;
      height: 5px;
      flex-shrink: 0;
    }
  }
  .currency_list {
    z-index: 7;
    position: absolute;
    right: 0;
    top: 41px;
    width: 90px;
    border-radius: 8px;
    background: ${(props) => props.theme.colors.fill2};
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 13px 0;
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${(props) => props.theme.colors.text1};
      font-family: Arial;
      font-size: ${(props) => props.theme.fontSize.medium};
      font-style: normal;
      font-weight: 400;
      line-height: 100%;
      cursor: pointer;
    }
    .active {
      color: ${(props) => props.theme.colors.primary1};
    }
  }
`;

const CurrencySelect: React.FC<{
  list?: string[];
  curCurrency: string;
  handleClick?: Function;
  className?: string;
  showSelect?: boolean;
}> = ({ list, curCurrency, handleClick, className, showSelect = true }) => {
  const [showList, setShowList] = useState(false);
  return (
    <Wrapper className={className}>
      <div className="cur_currency" onClick={() => setShowList(!showList)}>
        <p className="label">{curCurrency}</p>
        <Image src={ArrowIcon} width={10} height={5} alt="" />
      </div>
      {showList && showSelect && (
        <div className="currency_list">
          {list.map((item: string) => {
            return (
              <div
                key={item}
                className={`item ${curCurrency === item ? "active" : ""}`}
                onClick={() => {
                  handleClick(item);
                  setShowList(false);
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
      )}
    </Wrapper>
  );
};
export default CurrencySelect;
