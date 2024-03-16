import styled from "styled-components";

import { WalletButton } from "@rainbow-me/rainbowkit";

import { walletConfigs } from "./contants";
import { FC } from "react";




interface IWalletProps {
    onHide: () => void,
    visible: boolean,
}

const Divider = styled.div`
  height: 1px;
  background-color: ${(props) => props.theme.colors.border1}
`

const Title = styled.h2`
  font-size: ${props => props.theme.fontSize.header2};
  padding: 10px 0;
`

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 21px;
  background: ${(props) => props.theme.colors.fill3};
  padding: 10px 12px;
  border-radius: 8px;
  &:hover {
    background: linear-gradient(90deg, #634AFF 0%, #7E73FF 100%);
  }
`

const WalletList = styled.div`
  padding-top: 36px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
`






export const ConnectWallet: FC = () => {


    return (
        <>
            <Title>Connect your wallet</Title>
            <Divider />
            <WalletList>
                {
                    walletConfigs.map(({ name, icon }) => (

                        <WalletButton.Custom wallet={name}>
                            {({ ready, connect }) => {
                                return (
                                    <Item key={name} onClick={connect}>
                                        {icon} {name}
                                    </Item>
                                );
                            }}
                        </WalletButton.Custom>
                    ))
                }
            </WalletList>
        </>
    );
};

