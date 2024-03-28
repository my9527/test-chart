"use client";
import styled from "styled-components";
import Button from "../Button";
import Image from "next/image";
import LongIcon from "@/app/assets/perpetual/long.svg";
import ShortIcon from "@/app/assets/perpetual/short.svg";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  img {
    width: 25px;
    height: 18px;
    flex-shrink: 0;
    margin-right: 14px;
  }
`;
const Btns: React.FC<{
  handleClick: Function;
  className?: string;
  longBtnText: string;
  shortBtnText: string;
  showIcon?: boolean;
  longSuffixChildren?: React.ReactNode;
  shortSuffixChildren?: React.ReactNode;
}> = ({
  handleClick,
  className,
  longBtnText,
  shortBtnText,
  showIcon,
  longSuffixChildren,
  shortSuffixChildren,
}) => {
  return (
    <Wrapper className={className}>
      <Button
        type="long"
        btnText={longBtnText}
        onClick={() => {
          handleClick && handleClick("long");
        }}
        suffixChildren={longSuffixChildren}
      >
        {showIcon && <Image src={LongIcon} alt="" width={25} height={18} />}
      </Button>
      <Button
        type="short"
        btnText={shortBtnText}
        onClick={() => {
          handleClick && handleClick("short");
        }}
        suffixChildren={shortSuffixChildren}
      >
        {showIcon && <Image src={ShortIcon} alt="" width={25} height={18} />}
      </Button>
    </Wrapper>
  );
};
export default Btns;
