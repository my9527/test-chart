import { ethers } from "ethers";
import { useAppConfig } from "./useAppConfig"
import { multicall } from "viem/actions";
import { AbiItem, ContractFunctionParameters } from "viem";
import { useMemo } from "react";
import { erc20Abi } from "viem";

import LongContractAbi from "@/app/config/abis/futureLong.json";
import ShortContractAbi from "@/app/config/abis/futureShort.json";
import LiquidityPoolContractAbi from "@/app/config/abis/liquidityPool.json";
import OptionManagerContractAbi from "@/app/config/abis/optionManager.json";
import OptionContractAbi from "@/app/config/abis/option.json";

import SlpTokenContractAbi from "@/app/config/abis/slp.json";
import SwapContractAbi from "@/app/config/abis/swapManager.json";
import ExchangeContractAbi from "@/app/config/abis/exchangeManager.json";
import UpdateCollateralOrderImplementationContractAbi from "@/app/config/abis/updateCollateralOrder.json";

import StopOrderImplementationContractAbi from "@/app/config/abis/stopOrder.json";
import MarketOrderImplementationContractAbi from "@/app/config/abis/marketOrder.json";

import LimitOrderImplementationContractAbi from "@/app/config/abis/limitOrder.json";


// import WETHContract from "@/app/config/abis/";
import UserBalanceContractAbi from "@/app/config/abis/userBalance.json";

import ExchangeStableTokenContractAbi from "@/app/config/abis/usd.json";
import StakeSexContractAbi from "@/app/config/abis/stSEX.json";

import StakeSlpContractAbi from "@/app/config/abis/stSLP.json";
import FutureManagerContractAbi from "@/app/config/abis/futureManager.json";
import DelegationHubAbi from '@/app/config/abis/delegationHub.json';

import { useChainId } from "wagmi";





// import MarketOrderImplementationContract










//   address: Address
//   abi: abi
//   functionName:
//     | allFunctionNames // show all options
//     | (functionName extends allFunctionNames ? functionName : never) // infer value
//   args?: (abi extends Abi ? UnionWiden<args> : never) | allArgs | undefined


type ContractParamType = {
    address: `0x${string}`;
    abi: AbiItem[];
    chainId: number;
}




export const useContractParams = (address: string) => {

    const config = useAppConfig();
    const chainId = useChainId();

    const contracts = useMemo(() => {

        // 根据链获取对应contract map
        const _contracts = {
            [config.contract_address.LongAddress]: {
                address: config.contract_address.LongAddress,
                abi: LongContractAbi,
                chainId: chainId,
            },
            [config.contract_address.ShortAddress]: {
                address: config.contract_address.ShortAddress,
                abi: ShortContractAbi,
                chainId: chainId,
            },
            [config.contract_address.LiquidityPoolImplementationAddress]: {
                address: config.contract_address.LiquidityPoolImplementationAddress,
                abi: LiquidityPoolContractAbi,
                chainId: chainId,
            },
            [config.contract_address.futureManager]: {
                address: config.contract_address.futureManager,
                abi: FutureManagerContractAbi,
                chainId: chainId,

            },
            [config.contract_address.LimitOrderImplementationAddress]: {
                address: config.contract_address.LimitOrderImplementationAddress,
                abi: LimitOrderImplementationContractAbi,
                chainId: chainId,
            },
            [config.contract_address.MarketOrderImplementationAddress]: {
                address: config.contract_address.MarketOrderImplementationAddress,
                abi: MarketOrderImplementationContractAbi,
                chainId: chainId,
            },
            [config.contract_address.StopOrderImplementationAddress]: {
                address: config.contract_address.StopOrderImplementationAddress,
                abi: StopOrderImplementationContractAbi,
                chainId: chainId,
            },
            [config.contract_address.UpdateCollateralOrderImplementationAddress]: {
                address: config.contract_address.UpdateCollateralOrderImplementationAddress,
                abi: UpdateCollateralOrderImplementationContractAbi,
                chainId: chainId,
            },
            [config.contract_address.USDAddress]: {
                address: config.contract_address.USDAddress,
                abi: ExchangeStableTokenContractAbi,
            },
            [config.contract_address.UserBalanceImplementationAddress]: {
                address: config.contract_address.UserBalanceImplementationAddress,
                abi: UserBalanceContractAbi,
            },
            [config.contract_address.USDCAddress]: {
                address: config.contract_address.USDCAddress,
                abi: ExchangeStableTokenContractAbi,
            },
            [config.contract_address.WETHAddress]: {
                address: config.contract_address.WETHAddress,
                abi: ExchangeStableTokenContractAbi,
            },
            [config.contract_address.stSEXAddress]: {
                address: config.contract_address.stSEXAddress,
                abi: StakeSexContractAbi,
            },
            [config.contract_address.stSLPAddress]: {
                address: config.contract_address.stSLPAddress,
                abi: StakeSlpContractAbi,
            }
            
        } as Record<`0x${string}`, ContractParamType>

        return _contracts;




    }, [config, chainId]);

    return contracts[address as `0x${string}`];


}