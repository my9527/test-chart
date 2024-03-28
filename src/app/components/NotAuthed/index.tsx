import { generateSignApiTokenMessage } from "@/app/config/common";
import { UserSignedContext } from "@/app/context/UserSignedProvider";
import { recoilWalletConnectPanel } from "@/app/models";
import { useCallback, useContext, useMemo } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { useAccount, useSignMessage } from "wagmi";
import LinearGradientButton from "../LinearGradientButton";
import { Row } from "../Row";



const Wrapper = styled(Row)`
    width: 100%;
    height: 100%;
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
            _content = <LinearGradientButton onClick={() => updateWalletPanelStatu(true)}> sign in </LinearGradientButton>;
        } else if(!signed) {
            _content = <LinearGradientButton onClick={signMsg}>Sign Message</LinearGradientButton>;
        }
        
        return _content;

    }, [address, isConnected, signed]);


    if(content) {
        return <Wrapper justify="center">{content}</Wrapper>;
    }



    return children;
}