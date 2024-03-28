import { useAppConfig } from "@/app/hooks/useAppConfig";
import { useContractParams } from "@/app/hooks/useContractParams";
import { multicallFn } from "@/app/lib/multicallFn";
import { sleep } from "@/app/lib/sleep";
import { useCountDown } from "ahooks";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { AbiItem, Client } from "viem";
import { useClient } from "wagmi";




export const FundingFeeCountDown: FC = memo(() => {

    const appConfig = useAppConfig();
    const client = useClient();
    const LongContractParams = useContractParams(appConfig.contract_address.LongAddress);

    const [fundingDate, updateFundingFeeCountDown] = useState<dayjs.Dayjs | undefined>();

    const queryCountDown = useCallback(() => {

        async function _run() {
            try{
                const [countDownResults] = await multicallFn(client as Client, [[{
                    address: LongContractParams.address as `0x${string}`,
                    abi: LongContractParams.abi as AbiItem[],
                    functionName: 'fundingUpdateLastTime',
                    args: [9], // 统一使用btc的更新时间
                }]]);
    
    
                
                const lastTime = BigNumber((countDownResults[0] as any)?.result.toString()).multipliedBy(1000).toString();
                const targetTime = dayjs(+lastTime).add(appConfig.epoch_duration, 'h');
                updateFundingFeeCountDown(targetTime);
            } catch(e) {
                // 请求失败，等待2s 后进行重试
                await sleep(2000);
                _run();
            }
        }

        _run();
    }, [LongContractParams, appConfig]);

    const [, fundingFormattedRes] = useCountDown({
        targetDate: fundingDate,
        onEnd: () => {
            queryCountDown();
        },
    });

    useEffect(() => {
        queryCountDown();
    }, []);


    if(!fundingDate) {
        return null;
    }

    const { hours: fundingHours, minutes: fundingMinutes, seconds: fundingSeconds } = fundingFormattedRes;

   
    return <span>{fundingHours}h {fundingMinutes}m {fundingSeconds}s</span>;
});