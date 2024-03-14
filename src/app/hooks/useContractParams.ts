import { ethers } from "ethers";
import { useAppConfig } from "./useAppConfig"
import { multicall } from "viem/actions";
import { ContractFunctionParameters } from "viem";
import { useMemo } from "react";
import { erc20Abi } from "viem";

import LongContractAbi from "@/app/config/abis/futureLong.json";
import ShortContractAbi from "@/app/config/abis/futureShort.json";
import LiquidityPoolContractAbi from "@/app/config/abis/liquidityPool.json";
import OptionManagerContractAbi from "@/app/config/abis/optionManager.json";
import OptionContractAbi from "@/app/config/abis/option.json";

import SlpTokenContractAbi from "@/app/config/abis/slp.json";
import SwapContractAbi from "@/app/config/abis/swapManager.json";
import ExchangeContract from "@/app/config/abis/exchangeManager.json";
import UpdateCollateralOrderImplementationContract from "@/app/config/abis/updateCollateralOrder.json";

import StopOrderImplementationContract from "@/app/config/abis/stopOrder.json";
import MarketOrderImplementationContract from "@/app/config/abis/marketOrder.json";

import LimitOrderImplementationContract from "@/app/config/abis/limitOrder.json";


// import WETHContract from "@/app/config/abis/";
import WithdrawContract from "@/app/config/abis/userBalance.json";

import DepositContract from "@/app/config/abis/userBalance.json";

import ExchangeStableTokenContract from "@/app/config/abis/usd.json";
import StakeSexContract from "@/app/config/abis/stSEX.json";

import StakeSlpContract from "@/app/config/abis/stSLP.json";
import FutureManagerContractAbi from "@/app/config/abis/futureManager.json";





// import MarketOrderImplementationContract










//   address: Address
//   abi: abi
//   functionName:
//     | allFunctionNames // show all options
//     | (functionName extends allFunctionNames ? functionName : never) // infer value
//   args?: (abi extends Abi ? UnionWiden<args> : never) | allArgs | undefined





export const useContractParams = (address: string) => {

    const config = useAppConfig();

    const contracts = useMemo(() => {

        // 根据链获取对应contract map
        const _contracts = {
            [config.contract_address.LongAddress]: {
                address: config.contract_address.LongAddress,
                abi: LongContractAbi,
            },
            [config.contract_address.ShortAddress]: {
                address: config.contract_address.ShortAddress,
                abi: ShortContractAbi,
            },
            [config.contract_address.LiquidityPoolImplementationAddress]: {
                address: config.contract_address.LiquidityPoolImplementationAddress,
                abi: LiquidityPoolContractAbi,
            },
            [config.contract_address.futureManager]: {
                address: config.contract_address.futureManager,
                abi: FutureManagerContractAbi
            }
        }

        return _contracts;




    }, [config]);

    return contracts[address];


}