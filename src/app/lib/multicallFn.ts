import { Client, ContractFunctionParameters } from "viem";
import { multicall } from "viem/actions"
import { useClient, useConfig } from "wagmi"
import { getClient } from "wagmi/actions";




//ContractFunctionParameters

/**
 * 将contracts 进行整合
 * @param contracts_ 
 * @returns 
 */
export const multicallFn = async (client: Client, contracts_: ContractFunctionParameters[][]) => {

        // const client = useClient();

        

        const result = await multicall(client, {
            contracts: contracts_.flat(1),
        });

        let returned = [];

        const len = contracts_.length;
        for(let i = 0; i< len; i++) {
            returned.push(result.splice(0, contracts_[i].length));
        }

        return returned;

}