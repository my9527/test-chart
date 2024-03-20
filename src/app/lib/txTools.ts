import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { getConnectorClient, waitForTransactionReceipt } from "@wagmi/core";
import { Client, PublicClient, WalletClient, encodeFunctionData } from "viem";
import { WagmiProviderProps } from "wagmi";
import { useContractParams } from "../hooks/useContractParams";
import { BigNumberish } from "ethers";


export type SendTxParams = {
    client: PublicClient;
    to: `0x${string}`;
    value?: BigNumberish;

    signer: WalletClient;
    data?: `0x${string}`;
}

interface SendTxInterface {
    (arg: SendTxParams): Promise<string>
}



export const sendTx: SendTxInterface = async ({client, signer, to, value, data }) => {
    try{
        let p: any = {
            to,
            value,
            data,
            // chain: chainId[0],
          };
          if (signer) {
            p.account = signer;
          }
          if (value) {
            p.value = value;
          }
          if (data) {
            p.data = data;
          }
    
          const gasEstimate = await client.estimateGas({
            account: signer?.account?.address,
            ...p,
          });
    
          const hash = await signer.sendTransaction({
            ...p,
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
  contractAddress, 
  functionName, 
  args
}: {
  contractAddress: `0x${string}`, functionName: string, args?: any[]
}) => {

  const contractParams = useContractParams(contractAddress);

  return encodeFunctionData({
    abi: contractParams.abi,
    functionName,
    args: args || [],
  });

}