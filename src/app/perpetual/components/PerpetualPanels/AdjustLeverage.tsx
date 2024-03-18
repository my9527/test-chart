"use client";
import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
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
`;
const AdjustLeverage: React.FC<{
  leverage: number;
  setLeverage: (value: number) => any;
}> = ({ leverage, setLeverage }) => {
  const { symbolName } = useCurToken();
  const [value, setValue] = useState<number>(leverage);
  const max = 100;
  const min = 1;
  const valueRef = useRef<number>();

  useEffect(() => {
    valueRef.current = value;
    setLeverage(value);
  }, [value, valueRef?.current]);

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
            if (value < min) {
              setValue(min);
            }
          }}
          onChange={(e: React.FormEvent<HTMLInputElement>, type: string) => {
            const reg = /^\+?[1-9][0-9]*$/;
            const flag = reg.test(e?.currentTarget?.value);
            if (!e?.currentTarget?.value) {
              setValue(0);
              return;
            }
            if (type === "number" && flag) {
              if (valueRef?.current === +e?.currentTarget?.value) {
              } else {
                if (+e?.currentTarget.value > max) {
                  setValue(max);
                } else {
                  setValue(+e?.currentTarget.value || 0);
                }
              }
            }
          }}
        />
      </LeverageRatio>
      <Slider
        onChange={(value) => {
          if (valueRef?.current === value) {
          } else {
            setValue(value);
          }
        }}
        value={value || 0}
        marks={[
          {
            label: "1X",
            value: 1,
          },
          {
            label: "25X",
            value: 25,
          },
          {
            label: "50X",
            value: 50,
          },

          {
            label: "75X",
            value: 75,
          },
          {
            label: "100X",
            value: 100,
          },
        ]}
        min={min}
        max={max}
        step={25}
        unit="X"
      />
      <Desc>
        The maximum opening after adjusting the leverage ratio is{" "}
        <span className="highlight">0.00BTC</span>
        Required deposit of <span className="highlight">0 USD</span>
      </Desc>
      <Tips>
        The current leverage ratio is high, please be aware of the risk
      </Tips>
    </Wrapper>
  );
};
export default AdjustLeverage;
