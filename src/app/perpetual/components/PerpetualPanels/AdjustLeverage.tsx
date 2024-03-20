"use client";
import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";
import useCurToken from "../../hooks/useCurToken";
import TokenImage from "@/app/components/TokenImage";
import Input from "@/app/components/Input";
import Slider from "../Slider";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Symbol = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  .symbol_name {
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
  }
`;
const LeverageRatio = styled.div`
  margin-bottom: 10px;
  .title {
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    margin-bottom: 5px;
  }
`;
const StyledInput = styled(Input)`
  input {
    padding-left: 19px !important;
    background: ${(props) => props.theme.colors.fill3} !important;
    border: none !important;
  }
`;
const Desc = styled.p`
  margin-top: 24px;
  padding: 6px 0;
  color: ${(props) => props.theme.colors.text4};
  font-family: Arial;
  font-size: ${(props) => props.theme.fontSize.small};
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
  .highlight {
    color: ${(props) => props.theme.colors.text1};
  }
`;
const Tips = styled.p`
  color: ${(props) => props.theme.colors.primary1};
  font-family: Arial;
  font-size: ${(props) => props.theme.fontSize.small};
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
  margin-top: 30px;
`;
const AdjustLeverage: React.FC<{
  leverage: number;
  max: number;
  setLeverage: (value: number) => any;
}> = ({ leverage, setLeverage, max }) => {
  const { symbolName } = useCurToken();
  const [value, setValue] = useState<string>(leverage + "");
  const min = 1;

  const [percent, setPercent] = useState<number>(0);

  const marks = useMemo(() => {
    const _step = (max - min + 1) / 4;
    const arr = Array.from({ length: 5 });
    return arr.map((item, index) => {
      const v = Math.ceil(index === 0 ? min : _step * index);

      return {
        label: `${v}X`,
        value: v,
      };
    });
  }, [min, max]);

  useEffect(() => {
    setLeverage(+value);
    if (+value < min) {
      setPercent(0);
    } else {
      setPercent((+value - min) / (max - min));
    }
  }, [value]);

  return (
    <Wrapper>
      <Symbol>
        <TokenImage name={symbolName} />
        <p className="symbol_name">{symbolName}USD</p>
      </Symbol>
      <LeverageRatio>
        <p className="title">Leverage ratio</p>
        <StyledInput
          type="number"
          placeholder="input amount"
          value={value}
          onBlur={() => {
            if (+value < min) {
              setValue(min + "");
            }
          }}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            const reg = /^\+?[1-9][0-9]*$/;
            const flag = reg.test(e?.currentTarget?.value);

            if (!e?.currentTarget?.value) {
              setValue("");
              setPercent(0);
              return;
            }
            if (flag) {
              if (+e?.currentTarget.value > max) {
                setValue(max + "");
              } else {
                setValue(e?.currentTarget.value || "");
              }
            }
          }}
        />
      </LeverageRatio>
      <Slider
        per={percent}
        onChange={(value) => {
          setValue(value + "");
        }}
        marks={marks}
        min={min}
        max={max}
        unit="X"
      />
      {+value > 20 && (
        <Tips>
          The current leverage ratio is high, please be aware of the risk
        </Tips>
      )}
    </Wrapper>
  );
};
export default AdjustLeverage;
