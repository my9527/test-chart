import { useClient, useConfig } from "wagmi";
import { multicall } from "wagmi/actions"









const useMulticall = async () => {

    const config = useConfig();

    const result = await multicall(config, {
        contracts: []
    });


}