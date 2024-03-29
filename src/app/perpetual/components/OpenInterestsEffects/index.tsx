

/**
 * 处理 OpenInterests 相关数据
 */

import { useIndexPrices, useIndexPricesById } from "@/app/hooks/useIndexPrices";
import { useTokens, useTokensIdMap } from "@/app/hooks/useTokens";
import { recoilExecutionFee, recoilOpenInterests, recoilPositionTokens, recoilPositions } from "@/app/models";
import { FC, memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import useCurToken from "../../hooks/useCurToken";
import { useChainId, useClient } from "wagmi";
import { useAppConfig } from "@/app/hooks/useAppConfig";
import { useContractParams } from "@/app/hooks/useContractParams";
import { multicallFn } from "@/app/lib/multicallFn";
import BigNumber from "bignumber.js";
import { FutureType } from "@/app/config/common";
import { ContractFunctionParameters, formatUnits } from "viem";
import { useInterval, useRequest } from "ahooks";
import { Token } from "@/app/config/tokens";


export const OpenInterestsEffects: FC = memo(() => {



    const updateOpenInterests = useSetRecoilState(recoilOpenInterests);

    const updateExecutionFee = useSetRecoilState(recoilExecutionFee);


    const callsRef = useRef<any[]>([]);

    const client = useClient();
    

    // 仓位
    // const positions = useRecoilValue(recoilPositions);

    const positions = useRecoilValue(recoilPositionTokens);


    const tokens = useTokensIdMap();
    const chainId = useChainId();
    const appConfig = useAppConfig();
    const currentToken = useCurToken();



    // multicall 合约调用基本参数
    const LongContractParams = useContractParams(appConfig.contract_address.LongAddress);
    const ShortContractParams = useContractParams(appConfig.contract_address.ShortAddress);
    const FutureManagerContractParams = useContractParams(appConfig.contract_address.futureManager);
    const LiquidityPoolParams = useContractParams(appConfig.contract_address.LiquidityPoolImplementationAddress);

    // 当前有仓位的tokens
    const positionTokens = useMemo(() => {
        if(!positions) return [];
        
        return Array.from(new Set(positions.split("_"))).map(tk => {
            return tokens[tk];
        });
    }, [positions]);

    

    const availableTokens = useMemo(() => {
        return [...positionTokens, currentToken?.token]
    }, [positionTokens, currentToken?.token]);


    // 用于监听仓位或当前 token 的变化，一遍重新请求相关数据
    const availableTokensString = useMemo(() => {
        return availableTokens.map(t => t?.symbolName).join("_");
    }, [availableTokens]);



    const currentTokenPrice = useIndexPricesById(currentToken.token.futureLongId);



    // 获取当前交易对 可用liquidity
    const currentTokenAvailableLiqCalls = useMemo(() => {
        return [
            {
                ...LiquidityPoolParams,
                chainId: chainId,
                functionName: 'getAvailableTokenForFuture',
                args: [appConfig.contract_address.LongAddress, currentToken.token.futureLongId],
            },
            {
                ...LiquidityPoolParams,
                chainId: chainId,
                functionName: 'getAvailableTokenForFuture',
                args: [appConfig.contract_address.ShortAddress, currentToken.token.futureShortId],
            },
        ];
    }, [appConfig, currentToken, LiquidityPoolParams, chainId])


    const openInterestsCalls = useMemo(() => {
        return [{
            ...LongContractParams,
            chainId: chainId,
            functionName: 'sizeGlobal',
            args: [currentToken.token.futureLongId],
        },
        {
            ...ShortContractParams,
            chainId: chainId,
            functionName: 'sizeGlobal',
            args: [currentToken.token.futureShortId],
        }];
    }, [LongContractParams, ShortContractParams, chainId, currentToken])




    // 获取当前交易对 + 仓位币种的 交易手续费
    const fundingFeeCalls = useMemo(() => {
        return availableTokens.map((token_) => {
            return [{
                // ...FutureLongContract,
                ...LongContractParams,
                chainId: chainId,
                functionName: 'fundingFeePerToken',
                args: [token_.futureLongId],
            }, {
                ...ShortContractParams,
                chainId: chainId,
                functionName: 'fundingFeePerToken',
                args: [token_.futureShortId],
            }]
        }).flat(1);
    }, [availableTokens, LongContractParams, ShortContractParams, chainId]);


    //  获取当前交易对 + 仓位币种的 借贷手续费
    const borrowingFeeCalls = useMemo(() => {
        return availableTokens.map((token_) => {
            return [{
                ...LongContractParams,
                chainId: chainId,
                functionName: 'borrowingFeePerToken',
                args: [token_.futureLongId],
            }, {
                ...ShortContractParams,
                chainId: chainId,
                functionName: 'borrowingFeePerToken',
                args: [token_.futureShortId],
            }]
        }).flat(1);
    }, [availableTokens, LongContractParams, ShortContractParams, chainId]);



    // lp pool amount
    const poolAmountCalls = useMemo(() => {
        return [
            {
                ...LiquidityPoolParams,
                chainId: chainId,
                functionName: 'poolAmount',
                args: [],
            },
        ];
    }, [LiquidityPoolParams, chainId]);


    const allGlobalCostCalls = [
        {
            ...LongContractParams,
            chainId: chainId,
            functionName: 'getAllGlobalCost',
            args: [],
        },
        {
            ...ShortContractParams,
            chainId: chainId,
            functionName: 'getAllGlobalCost',
            args: [],
        },
    ];

    // 获取当前链的最低执行费
    const minExecutionFeeCalls = useMemo(() => {
        return [
            {
                ...FutureManagerContractParams,
                chainId: chainId,
                functionName: 'minExecutionFee',
                args: [],
            },
        ];
    }, [FutureManagerContractParams , chainId]);


    
    //
    const globalUsdValueCalls = useMemo(() => {
        return [{
            ...LongContractParams,
            chainId: chainId,
            functionName: 'getGlobalUSDValue',
            args: [currentToken.token.futureLongId, currentTokenPrice?.price * 10 ** 6 || Math.random()],
        },
        {
            ...ShortContractParams,
            chainId: chainId,
            functionName: 'getGlobalUSDValue',
            args: [currentToken.token.futureShortId, currentTokenPrice?.price * 10 ** 6],
        }];
    }, [chainId, currentTokenPrice, LongContractParams, ShortContractParams, currentToken.token])



    useEffect(() => {
        callsRef.current = [
            openInterestsCalls,
            globalUsdValueCalls,
            poolAmountCalls,
            minExecutionFeeCalls,
            fundingFeeCalls,
            borrowingFeeCalls,
            currentTokenAvailableLiqCalls
        ]
    }, [openInterestsCalls,
        globalUsdValueCalls,
        poolAmountCalls,
        minExecutionFeeCalls,
        fundingFeeCalls,
        borrowingFeeCalls,
        currentTokenAvailableLiqCalls]);



    const callFns = useCallback(async () => {

        console.log("callFns")

        const [
            openInterestsCalls,
            globalUsdValueCalls,
            poolAmountCalls,
            minExecutionFeeCalls,
            fundingFeeCalls,
            borrowingFeeCalls,
            currentTokenAvailableLiqCalls
        ] = callsRef.current;

        async function _run() {
            // @ts-ignore:next-line
            const [openInterestsResults, globalUsdValueResults, feesResults, executionFeeResults, fundingFeeResults, borrowingFeeResults, availableLiqResults] = await multicallFn(client, callsRef.current);



            const openInterests = openInterestsResults?.map((rslt: any, index: number) => {
                const targetCall = openInterestsCalls[index];
                return {
                    //   id: `${calls[index]?.address}-${calls[index]?.args?.[0]}`,
                    id: `${targetCall.address}-${targetCall.args?.[0]}`,
                    tokenSize: rslt?.result?.toString() || '0',
                    type: 'openInterest',
                    address: targetCall.address,
                    futureId: targetCall.args?.[0],
                    side: targetCall.address === LongContractParams.address ? FutureType.LONG : FutureType.SHORT
                };
            });

            const globalUsdValues = globalUsdValueResults?.map((rslt: any, index) => {
                const targetCall = globalUsdValueCalls[index];

                return {
                    id: `${targetCall?.address}-${targetCall?.args?.[0]}`,
                    tokenSize: rslt ? BigNumber(rslt?.result?.toString()).div(10 ** 6).toString() : '0',
                    type: 'globalUsdValue',
                    futureId: targetCall?.args?.[0],
                    address: targetCall?.address,
                    side: targetCall.address === LongContractParams.address ? FutureType.LONG : FutureType.SHORT,
                };
            });

            const fundingFees = fundingFeeResults?.map((rslt: any, index) => {
                const targetCall = fundingFeeCalls[index];
                return {
                    //   symbol: getTokenByIdAndContract(
                    //     fundingFeePerTokenCalls[index]?.args?.[0],
                    //     fundingFeePerTokenCalls[index]?.address,
                    //   )?.kLineSymbol,

                    // symbol: '', deprecated 废弃，采用合约地址进行判断
                    address: targetCall.address, // 返回合约地址， 这里可以通过合约地址获取对应的token 信息
                    side: targetCall.address === LongContractParams.address ? FutureType.LONG : FutureType.SHORT,
                    id: `${targetCall?.address}-${targetCall?.args?.[0]}`,
                    fee: rslt?.result?.toString() || '0',
                    futureId: targetCall?.args?.[0],
                };
            });

            const borrowingFees = borrowingFeeResults?.map((rslt: any, index) => {
                const targetCall = borrowingFeeCalls[index];
                return {
                    address: targetCall.address, // 返回合约地址， 这里可以通过合约地址获取对应的token 信息
                    side: targetCall.address === LongContractParams.address ? FutureType.LONG : FutureType.SHORT,
                    id: `${targetCall?.address}-${targetCall?.args?.[0]}`,
                    fee: rslt?.result?.toString() || '0',
                    futureId: targetCall?.args?.[0],
                };
            });


            const currentTokenAvailableLiq = {
                long: availableLiqResults?.[0]?.result?.toString(),
                short: availableLiqResults?.[1]?.result?.toString(),
                longReadable: formatUnits((availableLiqResults?.[0]?.result || 0) as bigint, 6),
                shortReadable: formatUnits((availableLiqResults?.[1]?.result || 0) as bigint, 6),
            };

            // 更新execution fee
            updateExecutionFee(executionFeeResults?.[0]?.result?.toString() || '0');

            // // 更新其他信息
            updateOpenInterests({
                openInterests,
                globalUsdValues,
                fundingFees,
                borrowingFees,
                currentTokenAvailableLiq,
            })



        }
        _run();
    }, []);


    const { run, cancel } = useRequest(callFns, {
        manual: true,
        pollingInterval: 150_000,
        // refreshDeps: [callFns]
    });


    // 当 token 列表发生变化时，需要重新请求对应的数据以快速的更新显示
    useEffect(() => {
        console.log("asdadfasfasdf")
        run();

        return () => {
            cancel();
        }
    }, [run, cancel, availableTokensString]);


    return null;
});
