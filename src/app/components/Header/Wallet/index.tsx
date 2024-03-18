import styled from "styled-components";
import { Drawer } from '@/app/components/Drawer'

import { useAccount, useConfig, useSignMessage } from "wagmi";
import { WalletButton } from "@rainbow-me/rainbowkit";

import { walletConfigs } from "./contants";

import { UserWalletInfo } from "./UserWalletInfo"; 
import { ConnectWallet } from "./ConnectWallet";
import { useCallback, useContext, useEffect, useRef } from "react";
import { UserSignedContext } from "@/app/context/UserSignedProvider";
import { generateSignApiTokenMessage } from "@/app/config/common";
import { sleep } from "@/app/lib/sleep";
import { resolve } from "path";
import { compareAddress } from "@/app/lib/compareAddress";
import { getAccount } from "wagmi/actions";



interface IWalletProps {
  onHide: () => void,
  visible: boolean,
}


const Content = styled.div`
    padding: 10px 0px;
    height: 100%;

`






const Wallet: React.FunctionComponent<IWalletProps> = ({ onHide, visible }) => {

  const { address } = useAccount();

  const { updateUserSigned } = useContext(UserSignedContext);
  const { signMessage } = useSignMessage();


  const signedOnChange = useCallback((address_: string) => {
    async function _run() {

      try{
        await sleep(1000);
        const time = Date.now();
        const messageToSign = generateSignApiTokenMessage(address as string, time);
        const result: any = await new Promise(resolve => {
          signMessage({
            message: messageToSign,
            account: address,
          }, {
            onSuccess(signed) {
              const result = {
                user: address as string,
                signed: signed,
                signedAt: time
              }
              updateUserSigned(result);
              resolve(result);
            },
            onError(error) {
              resolve(error);
            }
          })
         });
      } catch(e) {
      }
    }

    _run();
  }, [address]);
  const config = useConfig();

  

  const signAfterConnect = useCallback(() => {
    const account = getAccount(config);
    signedOnChange(account.address as string);
  }, [config]);
  return (
    <Drawer onHide={onHide} visible={visible}>
      <Content>
        <UserWalletInfo address={address} />
        <ConnectWallet afterConnect={signAfterConnect} />
      </Content>
    </Drawer>
  );
};

export default Wallet;
