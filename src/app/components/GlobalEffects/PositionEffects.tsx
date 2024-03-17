

// 单纯的全局数据获取，只处理逻辑，不负责UI 渲染

import { useRequest } from "ahooks";
import { futurePositionsGql } from "@/app/graphql/future/position";
import { memo, useCallback, useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import { useRecoilState, useSetRecoilState } from "recoil";
import { recoilPositions } from "@/app/models";
import BigNumber from "bignumber.js";
import useGraphqlFetch from "@/app/hooks/useGraphqlFetch";
import { useTokens, useTokensIdMap, useTokensMap } from "@/app/hooks/useTokens";
import { NUMBER_READABLE_DECIMAL } from "@/app/config/common";
import { useAppConfig } from "@/app/hooks/useAppConfig";
import { AbiItem, createPublicClient, decodeEventLog, fallback, http, webSocket } from "viem";
import { useContractParams } from "@/app/hooks/useContractParams";
import { queryAbiEventByName } from "@/app/lib/queryAbiEventByName";
import { compareAddress } from "@/app/lib/compareAddress";



/**
 * 处理返回的posistion ，增加必要的数据
 * @param i 
 * @param tokens 
 * @returns 
 */
const _resolvePosition = (i: any, tokens: any) => {

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
                    // isLong,
    }
}


const _replaceOrPush = (preList: any[], data: AnyObjec, targetKey: string) => {
        let newList: any[] = [];
        let isPosExist = false;
        for(let po of preList) {
            // 这里一般进行字符串比较，所以转一下小写，避免出现大小写不匹配的问题
            if(po[targetKey].toLowerCase() !== data[targetKey].toLowerCase()) {
                newList.push(po);
            } else {
                isPosExist = true;
                newList.push(data);
            }
        }
        if(!isPosExist){
            newList.push(data);
        }
        return newList;
}



