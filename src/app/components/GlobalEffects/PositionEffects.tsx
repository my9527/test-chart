

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
import { FutureType, NUMBER_READABLE_DECIMAL } from "@/app/config/common";
import { useAppConfig } from "@/app/hooks/useAppConfig";
import { AbiItem, createPublicClient, decodeEventLog, fallback, http, webSocket } from "viem";
import { useContractParams } from "@/app/hooks/useContractParams";
import { queryAbiEventByName } from "@/app/lib/queryAbiEventByName";
import { compareAddress } from "@/app/lib/compareAddress";
import { useMessage } from "../Message";
import OrderMessage from "../Message/OrderMessage";



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
    for (let po of preList) {
        // 这里一般进行字符串比较，所以转一下小写，避免出现大小写不匹配的问题
        if (po[targetKey].toLowerCase() !== data[targetKey].toLowerCase()) {
            newList.push(po);
        } else {
            isPosExist = true;
            newList.push(data);
        }
    }
    if (!isPosExist) {
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

    const msg = useMessage();



    const { address } = useAccount();


    const queryPositions = useCallback((user_: Addr) => {

        async function _run() {

            const data = await getFuturesPositions({ address: user_ });

            if (!data) {
                updatePositionList([]);
                return;
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
        pollingInterval: 1000 * 60, // 由于使用socket 监听，这里的轮训时间将拉长，以防止数据冲突的问题，轮训时间将超过graph 收录时间
        // defaultParams: [address],
        refreshDeps: [queryPositions],
    });

    // 地址变更之后重新获取数据
    useEffect(() => {
        if (address) {
            run(address);
        }

    }, [address]);



    // listen update from event log

    const txPublicClient = useMemo(() => {
        const transports = [];
        if (appConfig.rpc.wss) {
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
    const MarketOrderContractParams = useContractParams(appConfig.contract_address.MarketOrderImplementationAddress);
    const StopOrderContractParams = useContractParams(appConfig.contract_address.StopOrderImplementationAddress)

    const UpdateCollateralContractParams = useContractParams(appConfig.contract_address.UpdateCollateralOrderImplementationAddress);

    const listenEvents = useCallback(() => {


        /**************************  Create  **************************/
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
                if (evt.eventName !== 'UpdatePosition' || compareAddress(args.user, address)) {
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
                if (evt.eventName !== 'UpdatePosition' || compareAddress(args.user, address)) {
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

        // CreateIncreaseLimitOrder CreateDecreaseLimitOrder 一起处理，部分逻辑一致，除了两个参数外
        const unwatchChangeLimitOrder = txPublicClient.watchEvent({
            address: LimitOrderContractParams.address as Addr,
            events: [IncreaseLimitOrder, DecreaseLimitOrder],
            onLogs: (logs) => {
                const props = decodeEventLog({
                    abi: LimitOrderContractParams.abi,
                    data: logs?.[0]?.data,
                    topics: logs?.[0]?.topics,
                });

                // 校验事件名称
                if ([IncreaseLimitOrder, DecreaseLimitOrder].every(v => props.eventName != v.name)) {
                    return;
                }
                const {
                    user,
                    nonce,
                    future,
                    futureId,
                    price,
                    executionFee,
                    decreaseTokenSize,  // 减仓 CreateDecreaseLimitOrder
                    offset,             // 减仓 CreateDecreaseLimitOrder
                    increaseCollateral, // 开多 CreateIncreaseLimitOrder
                    increaseTokenSize,  // 开多 CreateIncreaseLimitOrder
                } = props?.args as any;
                const { blockNumber, transactionHash } = logs?.[0];
                const createHash = transactionHash;
                const createBlock = blockNumber;
                if (user?.toLowerCase() !== address?.toLowerCase()) return;
                const id = `${user.toLowerCase()}-${nonce.toString()}`;
                const isLong = compareAddress(LongContractParams.address, future);

                const paramInGraph: AnyObjec = {
                    id: id.toString(),
                    future: future.toString(),
                    user: user.toString(),
                    nonce: nonce.toString(),
                    futureId: futureId.toString(),
                    price: price?.toString(),
                    executionFee: executionFee.toString(),
                    createHash: createHash.toString(),
                    createBlock: createBlock.toString(),
                    isLong: isLong,
                };

                if (props.eventName === DecreaseLimitOrder.name) {
                    paramInGraph.decreaseTokenSize = decreaseTokenSize.toString();
                    paramInGraph.offset = offset.toString();
                } else if (props.eventName === DecreaseMarketOrder.name) {
                    paramInGraph.increaseCollateral = increaseCollateral.toString();
                    paramInGraph.increaseTokenSize = increaseTokenSize.toString();
                }

                const curToken = tokens[futureId];

                console.log("event: ", props.eventName, curToken.symbolName, createHash);

                // OrderMessage
                msg({
                    content: (index: number) => {
                        return (
                            <OrderMessage
                                position="bottom_right"
                                index={index}
                                orderType="limit_open"
                                orderStatus="Created"
                                symbolName={curToken.symbolName}
                                isLong={isLong}
                            />
                        );
                    },
                });
            }

        });


        const IncreaseMarketOrder = queryAbiEventByName('CreateIncreaseMarketOrder', MarketOrderContractParams.abi);
        const DecreaseMarketOrder = queryAbiEventByName('CreateDecreaseMarketOrder', MarketOrderContractParams.abi);
        // CreateIncreaseLimitOrder CreateDecreaseLimitOrder 一起处理，部分逻辑一致，除了两个参数外
        const unwatchChangeMarketOrder = txPublicClient.watchEvent({
            address: MarketOrderContractParams.address as Addr,
            events: [IncreaseMarketOrder, DecreaseMarketOrder],
            onLogs: (logs) => {
                const props = decodeEventLog({
                    abi: MarketOrderContractParams.abi,
                    data: logs?.[0]?.data,
                    topics: logs?.[0]?.topics,
                });

                // 校验事件名称
                if ([IncreaseMarketOrder, DecreaseMarketOrder].every(v => props.eventName != v.name)) {
                    return;
                }
                // const { user, nonce, future, futureId, decreaseTokenSize, executePrice, executionFee, deadline } = props?.args;
                const {
                    user,
                    nonce,
                    future,
                    futureId,
                    price,
                    executionFee,
                    deadline,
                    executePrice,
                    decreaseTokenSize,  // 减仓 CreateDecrease
                    offset,             // 减仓 CreateDecrease
                    increaseCollateral, // 开多 CreateIncrease
                    increaseTokenSize,  // 开多 CreateIncrease
                } = props?.args as any;
                const { blockNumber, transactionHash } = logs?.[0];
                const createHash = transactionHash;
                const createBlock = blockNumber;
                if (user?.toLowerCase() !== address?.toLowerCase()) return;
                const id = `${user.toLowerCase()}-${nonce.toString()}`;
                const isLong = compareAddress(LongContractParams.address, future);
                const futureType = compareAddress(LongContractParams.address, future) ? FutureType.LONG : FutureType.SHORT;

                const paramInGraph: AnyObjec = {
                    id: id.toString(),
                    future: future.toString(),
                    user: user.toString(),
                    nonce: nonce.toString(),
                    futureId: futureId.toString(),
                    price: price?.toString(),
                    executionFee: executionFee.toString(),
                    createHash: createHash.toString(),
                    createBlock: createBlock.toString(),
                    deadline: deadline.toString(),
                    isLong: isLong,
                    executePrice: executePrice.toString(),
                    status: 0,
                };

                if (props.eventName === DecreaseMarketOrder.name) {
                    paramInGraph.decreaseTokenSize = decreaseTokenSize.toString();
                    paramInGraph.offset = offset.toString();
                } else if (props.eventName === IncreaseMarketOrder.name) {
                    paramInGraph.increaseCollateral = increaseCollateral.toString();
                    paramInGraph.increaseTokenSize = increaseTokenSize.toString();
                }

                const curToken = tokens[futureId];

                console.log("event: ", props.eventName, curToken.symbolName, createHash);
                msg({
                    content: (index: number) => {
                        return (
                            <OrderMessage
                                position="bottom_right"
                                index={index}
                                orderType="limit_open"
                                orderStatus="Created"
                                symbolName={curToken.symbolName}
                                isLong={isLong}
                            />
                        );
                    },
                });
            }

        });


        const CreateStopOrder = queryAbiEventByName('CreateFutureStopOrder', StopOrderContractParams.abi);

        const unwatchCreateFutureStopOrder = txPublicClient.watchEvent({
            address: StopOrderContractParams.address,
            event: CreateStopOrder,
            onLogs: (logs) => {
                const props: AnyObjec = decodeEventLog({
                    abi: StopOrderContractParams.abi,
                    data: logs?.[0]?.data,
                    topics: logs?.[0]?.topics,
                });

                if (props.eventName !== CreateStopOrder.name) return;
                const { user, nonce, offset, future, futureId, decreaseTokenSize, triggerPrice, isStopLoss, executionFee } = props?.args;
                const { blockNumber, transactionHash } = logs?.[0];
                const createHash = transactionHash;
                const createBlock = blockNumber;
                if (user?.toLowerCase() !== address?.toLowerCase()) return;
                const id = `${user.toLowerCase()}-${nonce.toString()}`;
                const isLong = compareAddress(LongContractParams.address, future);
                const futureType = compareAddress(LongContractParams.address, future) ? FutureType.LONG : FutureType.SHORT;
                const paramInGraph = {
                    id: id.toString(),
                    offset: offset.toString(),
                    future: future.toString(),
                    user: user.toString(),
                    nonce: nonce.toString(),
                    futureId: futureId.toString(),
                    decreaseTokenSize: decreaseTokenSize.toString(),
                    triggerPrice: triggerPrice.toString(),
                    isStopLoss: isStopLoss,
                    executionFee: executionFee.toString(),
                    // cancelReason: // cancelReason.toString(),
                    // status: // status.toString(),
                    // createTime: '/',
                    createHash: createHash.toString(),
                    createBlock: createBlock.toString(),
                    isLong: futureType === FutureType.LONG,
                    status: 0,
                };

                const curToken = tokens[futureId];
                msg({
                    content: (index: number) => {
                        return (
                            <OrderMessage
                                position="bottom_right"
                                index={index}
                                orderType="stop"
                                orderStatus="Created"
                                symbolName={curToken.symbolName}
                                isLong={isLong}
                            />
                        );
                    },
                });




            }
        });


        const UpdateColloteral = queryAbiEventByName('CreateUpdateCollateralOrder', UpdateCollateralContractParams.abi);


        const unwatchCreateUpdateCollateralOrder = txPublicClient.watchEvent({
            address: UpdateCollateralContractParams.address,
            event: UpdateColloteral,
            onLogs: (logs) => {
                const props: AnyObjec = decodeEventLog({
                    abi: UpdateCollateralContractParams.abi,
                    data: logs?.[0]?.data,
                    topics: logs?.[0]?.topics,
                });
                if (props.eventName !== UpdateColloteral.name) return;
                const { user, nonce, offset, future, futureId, deltaAmount, increase, executionFee } = props?.args;

                const { blockNumber, transactionHash } = logs?.[0];

                const createHash = transactionHash;
                const createBlock = blockNumber;

                if (user?.toLowerCase() !== address?.toLowerCase()) return;
                const id = `${user.toLowerCase()}-${nonce.toString()}`;
                const isLong = compareAddress(LongContractParams.address, future);
                const paramInGraph = {
                    id: id.toString(),
                    offset: offset.toString(),
                    future: future.toString(),
                    user: user.toString(),
                    nonce: nonce.toString(),
                    futureId: futureId.toString(),
                    deltaAmount: deltaAmount.toString(),
                    increase: increase.toString(),
                    executionFee: executionFee.toString(),
                    // cancelReason: // cancelReason.toString(),
                    // status: // status.toString(),
                    // createTime: '/',
                    createHash: createHash.toString(),
                    createBlock: createBlock.toString(),
                    status: 0,
                };
                const curToken = tokens[futureId];
                msg({
                    content: (index: number) => {
                        return (
                            <OrderMessage
                                position="bottom_right"
                                index={index}
                                orderType="margin_update"
                                orderStatus="Updated"
                                symbolName={curToken.symbolName}
                                isLong={isLong}
                            />
                        );
                    },
                });

            }
        })




        /**************************  Cancel  **************************/


        const CancelIncreaseLimitOrder = queryAbiEventByName('CancelIncreaseLimitOrder', LimitOrderContractParams.abi);
        const CancelDecreaseLimitOrder = queryAbiEventByName('CancelDecreaseLimitOrder', LimitOrderContractParams.abi);

        const unwatchCancelChangeLimitOrder = txPublicClient.watchEvent({
            address: LimitOrderContractParams.address,
            events: [CancelIncreaseLimitOrder, CancelDecreaseLimitOrder],
            onLogs: (logs) => {
                const props: AnyObjec = decodeEventLog({
                    abi: LimitOrderContractParams.abi,
                    data: logs?.[0]?.data,
                    topics: logs?.[0]?.topics,
                });

                const { user, nonce, reason } = props?.args;

                const { blockNumber, transactionHash } = logs?.[0];

                const createHash = transactionHash;
                const createBlock = blockNumber;

                if (user?.toLowerCase() !== address?.toLowerCase()) return;

                const id = `${user.toLowerCase()}-${nonce.toString()}`;

                const paramInGraph = {
                    id: id.toString(),
                    cancelReason: reason.toString(),
                    status: '2',
                    nonce: nonce.toString(),
                    // createTime: '/',
                    createHash: createHash.toString(),
                    createBlock: createBlock.toString(),
                };

                msg({
                    content: (index: number) => {
                        return (
                            <OrderMessage
                                position="bottom_right"
                                index={index}
                                orderType="limit_cancel"
                                orderStatus="Canceld"
                                symbolName={""}
                                isLong={false}
                            />
                        );
                    },
                });
                
            }
        });



        /**************************  Excute  **************************/




        return [
            unWatchLeverageLong,
            unWatchLeverageShort,
            unwatchChangeLimitOrder,
            unwatchChangeMarketOrder,
            unwatchCreateFutureStopOrder,
            unwatchCreateUpdateCollateralOrder,
            unwatchCancelChangeLimitOrder,
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


