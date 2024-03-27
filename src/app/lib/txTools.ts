import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { getConnectorClient, waitForTransactionReceipt } from "@wagmi/core";
import { AbiItem, Client, PublicClient, WalletClient, encodeFunctionData } from "viem";
import { WagmiProviderProps } from "wagmi";
import { useContractParams } from "../hooks/useContractParams";
import { BigNumberish } from "ethers";


export type SendTxParams = {
    client: PublicClient;
    to: `0x${string}`;
    value?: BigNumberish;

    signer: WalletClient;
    data?: `0x${string}`;
    chain?: string | number;
}

interface SendTxInterface {
    (arg: SendTxParams): Promise<string>
}



export const sendTx: SendTxInterface = async ({client, signer, to, value, data, chain }) => {
    try{
        let p: any = {
            to,
            value,
            data,
            // chain: chainId[0],
          };
          if (signer) {
            p.account = signer.account?.address;
          }
          if (value) {
            p.value = value;
          }
          if (data) {
            p.data = data;
          }


          // await client.estimateGas()
    
          const gasEstimate = await client.estimateGas({
            ...p,
            // account: signer?.account?.address,
          });
    
          const hash = await signer.sendTransaction({
            ...p,
            chain
            // account: signer?.account?.address,
          });
    
          return hash
    } catch(e){
        console.log('send tx error:' , e);
        throw e;
    }
  


    // const gasEstimate = await client.estimateGas({
    //     account: signer?.account?.address,
    //     ...p,
    //   });
}


// WagmiProviderProps['config']
export const awaitTx = async (txHash: `0x${string}`, clientConfig: WagmiProviderProps['config']) => {
  if (!txHash) {
    throw new Error('Invalid hash');
  }
 
  try{
    const tx = await waitForTransactionReceipt(clientConfig, {
      hash: txHash
    });

    if (tx.status !== 'success') {
      throw new Error('Transaction Failed');
    }

    return tx;
  } catch(e) {
    throw e;
  }



}


// encode tx params
export const encodeTx = ({
  abi, 
  functionName, 
  args
}: {
  abi: AbiItem[], functionName: string, args?: any[]
}) => {
  return encodeFunctionData({
    abi: abi,
    functionName,
    args: args || [],
  });

}