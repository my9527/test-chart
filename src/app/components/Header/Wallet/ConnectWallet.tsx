import styled from "styled-components";

import { WalletButton } from "@rainbow-me/rainbowkit";

import { walletConfigs } from "./contants";
import { FC, useCallback, useContext, useEffect } from "react";
import { useAccount, useConfig, useConnect, useSignMessage } from "wagmi";
import { UserSignedContext } from "@/app/context/UserSignedProvider";
import { generateSignApiTokenMessage } from "@/app/config/common";
import { getAccount } from "wagmi/actions";




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


type AA =  Parameters<typeof WalletButton.Custom>[0];
// WalletButtonRendererProps
const WalletItem = ({ ready, connected, connect, connector, name, icon, onClick }: Parameters<AA['children']>[0] & {name: string, icon: JSX.Element, onClick: () => void}) => {
  

    const handleClick = useCallback(async () => {
        await connector.connect();
        onClick();
    }, []);

    return (
        <Item key={name} onClick={handleClick}>
            {icon} {name}
        </Item>
    );
}








export const ConnectWallet: FC<{afterConnect: () => void}> = ({ afterConnect }) => {
    const { isConnected } = useAccount();

    if(isConnected) {
        return null;
    }

    return (
        <>
            <Title>Connect your wallet</Title>
            <Divider />
            <WalletList>
                {
                    walletConfigs.map(({ name, icon }) => (

                        <WalletButton.Custom wallet={name}>
                        
                            {(props) => {
                                return (
                                    <WalletItem {...props} onClick={afterConnect} icon={icon} name={name} />
                                );
                            }}
                        </WalletButton.Custom>
                    ))
                }
            </WalletList>
        </>
    );
};

