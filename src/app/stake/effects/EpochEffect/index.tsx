import { useAppConfig } from "@/app/hooks/useAppConfig";
import { useContractParams } from "@/app/hooks/useContractParams";
import { useRequest } from "ahooks";
import { useCallback, useEffect } from "react";
import { useClient } from "wagmi";
import { multicallFn } from "@/app/lib/multicallFn";
import { Client } from "viem";

export const useEpochEffect = () => {
  const appConfig = useAppConfig()
  const ExchangeContractParams = useContractParams(appConfig.contract_address.ExchangeManagerImplementationAddress);

  const client = useClient();


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

      console.log('xxxx ttttt', epochEndTimeCallRes)

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
}