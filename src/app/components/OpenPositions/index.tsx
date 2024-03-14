

// 单纯的全局数据获取，只处理逻辑，不负责UI 渲染

import { useRequest } from "ahooks";
import { futurePositionsGql } from "@/app/graphql/future/position";
import { memo, useCallback, useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import { useRecoilState } from "recoil";
import { recoilPositions } from "@/app/models";
import BigNumber from "bignumber.js";
import useGraphqlFetch from "@/app/hooks/useGraphqlFetch";
import { useTokens, useTokensIdMap, useTokensMap } from "@/app/hooks/useTokens";
import { NUMBER_READABLE_DECIMAL } from "@/app/config/common";
import { useAppConfig } from "@/app/hooks/useAppConfig";


export const OpenPostionsEffects = memo(() => {


    const [,updatePositionList] = useRecoilState(recoilPositions);

    const getFuturesPositions = useGraphqlFetch('perpetual', futurePositionsGql);
    const tokens = useTokensIdMap();
    const appConfig = useAppConfig();



    const { address } = useAccount();

    const queryPositions = useCallback((user_: Addr) => {

        async function _run() {

            const data = await getFuturesPositions({address: user_});

            if(!data) {
                updatePositionList([]);
                return ;
            }


            const result = Object.values(data)
            ?.flat(Infinity)
            .filter((i) => BigNumber(i.collateral).gt(0))
            .map((i: any) => {
                const collateralReadable = BigNumber(i?.collateral || '0').div(NUMBER_READABLE_DECIMAL).toString();
                const openCostReadable = BigNumber(i?.openCost || '0').div(NUMBER_READABLE_DECIMAL).toString();
                const entryBorrowingFeePerTokenReadable = BigNumber(i?.entryBorrowingFeePerToken || '0').div(NUMBER_READABLE_DECIMAL).toString();
                const entryFundingFeePerTokenReadable = BigNumber(i?.entryFundingFeePerToken || '0').div(NUMBER_READABLE_DECIMAL).toString();

                const cumulativeFundingFeeReadable = BigNumber(i.cumulativeFundingFee || '0').div(NUMBER_READABLE_DECIMAL).toString();
                const cumulativeBorrowingFeeReadable = BigNumber(i.cumulativeBorrowingFee || '0').div(NUMBER_READABLE_DECIMAL).toString();
                const cumulativeTeamFeeReadable = BigNumber(i.cumulativeTeamFee || '0').div(NUMBER_READABLE_DECIMAL).toString();
                const positionReadable = BigNumber(i?.tokenSize || '0').multipliedBy(tokens[i.futureId].pars).toString();
                const entryPriceReadable = BigNumber(openCostReadable).div(positionReadable).toString();
                const maxProfitReadable = BigNumber(collateralReadable).multipliedBy(i.maxProfitRatio).toFixed(6, BigNumber.ROUND_DOWN);

                const isLong = i.future.toLowerCase() === appConfig.contract_address.LongAddress.toLowerCase();

                return {
                    ...i,
                    collateralReadable,
                    openCostReadable,
                    entryBorrowingFeePerTokenReadable,
                    entryFundingFeePerTokenReadable,
                    cumulativeFundingFeeReadable,
                    cumulativeBorrowingFeeReadable,
                    cumulativeTeamFeeReadable,
                    positionReadable,
                    entryPriceReadable,
                    maxProfitReadable,
                    isLong,

                }
                // const positionReadable = BigNumber(i?.tokenSize || '0').multipliedBy(par).toString();
            });

            updatePositionList(result);
        }

        return _run();

    }, [tokens, appConfig.contract_address.LongAddress]);


    // fetch graqhql
    const { run, error } = useRequest(queryPositions, {
        manual: true,
        pollingInterval: 15000,
        // defaultParams: [address],
        refreshDeps: [queryPositions],
    });

    // 地址变更之后重新获取数据
    useEffect(() => {
        if(address) {
            run(address);
        }

    }, [address]);

    return null;

});


