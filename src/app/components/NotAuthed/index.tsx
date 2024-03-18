import { generateSignApiTokenMessage } from "@/app/config/common";
import { UserSignedContext } from "@/app/context/UserSignedProvider";
import { recoilWalletConnectPanel } from "@/app/models";
import { useCallback, useContext, useMemo } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { useAccount, useSignMessage } from "wagmi";



const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    color: red;
`;



export const NotAuthed: FCC = ({ children }) => {


    
    const { address, isConnected } = useAccount();
    const { signed, updateUserSigned } = useContext(UserSignedContext);

    const updateWalletPanelStatu = useSetRecoilState(recoilWalletConnectPanel);
    

    const { signMessage } = useSignMessage();


    const signMsg = useCallback(() => {
        async function _run() {
            const time = Date.now();
            const msgToSign = generateSignApiTokenMessage(address as string, time);
            signMessage({
                message: msgToSign,
                account: address,
            }, {
                onSuccess(signedMsg) {
                    updateUserSigned({
                        signedAt: time,
                        signed: signedMsg,
                        user: address as string,
                    })
                }
            })


        }
        _run();

    }, [address]);




    const content = useMemo(() => {

        let _content = null;

        if(!address || !isConnected) {
            _content = <div onClick={() => updateWalletPanelStatu(true)}> sign in </div>;
        } else if(!signed) {
            _content = <div onClick={signMsg}>Sign Message</div>;
        }
        
        return _content;

    }, [address, isConnected, signed]);


    if(content) {
        return <Wrapper>{content}</Wrapper>;
    }



    return children;
}