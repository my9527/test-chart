import BalanceInput from "@/app/components/BalanceInput";
import { Description, Wrapper, Button } from "./common";
import { useState } from "react";
import styled from "styled-components";
import ArrowDownIcon from "@/app/assets/stake/arrow-down.svg"
import Image from "next/image";
import FlexBox from "@/app/components/FlexBox";

const ImageWrapper = styled.div`
  margin: 4px auto;
  text-align: center;
  width: 24px;
  height: 24px;
`


export const Buy = () => {
  const [position, setPosition] = useState<string>('123.00');
  const [receive, setReceive] = useState<string>('123.00');
  return (
    <Wrapper>
      <Description>Holding QLP is regarded as a liquidity provider, and your income of LPs will be reflected in the price of QLP.</Description>
      <BalanceInput
        title="Amount" 
        balance="123,123,123.00"
        currency="USDQ"
        action={{
          text: 'Max',
          onClick: () => {},
        }}
        value={position}
        onChange={setPosition}
      />
      <ImageWrapper><Image alt="" src={ArrowDownIcon} width={24} height={24} /></ImageWrapper>
      <BalanceInput 
        title="Your receive" 
        balance="123,123,123.00"
        currency={"QLP"}
        value={receive}
        onChange={setReceive}
      />
      <FlexBox justifyContent="center">
        <Button minWidth={56} height={20}>Buy</Button>
      </FlexBox>
    </Wrapper>
  );
};
