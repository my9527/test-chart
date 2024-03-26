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


export const Deposit = () => {
  const [position, setPosition] = useState<string>('123.00');
  const [receive, setReceive] = useState<string>('123.00');
  return (
    <Wrapper>
      <Description>Same as contract trading, you need to first convert your USDT, USDC, DAI, WEN and other stablecoins into USDQ.</Description>
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
        title="Receive" 
        balance="123,123,123.00"
        currency={"USDQ"}
        value={receive}
        onChange={setReceive}
      />
      <FlexBox justifyContent="center">
        <Button minWidth={56} height={20}>Deposit</Button>
      </FlexBox>
    </Wrapper>
  );
};
