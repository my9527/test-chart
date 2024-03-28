import { getClient, getWalletClient } from "@wagmi/core";
import { useCallback } from "react";
import { useAccount, useClient, useConfig, usePublicClient } from "wagmi"
import { SendTxParams, awaitTx, sendTx } from "../lib/txTools";
import { Client, PublicClient } from "viem";


export const useSendTx = () => {

    const config = useConfig();
    const client = usePublicClient({
        config,
    }) as PublicClient;

    const _sendTx = useCallback((args: Omit<SendTxParams, 'client'| 'signer'>) => {

        async function _run() {
            try {
                const signer = await getWalletClient(config);
                if (!signer) {
                    throw new Error('Invalid Signer');
                }

                const hash = await sendTx({ ...args, signer, client });

                const res = await awaitTx(hash as `0x${string}`, config);

                console.log('res', res, signer);
                return res;
            } catch (e) {
                console.log("_sendTx error: ", e);
            }


        }

       return _run();
    }, [config, client]);

    return _sendTx;
}
