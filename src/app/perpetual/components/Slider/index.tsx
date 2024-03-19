"use client";
import React, { useMemo } from "react";
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
type PercentProps = {
  percent: number;
};
const SliderThumb = styled.div<PercentProps>`
  transition: all 0.3s linear;
  height: 2px;
  background: ${(props) => props.theme.colors.primary1};
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: ${(props) => {
    return (1 - props?.percent) * 100 + "%";
  }};
  cursor: pointer;
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
const CurDot = styled(Dot)<PercentProps>`
  transition: all 0.3s linear;
  width: 10px;
  height: 10px;
  border: ${(props) => `2px solid ${props.theme.colors.primary1}`};
  position: absolute;
  top: 50%;
  z-index: 6;
  right: 0;
  transform: ${(props) => {
    if (props?.percent === 0) {
      return "translate(100%,-50%)";
    } else if (props?.percent === 1) {
      return "translate(0,-50%)";
    } else {
      return "translate(50%,-50%)";
    }
  }};
  .value {
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.min};
    font-style: normal;
    font-weight: 400;
    line-height: 120%;
    position: relative;
    transform: ${(props) => {
      if (props?.percent === 0) {
        return "translate(0, -100%)";
      } else if (props?.percent === 1) {
        return "translate(-100%,-100%)";
      } else {
        return "translate(-100%,-100%)";
      }
    }};
  }
`;

const SelectedDot = styled(Dot)`
  border: ${(props) => `1px solid ${props.theme.colors.primary1}`};
  transform: translateX(0) translateY(0);
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
const Mark = styled.div<PercentProps>`
  transition: all 0.3s linear;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${(props) => {
    return props?.percent * 100 + "%";
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
    cursor: pointer;
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
  value?: number;
  min: number;
  max: number;
  step?: number; // 步长，取值必须大于 0，并且可被 (max - min) 整除。
  unit?: React.ReactNode;
  marks?: { label: string; value: number }[];
  tooltip?: React.ReactNode;
  onChange?: (value: number) => void;
  per: number;
}

const Slider: React.FC<SliderProps> = ({
  marks = [],
  min = 0,
  max = 100,
  step = 1,
  value = 0,
  unit,
  onChange,
  per,
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);

  const [percent, setPercent] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isChange, setIsChange] = useState(false);

  const trackWidth = useMemo(() => {
    return trackRef?.current?.clientWidth || 0;
  }, [trackRef?.current]);

  const zeroX = useMemo(() => {
    return trackRef?.current?.getClientRects()[0].x || 0;
  }, [trackRef?.current]);

  const [startX, setStartX] = useState(zeroX);

  const thumbWidth = useMemo(() => {
    return thumbRef?.current?.clientWidth || 0;
  }, [thumbRef?.current]);

  const handleDotClick = (left: number) => {
    setIsChange(true);
    setPercent(left);
  };

  useEffect(() => {
    if (startX && isDragging) {
      const distanceX = startX - zeroX;

      if (distanceX) {
        setIsChange(true);
        const _per = (distanceX - 5) / trackWidth;
        setPercent(_per > 1 ? 1 : _per < 0 ? 0 : _per);
      }
    }
  }, [startX, zeroX, isDragging]);

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setStartX(e.clientX);
    }
  };
  const handleMouseUp = (e: MouseEvent) => {
    setIsDragging(false);
    setStartX(e.clientX);
  };

  useEffect(() => {
    if (isDragging) {
      window.onmousemove = (e) => {
        handleMouseMove(e);
      };
      window.onmouseup = (e) => handleMouseUp(e);
    } else {
      window.onmousemove = null;
      window.onmouseup = null;
    }
  }, [isDragging]);

  useEffect(() => {
    onChange && isChange && onChange(Math.floor((max - min) * percent + min));
  }, [percent, isChange]);
  return (
    <Wrapper>
      <Track
        ref={trackRef}
        onClick={(e) => {
          setIsChange(true);
          setPercent((e.clientX - zeroX - 5) / trackWidth);
        }}
      />
      <SliderThumb
        ref={thumbRef}
        percent={per < 0 ? 0 : per > 1 ? 1 : per}
        onClick={(e) => {
          if (!isDragging) {
            setIsChange(true);
            setPercent((e.clientX - zeroX - 5) / trackWidth);
          }
        }}
      >
        <CurDot
          percent={per < 0 ? 0 : per > 1 ? 1 : per}
          onMouseDown={(e) => {
            e.nativeEvent.stopImmediatePropagation();

            setIsDragging(true);
            setStartX(thumbWidth + zeroX);
          }}
        >
          <p className="value">
            {(max - min) * per + min < 1
              ? ((max - min) * per + min).toFixed(1)
              : Math.floor((max - min) * per + min)}
            {/* {per} */}
            {unit}
          </p>
        </CurDot>
      </SliderThumb>
      <Marks>
        {marks.map((i, index) => {
          const left = (i?.value - min) / (max - min);
          const _left = index === 0 ? 0 : left > 1 ? 1 : left;

          return (
            <Mark
              key={_left}
              percent={_left}
              onClick={(e) => {
                handleDotClick(_left);
              }}
            >
              {left > per ? <Dot /> : <SelectedDot />}
              <p className="label">{i?.label}</p>
            </Mark>
          );
        })}
      </Marks>
    </Wrapper>
  );
};
export default Slider;
