

// 单纯的全局数据获取，只处理逻辑，不负责UI 渲染

import { useRequest } from "ahooks";
import { futurePositionsGql } from "@/app/graphql/future/position";
import { memo, useCallback, useEffect } from "react";
import { useAccount } from "wagmi";
import { useRecoilState } from "recoil";
import { recoilPositions } from "@/app/models";
import BigNumber from "bignumber.js";
import useGraphqlFetch from "@/app/hooks/useGraphqlFetch";


export const OpenPostionsEffects = memo(() => {


    const [,updatePositionList] = useRecoilState(recoilPositions);

    const getFuturesPositions = useGraphqlFetch('perpetual', futurePositionsGql);


    const { address } = useAccount();

    const queryPositions = useCallback((user_: Addr) => {

        async function _run() {



            const data = await getFuturesPositions({address: user_});

            console.log("updatePositionList", data);

            if(!data) {
                updatePositionList([]);
                return ;
            }

            

            const result = Object.values(data)
            ?.flat(Infinity)
            .filter((i) => BigNumber(i.collateral).gt(0))
            .map((i: any) => {
                const collateralReadable = BigNumber(i?.collateral || '0').div(1e6).toString();
                const openCostReadable = BigNumber(i?.openCost || '0').div(1e6).toString();
                const entryBorrowingFeePerTokenReadable = BigNumber(i?.entryBorrowingFeePerToken || '0').div(1e6).toString();
                const entryFundingFeePerTokenReadable = BigNumber(i?.entryFundingFeePerToken || '0').div(1e6).toString();

                const cumulativeFundingFeeReadable = BigNumber(i.cumulativeFundingFee || '0').div(1e6).toString();
                const cumulativeBorrowingFeeReadable = BigNumber(i.cumulativeBorrowingFee || '0').div(1e6).toString();
                const cumulativeTeamFeeReadable = BigNumber(i.cumulativeTeamFee || '0').div(1e6).toString();
                console.log("------>>> aaaaaaa", openCostReadable);

                return i;

                // const positionReadable = BigNumber(i?.tokenSize || '0').multipliedBy(par).toString();
            })
            
            ;


            console.log("updatePositionList 1111:", user_, result.length);

            updatePositionList(result);
        }

        return _run();

    }, [address]);


    // fetch graqhql
    const { run, error } = useRequest(queryPositions, {
        manual: true,
        pollingInterval: 15000,
        // defaultParams: [address],
        refreshDeps: [address, queryPositions],
    });

    // 地址变更之后重新获取数据
    useEffect(() => {

        run(address);

    }, [address]);

    return null;

});