export const OpenPostionsEffects = memo(() => {



    // const [,updatePositionList] = useRecoilState(recoilPositions);
    const updatePositionList = useSetRecoilState(recoilPositions);

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
                

                const isLong = i.future.toLowerCase() === appConfig.contract_address.LongAddress.toLowerCase();

                const resolvedPos = _resolvePosition(i, tokens);

                return {
                    ...resolvedPos,
                    isLong,

                }
                // const positionReadable = BigNumber(i?.tokenSize || '0').multipliedBy(par).toString();
            });

            updatePositionList(result);
        }

        return _run();

    }, [tokens, appConfig.contract_address.LongAddress]);


    // fetch position from graphql
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



    // listen update from event log

    const txPublicClient = useMemo(() => {
        const transports = [];
        if(appConfig.rpc.wss) {
            transports.push(webSocket(appConfig.rpc.wss))
        }
        transports.push(http(appConfig.rpc.http));
        const client = createPublicClient({
            batch: {
                multicall: {
                    batchSize: 2048,
                  },
            },
            transport: fallback(transports),
        });
        return client;
    }, []);

    const LongContractParams = useContractParams(appConfig.contract_address.LongAddress);
    const ShortContractParams = useContractParams(appConfig.contract_address.ShortAddress);
    const LimitOrderContractParams = useContractParams(appConfig.contract_address.LimitOrderImplementationAddress);


    const listenEvents = useCallback(() => {


        // const UpdatePositionEvent = LongContractParams.abi.filter(i => i.name === 'UpdatePosition')[0];
        const UpdatePositionLongEvent = queryAbiEventByName('UpdatePosition', LongContractParams.abi as AbiItem[]);
        // watch UpdatePosition
        const unWatchLeverageLong = txPublicClient.watchEvent({
            address: LongContractParams.address as `0x${string}`,
            event: UpdatePositionLongEvent,
            onLogs: (logs) => {
                const evt = decodeEventLog({
                    abi: LongContractParams.abi,
                    data: logs?.[0]?.data,
                    topics: logs?.[0]?.topics,
                });
                
                const args = evt.args as any;
                if(evt.eventName !== 'UpdatePosition' || compareAddress(args.user, address)){
                    return
                }
                const {
                    user,
                    futureId,
                    position: {
                        openCost,
                        tokenSize,
                        collateral,
                        entryFundingFeePerToken,
                        cumulativeFundingFee,
                        entryBorrowingFeePerToken,
                        cumulativeBorrowingFee,
                        maxProfitRatio,
                        cumulativeTeamFee,
                    },
                } = args;

                const pos = _resolvePosition({
                    user,
                    futureId: futureId.toString(),
                    openCost: openCost.toString(),
                    tokenSize: tokenSize.toString(),
                    collateral: collateral.toString(),
                    entryFundingFeePerToken: entryFundingFeePerToken.toString(),
                    id: `${LongContractParams.address.toLowerCase()}-${user.toLowerCase()}-${futureId.toString()}`,
                    future: LongContractParams.address.toLowerCase(),
                    cumulativeFundingFee: cumulativeFundingFee?.toString(),
                    entryBorrowingFeePerToken: entryBorrowingFeePerToken?.toString(),
                    cumulativeBorrowingFee: cumulativeBorrowingFee?.toString(),
                    maxProfitRatio: maxProfitRatio?.toString(),
                    cumulativeTeamFee: cumulativeTeamFee?.toString(),
                    isLong: LongContractParams.address === appConfig.contract_address.LongAddress,
                }, tokens);

                updatePositionList((preList) => {
                    return _replaceOrPush(preList, pos, 'id');
                });

            }
        });


        const UpdatePositionShortEvent = queryAbiEventByName('UpdatePosition', ShortContractParams.abi as AbiItem[]);
        // watch UpdatePosition short
        const unWatchLeverageShort = txPublicClient.watchEvent({
            address: ShortContractParams.address as `0x${string}`,
            event: UpdatePositionShortEvent,
            onLogs: (logs) => {
                const evt = decodeEventLog({
                    abi: ShortContractParams.abi,
                    data: logs?.[0]?.data,
                    topics: logs?.[0]?.topics,
                });
                
                const args = evt.args as any;
                if(evt.eventName !== 'UpdatePosition' || compareAddress(args.user, address)){
                    return
                }
                const {
                    user,
                    futureId,
                    position: {
                        openCost,
                        tokenSize,
                        collateral,
                        entryFundingFeePerToken,
                        cumulativeFundingFee,
                        entryBorrowingFeePerToken,
                        cumulativeBorrowingFee,
                        maxProfitRatio,
                        cumulativeTeamFee,
                    },
                } = args;

                const pos = _resolvePosition({
                    user,
                    futureId: futureId.toString(),
                    openCost: openCost.toString(),
                    tokenSize: tokenSize.toString(),
                    collateral: collateral.toString(),
                    entryFundingFeePerToken: entryFundingFeePerToken.toString(),
                    id: `${ShortContractParams.address.toLowerCase()}-${user.toLowerCase()}-${futureId.toString()}`,
                    future: ShortContractParams.address.toLowerCase(),
                    cumulativeFundingFee: cumulativeFundingFee?.toString(),
                    entryBorrowingFeePerToken: entryBorrowingFeePerToken?.toString(),
                    cumulativeBorrowingFee: cumulativeBorrowingFee?.toString(),
                    maxProfitRatio: maxProfitRatio?.toString(),
                    cumulativeTeamFee: cumulativeTeamFee?.toString(),
                    isLong: ShortContractParams.address === appConfig.contract_address.ShortAddress,
                }, tokens);

                updatePositionList((preList) => {
                    return _replaceOrPush(preList, pos, 'id');
                });

            }
        });


        const IncreaseLimitOrder = queryAbiEventByName('CreateIncreaseLimitOrder', LimitOrderContractParams.abi as AbiItem[]);
        const DecreaseLimitOrder = queryAbiEventByName('CreateDecreaseLimitOrder', LimitOrderContractParams.abi as AbiItem[]);

        const unwatchCreateIncreaseLimitOrder = txPublicClient.watchEvent({
            address: LimitOrderContractParams.address as Addr,
            events: [IncreaseLimitOrder, DecreaseLimitOrder],
            onLogs: (logs) => {

                console.log("watched limited orders change", logs);
            }

        });


        return [
            unWatchLeverageLong,
            unWatchLeverageShort,
            unwatchCreateIncreaseLimitOrder,
        ];










    }, [txPublicClient, address]);



    useEffect(() => {
        const unwatches = listenEvents();
        return () => {
            unwatches.forEach((unwatch) => {
                unwatch();
            });
        }
    }, [listenEvents]);




    return null;

});


