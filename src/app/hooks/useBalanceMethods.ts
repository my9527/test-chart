import { useCallback } from "react";
import { Token } from "../config/tokens";
import { ethers } from "ethers";
import { useSendTx } from "./useSendTx";
import { Abi, AbiItem, erc20Abi } from "viem";
import { encodeTx } from "../lib/txTools";
import { useAccount, useCall, useChainId } from "wagmi";
import BigNumber from "bignumber.js";
import { useContractParams } from "./useContractParams";
import { useAppConfig } from "./useAppConfig";
import { useSendTxByDelegate } from "./useSendTxByDelegate";
import { useReadContract } from "./useReadContract";



const MAX_ALLOWANCE = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';


export const useBalanceMethods = () => {



    const appConfig = useAppConfig();
    const sendTx = useSendTx();
    const { address } = useAccount();
    const chainId = useChainId();

    const readContract = useReadContract();
    const { sendByDelegate } = useSendTxByDelegate();
    const DepositContractParams = useContractParams(appConfig.contract_address.UserBalanceImplementationAddress);
    const ExchangeStableTokenContractParams = useContractParams(appConfig.contract_address.USDAddress);



    /**
     * 检查是否授权给spender 使用 allowance_ 数量的 token_
     */
    const checkApprove = useCallback(async (token_: Token, spender: `0x${string}`, allowance_?: number | string) => {


        const approvedAllowence = await readContract({
            abi: erc20Abi as unknown as AbiItem[],
            address: token_.address as `0x${string}`,
            chainId: chainId,
        }, 'allowance', [address, spender]);

        if(allowance_) {
            if(ethers.BigNumber.from(approvedAllowence).gte(allowance_)) {
                return true;
            }
        } else if(ethers.BigNumber.from(approvedAllowence).gt(0)) {
            return true;
        }

        try {
            
            const _toApprove = encodeTx({
                abi: erc20Abi as unknown as AbiItem[],
                functionName: 'approve',
                args: [spender, ethers.BigNumber.from(MAX_ALLOWANCE)],
            });

            const res = await sendTx({
                to: token_.address as `0x${string}`,
                data: _toApprove,
                value: '0x00',
            });



        }catch(e) {
            console.log("approve error:", e);
        }

    }, [chainId, address]);


    const buyStableTx = useCallback(async (token_: Token, amount_: string) => {
        const amount = ethers.utils.parseUnits(amount_, token_.decimal).toString();
        if (!token_) return;
    
        try {
          const _txData = encodeTx({
            abi: ExchangeStableTokenContractParams.abi,
            functionName: 'buy',
            args: [token_.address, '0', amount]
          })
          return _txData;
        } catch (e: any) {
          throw new Error(e);
        }
      }, [ExchangeStableTokenContractParams]);



    /**
     * 向交易所充值, stable token 需要进行购买
     */
    const deposit = useCallback(async (token_: Token, amount: string) => {
        const _amount = ethers.utils.parseUnits(amount, token_.decimal).toString();

        let params = [];
        let delegationHubParam = [];

        if (!token_.native) {
            params.push(...[token_.address, _amount]);
        }

        try{
            const allownace = await checkApprove(token_, DepositContractParams.address, _amount);
            console.log("allownace-----", allownace);

            const userDepositData = encodeTx({
                abi: DepositContractParams.abi,
                args: params,
                functionName: 'userDeposit'
            });

            delegationHubParam.push([DepositContractParams.address, false, 0, userDepositData]);

            if(token_.stable) {
                const buyStableData = await buyStableTx(token_, amount);
                delegationHubParam.push([ExchangeStableTokenContractParams.address, false, 0, buyStableData]);
            }

            console.log("delegationHubParam --->", delegationHubParam);
            // return;
            const res = await sendByDelegate({
                data: delegationHubParam,
            });
            console.log("deposit: ", res);

        } catch(e) {
            console.log("deposit error: ", e);
        }


    }, [buyStableTx]);


    const withdraw = useCallback(async ( ) => {

    }, []);





    return {
        deposit,
        checkApprove,
    };
}