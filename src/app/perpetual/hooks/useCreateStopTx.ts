import { FutureType } from "@/app/config/common";
import { Token } from "@/app/config/tokens";
import { useAppConfig } from "@/app/hooks/useAppConfig";
import { useContractParams } from "@/app/hooks/useContractParams";
import { formatNumber } from "@/app/lib/common";
import { encodeTx } from "@/app/lib/txTools";
import { getExponent } from "@/app/utils/tools";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { useCallback } from "react";

// 合约执行方法名称
const MakeOrderFunctionName = {
    LIMIT: 'makeIncreaseLimitOrder',
    MARKET: 'makeIncreaseMarketOrder',
    STOP: 'makeFutureStopOrder',
}


export const useCreateStopTx = () => {

    const appConfig = useAppConfig();
    const StopOrderContractParams = useContractParams(appConfig.contract_address.StopOrderImplementationAddress);

    const createStopTx = useCallback((token_: Token, size: string | number,triggerPrice: string, futureType_: FutureType, isStopLoss: boolean ) => {


        const formattedTokenSizeToPar = BigNumber(size)
        .div(BigNumber.max(token_?.pars, 1))
        .toString();
    
        const curTokenParDecimal = getExponent(token_.pars);
        
        const formattedSize = ethers.utils
            .parseUnits(formatNumber(formattedTokenSizeToPar, curTokenParDecimal), curTokenParDecimal)
            .toString();
        // futureId,
        // size,
        // triggerPrice,
        // isStopLoss,
        // futureType,
        const paramData = encodeTx({
          abi: StopOrderContractParams.abi,
          functionName: MakeOrderFunctionName.STOP,
          args: [
            token_.futureLongId,
            formattedSize,
            triggerPrice,
            isStopLoss,
            futureType_
          ]
        });
  
  
        return [
          StopOrderContractParams.address,
          false,
          appConfig.executionFee,
          paramData
        ]
  
      }, [StopOrderContractParams, appConfig]);


    return createStopTx;
}