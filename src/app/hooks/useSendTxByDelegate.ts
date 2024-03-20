import { TransactionRequest } from "viem";
import { encodeTx } from "../lib/txTools";
import { useContractParams } from "./useContractParams";
import { useAppConfig } from "./useAppConfig";
import { useSendTx } from "./useSendTx";





export const useSendTxByDelegate = () => {


    const appConfig = useAppConfig();
    const DelegationHubContractParams = useContractParams(appConfig.contract_address.DelegationHubContractParams);
    const sendTx = useSendTx();


    // TODO: 增加 1ct 代理交易
    const _sendByDelegate = async function ({ data, value, to, showMsg = true }: { showMsg: boolean
    } & Pick<TransactionRequest, 'data' | 'value' | 'to'>) {


        const txData = encodeTx({
            contractAddress: DelegationHubContractParams.address,
            functionName: 'delegate',
            args: data ? [data] : [],
        });

        const res = await sendTx({
            to: DelegationHubContractParams.address,
            data: txData,
            value: value,
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