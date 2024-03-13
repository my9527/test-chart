"use client";
import { useMemo } from "react";
import styled from "styled-components";
import { useEffect, useState, useRef } from "react";
const Wrapper = styled.div`
  position: relative;
`;
const Track = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  background: ${(props) => props.theme.colors.border1};
  cursor: pointer;
  height: 2px;
`;
type SliderThumbProps = {
  width: number;
};
const SliderThumb = styled.div<SliderThumbProps>`
  height: 2px;
  background: ${(props) => props.theme.colors.primary1};
  width: ${(props) => props?.width * 100 + "%"};
  display: flex;
  align-items: center;
  z-index: 5;
  position: absolute;
  top: 0;
  left: 0;
`;
const Dot = styled.div`
  width: 8px;
  height: 8px;
  background: ${(props) => props.theme.colors.border1};
  border-radius: 50%;
  box-sizing: border-box;
  flex-shrink: 0;
  cursor: pointer;
`;
const BaseDot = styled(Dot)`
  position: absolute;
  top: 50%;

  transform: translateX(-50%) translateY(-50%);
`;
const CurDot = styled(BaseDot)`
  width: 10px;
  height: 10px;
  border: ${(props) => `2px solid ${props.theme.colors.primary1}`};
  left: 100%;
  transform: translateX(-100%) translateY(-50%);
  cursor: grab;
`;
const SelectedDot = styled(BaseDot)<LeftProps>`
  border: ${(props) => `1px solid ${props.theme.colors.primary1}`};
  left: ${(props) => {
    console.log("left", props?.left);
    return props?.left * 100 + "%";
  }};
  &:first-of-type {
    transform: translateX(0) translateY(-50%);
  }
`;
const Marks = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: -3px;
  left: 0;
  right: 0;
`;
type LeftProps = {
  left: number;
};
const Mark = styled.div<LeftProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${(props) => {
    
    return props?.left * 100 + "%";
  }};
  transform: translateX(-50%);
  .label {
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    margin-top: 10px;
  }
  &:first-of-type {
    align-items: flex-start;
    transform: translateX(0);
  }
  &:last-of-type {
    align-items: flex-end;
    transform: translateX(-100%);
  }
`;
export interface SliderProps {
  className?: string;
  disabled?: boolean;
  value: number;
  min: number;
  max: number;
  step?: number; // 步长，取值必须大于 0，并且可被 (max - min) 整除。
  unit?: React.ReactNode;
  marks?: { label: string; value: number }[];
  tooltip?: React.ReactNode;
  onChange?: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({
  marks = [],
  min = 0,
  max = 100,
  step = 1,
  value = 0,
}) => {
  const [selectedValue, setSelectedValue] = useState(value);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const list = useMemo(() => {
    const num = Math.ceil(value / step) + 1;

    return Array.from({ length: num });
  }, [selectedValue, min, max]);

  return (
    <Wrapper
    //   onMouseDown={(e) => {
    //     console.log("onMouseDown=", e.clientX);
    //   }}
    >
      <Track
        ref={trackRef}
        onClick={(e) => {
          console.log("Trackclick", e.clientX, trackRef?.current?.getClientRects());
          //   setSelectedValue();
        }}
      />
      <SliderThumb
        width={value / (max - min)}
        onClick={(e) => {
          console.log("SliderThumblick", e.clientX);
        }}
      >
        {list.map((item, index) => {
          return index === list.length - 1 ? (
            <CurDot />
          ) : (
            <SelectedDot left={(index * step) / value} />
          );
        })}
      </SliderThumb>
      <Marks>
        {marks.map((i, index) => {
          const per = i?.value / (max - min);
          return (
            <Mark left={index === 0 ? 0 : per > 1 ? 1 : per}>
              <Dot />
              <p className="label">{i?.label}</p>
            </Mark>
          );
        })}
      </Marks>
    </Wrapper>
  );
};
export default Slider;
