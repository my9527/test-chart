import { readContract } from "@wagmi/core";
import { useCallback } from "react"
import { useConfig } from "wagmi";
import { IContractParam } from "./useContractParams";



export const useReadContract = () => {

    const config = useConfig();

    const _readContract = useCallback(async (contract: IContractParam, functionName: string, args: any[]) => {

        const result = await readContract(config, {
            abi: contract.abi,
            address: contract.address,
            functionName,
            args,
        });

        return result;


    }, [config]);


    return _readContract;

}