"use client";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { recoilIndexPrices } from "@/app/models";
import { filterPrecision } from "@/app/utils/tools";

type WrapperProps = { change: string };
const Wrapper = styled.div<WrapperProps>`
  color: ${(props) =>
    +props.change > 0
      ? props.theme.colors.text2
      : +props.change === 0
      ? props.theme.colors.text4
      : props.theme.colors.text5};
  font-family: Arial;
  font-style: normal;
  line-height: 100%;
  font-weight: 700;
  .change {
    font-size: ${(props) => props.theme.fontSize.small};
  }
  .price {
    font-size: ${(props) => props.theme.fontSize.header2};
    margin-bottom: 3px;
  }
`;

const ChangPrice: React.FC<{ symbolName: string }> = ({ symbolName }) => {
  const indexPrices = useRecoilValue(recoilIndexPrices);
  const change = indexPrices[symbolName]?.change;

  return (
    <Wrapper change={change}>
      <p className="price">{indexPrices[symbolName]?.price || "-"}</p>
      <p className="change">{filterPrecision(change || 0, 2)}%</p>
    </Wrapper>
  );
};
export default ChangPrice;
