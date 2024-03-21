import { useEpoch } from "@/app/config/useEpoch";
import { userClaimWithdrawLiquidities } from "@/app/graphql/liquidity/depositAndWithdraw";
import { useAppConfig } from "@/app/hooks/useAppConfig";
import { useContractParams } from "@/app/hooks/useContractParams";
import useGraphqlFetch from "@/app/hooks/useGraphqlFetch";
import { useTokenByName } from "@/app/hooks/useTokens";
import { multicallFn } from "@/app/lib/multicallFn";
import { uniqArrWithObjParams } from "@/app/utils/tools";
import { useRequest } from "ahooks";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { useCallback, useEffect } from "react";
import { Client } from "viem";
import { useAccount, useClient } from "wagmi";

export function useClaimableInfo () {
  const { address } = useAccount();
  const _fetch = useGraphqlFetch('perpetual', userClaimWithdrawLiquidities);
  const appConfig = useAppConfig();
  const client = useClient();
  const LiqulityContractParams = useContractParams(appConfig.contract_address.LiquidityPoolImplementationAddress);
  const epochNumber = useEpoch()
  
  //TODO: get token info
  const slpToken = useTokenByName('SLP');

 
  const getClaimableEpoch = useCallback((addr: string) => {
    async function _run () {
      // 获取可领取Epoch
      // 使用Graphql先查询一次用户的deposit和Withdraw Epoch，然后再根据拿到的结果去走合约查询。
      const liquidityRes: any = await _fetch({address: addr});
      // token可领取epoch
      const userProvideLiquidities = uniqArrWithObjParams(liquidityRes?.userProvideLiquidities, 'epoch');
      // // usdx可领取epoch
      const userWithdrawLiquidities = uniqArrWithObjParams(liquidityRes?.userWithdrawLiquidities, 'epoch');
      

      //合约查询
      if (!epochNumber && !address) return [];
      if (BigNumber(epochNumber).lt(1)) return [];

      const getClaimableSlpContracts = userProvideLiquidities?.length
      ? userProvideLiquidities.map((epochNum: any) => {
          return {
            ...LiqulityContractParams,
            functionName: 'getWithdrawUserSLPClaim', // 当前epoch可以领取slp的量
            args: [epochNum?.epoch, addr],
          };
        })
      : [];
    const getWithdrawAmountContracts = userWithdrawLiquidities?.length
      ? userWithdrawLiquidities.map((epochNum: any) => {
          return {
            ...LiqulityContractParams,
            functionName: 'getUserWithdrawAmount', // 当前epoch可以领取usdx的量
            args: [epochNum?.epoch, addr],
          };
        })
      : [];

      const contracts = [...getClaimableSlpContracts, ...getWithdrawAmountContracts];
      const res = await multicallFn(client as Client, [
        contracts,
      ]);

      const withdrawSlpHistory = userProvideLiquidities.map((epochNum, index) => {
        const value = res[index] ? (Array.isArray(res[index]) ? res[index]?.[0] : res[index]) : 0; // slp amount
        const amount = ethers.utils.formatUnits(ethers.BigNumber.from(value), slpToken?.decimal);
        return {
          epochNumber: epochNum?.epoch,
          amount,
        };
      });
  
      const totalClaimable = withdrawSlpHistory.reduce((a, b) => BigNumber(b.amount).plus(a).toNumber(), 0);


      const withdrawAmountHistory = userWithdrawLiquidities.map((epochNum, index) => {
        const startIndex = getClaimableSlpContracts.length;
        const curIndex = startIndex + index;
        const value = res[curIndex] ? (Array.isArray(res[curIndex]) ? res[curIndex]?.[0] : res[curIndex]) : 0; // slp amount
        const amount = ethers.utils.formatUnits(ethers.BigNumber.from(value), slpToken?.decimal);
        return {
          epochNumber: epochNum?.epoch,
          amount,
        };
      });

      const totalWithdraw = withdrawAmountHistory.reduce((a, b) => BigNumber(b.amount).plus(a).toNumber(), 0);

      return {
        totalClaimable,
        totalWithdraw
      }
  
    };
    return _run();
  }, [])


  const { run, error, data } = useRequest(getClaimableEpoch, {
    manual: true,
    pollingInterval: 150_000,
    // defaultParams: [address],
    refreshDeps: [getClaimableEpoch],
  });

  useEffect(() => {
    if(address) {
      run(address);
    }
  }, [address]);

  return data as {
    totalClaimable: number,
    totalWithdraw: number
  }

}