"use client";
import styled from "styled-components";
import { useState, useMemo, useRef, useEffect } from "react";

type tabsProps = {
  activeTab: number;
  width: number | undefined;
  left: number | undefined;
  gap: number;
};
const TabsWrapper = styled.div<tabsProps>`
  display: flex;
  align-items: center;
  border-bottom: ${(props) => `1px solid ${props.theme.colors.border1}`};
  position: relative;
  gap: ${(props) => {
    return props?.gap + "px";
  }};
  &::before {
    width: ${(props) => {
      return props?.width + "px";
    }};
    height: 2px;
    background-color: ${(props) => props.theme.colors.primary1};
    content: "";
    position: absolute;
    bottom: -1px;
    transition: all 0.3s linear;
    left: ${(props) => {
      return props?.left + "px";
    }};
  }
  .tab {
    box-sizing: border-box;
    color: ${(props) => props.theme.colors.text4};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    position: relative;
    padding: 15px 7px;
    cursor: pointer;
    transition: all 0.3s linear;
    display: flex;
    align-items: center;
  }
  .active_tab {
    color: ${(props) => props.theme.colors.primary1};
  }
`;
export type tabProps = {
  label: string;
  key: any;
  value?: string | number;
};
const Tabs: React.FC<{
  list: tabProps[];
  handleClick: Function;
  className?: string;
  initial?: number;
  gap?: number;
}> = ({ list, handleClick, className, gap = 20, initial = 0 }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const tabRefs = useRef<[HTMLDivElement | null]>([null]);

  const left = useMemo(() => {
    let width = 0;
    for (let i = 0; i < activeTab; i++) {
      width += (tabRefs?.current[i]?.clientWidth || 0) + gap;
    }
    return width;
  }, [tabRefs, activeTab]);

  useEffect(() => {
    if(initial) {
      setActiveTab(initial);
    }
  }, []);

  return (
    <TabsWrapper
      gap={gap}
      className={className}
      activeTab={activeTab}
      left={left}
      width={tabRefs?.current[activeTab]?.clientWidth}
    >
      {list.map((item: tabProps, index: number) => {
        return (
          <div
            key={item.key}
            ref={(element) => (tabRefs.current[index] = element)}
            className={`tab ${activeTab === index ? "active_tab" : ""}`}
            onClick={() => {
              setActiveTab(index);
              handleClick(item);
            }}
          >
            {item.label}
          </div>
        );
      })}
    </TabsWrapper>
  );
};
export default Tabs;
