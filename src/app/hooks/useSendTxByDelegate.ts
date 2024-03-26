import { TransactionRequest } from "viem";
import { encodeTx } from "../lib/txTools";
import { useContractParams } from "./useContractParams";
import { useAppConfig } from "./useAppConfig";
import { useSendTx } from "./useSendTx";





export const useSendTxByDelegate = () => {


    const appConfig = useAppConfig();
    const DelegationHubContractParams = useContractParams(appConfig.contract_address.DelegationHubImplementationAddress);
    const sendTx = useSendTx();


    // TODO: 增加 1ct 代理交易
    // & Pick<TransactionRequest, 'data' | 'value' | 'to'>
    const _sendByDelegate = async function ({ data, value, to, showMsg = true }: { 
        showMsg?: boolean,
        data: any,
        value?: any,
        to?: any,
    } ) {


        const txData = encodeTx({
            // contractAddress: DelegationHubContractParams.address,
            abi: DelegationHubContractParams.abi,
            functionName: 'delegate',
            args: data ? [data] : [],
        });

        const res = await sendTx({
            to: DelegationHubContractParams.address,
            data: txData,
            value: value || '0x0',
        });

        if(showMsg) {
            console.log("_sendByDelegate show msg:", res);
        }

        return res;
       

    }


    return {
        sendByDelegate: _sendByDelegate,
    }

}