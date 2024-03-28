import { useAppConfig } from "@/app/hooks/useAppConfig";
import { useContractParams } from "@/app/hooks/useContractParams";
import { useRequest } from "ahooks";
import { useCallback, useEffect } from "react";
import { useClient } from "wagmi";
import { multicallFn } from "@/app/lib/multicallFn";
import { Client } from "viem";
import { ethers } from "ethers";
import dayjs from "dayjs";
import { useRecoilState } from "recoil";
import { recoilLpEpochEndTime } from "@/app/models";

export const useEpochEndTime = () => {
  const appConfig = useAppConfig()
  const ExchangeContractParams = useContractParams(appConfig.contract_address.ExchangeManagerImplementationAddress);

  const client = useClient();

  const [epochEndTime, setEpochEndTime] = useRecoilState(recoilLpEpochEndTime);

  const requestInfo = useCallback(async () => {

    async function _run() {
        
      const epochEndTimeCalls = [{
          ...ExchangeContractParams,
          functionName: 'epochEndTime',
          args: [],
      }];


      const [epochEndTimeCallRes] = await multicallFn(client as Client, [
        epochEndTimeCalls,
      ]);

      const res = epochEndTimeCallRes[0] || {};

      if (res.status === 'success') {
        const timestamp = ethers.BigNumber.from(res.result).toNumber();
        const endTime = dayjs.unix(timestamp);

        let p;

        if (!endTime.isValid()) {
          p = {
            timestamp: NaN,
            endTime: '-',
            startTime: '-',
          };
        } else {
          const startTime = endTime.subtract(1, 'day');

          p = {
            timestamp,
            endTime: endTime.format('YYYY-MM-DD, HH:mm'),
            startTime: startTime.format('YYYY-MM-DD, HH:mm'),
          };
        }

        setEpochEndTime(p)
      }

    }

    return _run();

  }, [ExchangeContractParams]);

  const { run, cancel } = useRequest(requestInfo, {
      manual: true,
      pollingInterval: 150_000,
  });

  useEffect(() => {
      run();

      return () => {
          cancel();
      }
  }, [run, cancel]);

  return { epochEndTime };
}