import { useRequest } from "ahooks";
import { ethers } from "ethers";
import { FC, memo, useCallback, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { AbiItem, Client } from "viem";
import { useClient } from "wagmi";

import { useAppConfig } from "@/app/hooks/useAppConfig";
import { useContractParams } from "@/app/hooks/useContractParams";
import { multicallFn } from "@/app/lib/multicallFn";
import { recoilLPInfo } from "@/app/models";




export const LPEffects: FC = memo(() => {

    const updateLPInfo = useSetRecoilState(recoilLPInfo);

    const appConfig = useAppConfig();
    const LiqulityContractParams = useContractParams(appConfig.contract_address.LiquidityPoolImplementationAddress);

    const client = useClient();

    const requestInfo = useCallback(async () => {


        async function _run() {
            
            const LPCalls = [{
                address: LiqulityContractParams.address as `0x${string}`,
                functionName: 'poolAmount',
                chainId: LiqulityContractParams.chainId,
                abi: LiqulityContractParams.abi as AbiItem[],
                args: [],
            }, {
                address: LiqulityContractParams.address as `0x${string}`,
                functionName: 'poolLockedAmount',
                chainId: LiqulityContractParams.chainId,
                abi: LiqulityContractParams.abi as AbiItem[],
                args: [],
            }];


            const [LPResults] = await multicallFn(client as Client, [
                LPCalls,
            ]);

            const lps = LPResults.reduce((result, rslt: any, index) => {
                const targetCall = LPCalls[index];
                return {
                    ...result,
                    [targetCall.functionName]: ethers.utils.formatUnits(ethers.BigNumber.from(rslt.result), 6),
                };
            }, {
                poolAmount: '0',
                poolLockedAmount: '0',
            });

            updateLPInfo(lps);

            return {
                lps,
            }




            





        }

        return _run();



    }, [LiqulityContractParams]);

    const { run, cancel } = useRequest(requestInfo, {
        manual: true,
        pollingInterval: 15 * 1000,
    });

    useEffect(() => {
        run();

        return () => {
            cancel();
        }
    }, [run, cancel]);



    return null;
});