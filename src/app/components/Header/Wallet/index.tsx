import styled from "styled-components";
import { Drawer } from '@/app/components/Drawer'

import { useAccount } from "wagmi";
import { WalletButton } from "@rainbow-me/rainbowkit";

import { walletConfigs } from "./contants";

import { UserWalletInfo } from "./UserWalletInfo"; 
import { ConnectWallet } from "./ConnectWallet";



interface IWalletProps {
  onHide: () => void,
  visible: boolean,
}


const Content = styled.div`
    padding: 10px 0px;
    height: 100%;

`






const Wallet: React.FunctionComponent<IWalletProps> = ({ onHide, visible }) => {

  const { isConnected } = useAccount();

  return (
    <Drawer onHide={onHide} visible={visible}>
      <Content>
        { isConnected ? <UserWalletInfo />: <ConnectWallet /> }
      </Content>
    </Drawer>
  );
};

export default Wallet;
