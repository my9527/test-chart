import styled from "styled-components";
import { Drawer } from '@/app/components/Drawer'
import Image from "next/image";
import MetaMaskIcon from "@/app/assets/header/metamask.svg";
import WalletConnectIcon from "@/app/assets/header/walletconnect.svg";

const walletConfigs = [
  {
    name: 'MetaMask',
    icon: <Image alt="MetaMask logo" src={MetaMaskIcon} width={24} height={24} />,
  },
  {
    name: 'WalletConnect',
    icon: <Image alt="WalletConnect logo" src={WalletConnectIcon} width={24} height={24} />,
  },
]

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

const Wallet: React.FunctionComponent<IWalletProps> = ({ onHide, visible }) => {
  return (
    <Drawer onHide={onHide} visible={visible}>
      <Title>Connect your wallet</Title>
      <Divider />
      <WalletList>
        {
          walletConfigs.map(({ name, icon }) => (
            <Item key={name}>
              {icon} {name}
            </Item>
          ))
        }
      </WalletList>
    </Drawer>
  );
};

export default Wallet;
