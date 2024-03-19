import { useAppConfig } from "@/app/hooks/useAppConfig";
import { useContractParams } from "@/app/hooks/useContractParams";
import { useStableTokens } from "@/app/hooks/useTokens";
import { multicallFn } from "@/app/lib/multicallFn";
import { useRequest } from "ahooks";
import { useCallback, useEffect, useRef } from "react";
import { Address, Client } from "viem";
import { useClient } from "wagmi";





export const BalanceAndEffects = () => {


    const appConfig = useAppConfig();

    const LongContractParams = useContractParams(appConfig.contract_address.LongAddress);
    const ShortContractParams = useContractParams(appConfig.contract_address.ShortAddress);
    const LiquidityContractParams = useContractParams(appConfig.contract_address.LiquidityPoolImplementationAddress);
    const ExchangeContractParams = useContractParams(appConfig.contract_address.ExchangeManagerImplementationAddress);
    
    const USDContractParams = useContractParams(appConfig.contract_address.USDAddress);

    const stableTokens = useStableTokens();

    const client = useClient();

    const contractCalls = useRef<any[]>([]);




    useEffect(() => {
        const availableLpCalls = [{
            ...LiquidityContractParams,
            functionName: 'getAvailableToken',
            args: [LongContractParams.address],
          },
          {
            ...LiquidityContractParams,
            functionName: 'getAvailableToken',
            args: [ShortContractParams.address],
          },
          {
            ...LiquidityContractParams,
            functionName: 'getAvailableToken',
            args: [appConfig.contract_address.OptionAddress],
          },
          {
            ...LiquidityContractParams,
            functionName: 'getAvailableToken',
            args: [appConfig.contract_address.USDAddress]
          }];
    
        const epochCalls = [{
            ...ExchangeContractParams,
            functionName: 'epochNumber',
            args: [],
          }];
    
        const stableBalanceCalls = stableTokens.map(tk => {
            return [{
                ...USDContractParams,
                functionName: 'getPrice',
                args: [tk?.address as Address, false],
            }, {
                ...USDContractParams,
                functionName: 'getPrice',
                args: [tk?.address as Address, true],
            }, {
                ...USDContractParams,
                functionName: 'balanceOf',
                args: [USDContractParams?.address as Address],
            }]
        }, []).flat(1);

        contractCalls.current = [availableLpCalls, epochCalls, stableBalanceCalls]
    }, [
        appConfig, 
        USDContractParams, 
        ExchangeContractParams, 
        LiquidityContractParams, 
        LongContractParams, 
        ShortContractParams
    ]) ;



    const runCalls = useCallback(() => {
        async function _run() {
            const  [availableLpCalls, epochCalls, stableBalanceCalls] =  contractCalls.current;
            const [ availableLpResults, epochResults, stableBalanceResults ] = await multicallFn(client as Client, [
                availableLpCalls,
                epochCalls,
                stableBalanceCalls,
            ]);
            // 


        }

        return _run();
    }, []);


    const {run, cancel} = useRequest(runCalls, {
        manual: true,
        pollingInterval: 15_000,
    });


    useEffect(() => {
        // run();

        return () => {
            // cancel();
        }
    }, [run]);







    return null;
}