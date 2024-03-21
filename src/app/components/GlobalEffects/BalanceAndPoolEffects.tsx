import { useAppConfig } from "@/app/hooks/useAppConfig";
import { useContractParams } from "@/app/hooks/useContractParams";
import { useDepositableTokens, useStableTokens, useTokensIdMap } from "@/app/hooks/useTokens";
import { compareAddress } from "@/app/lib/compareAddress";
import { multicallFn } from "@/app/lib/multicallFn";
import { recoilBalanceAndPool } from "@/app/models";
import { useRequest } from "ahooks";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { Address, Client, erc20Abi } from "viem";
import { useAccount, useClient } from "wagmi";



// @ts-ignore
window.BigNumber = BigNumber;





export const BalanceAndPoolEffects = () => {


    const appConfig = useAppConfig();

    const updateBalancePool = useSetRecoilState(recoilBalanceAndPool);

    const LongContractParams = useContractParams(appConfig.contract_address.LongAddress);
    const ShortContractParams = useContractParams(appConfig.contract_address.ShortAddress);
    const LiquidityContractParams = useContractParams(appConfig.contract_address.LiquidityPoolImplementationAddress);
    const ExchangeContractParams = useContractParams(appConfig.contract_address.ExchangeManagerImplementationAddress);
    
    const USDContractParams = useContractParams(appConfig.contract_address.USDAddress);

    const UserBalancenParams = useContractParams(appConfig.contract_address.UserBalanceImplementationAddress);

    const stableTokens = useStableTokens();
    const _depositTokens = useDepositableTokens();



    // 由于没有地址映射，这里直接采用数组的index 进行匹配
    const depositTokens = useMemo(() => {
        return  _depositTokens.filter(tk => !!tk.address);
    }, [_depositTokens]);


    const client = useClient();

    // 减少依赖变化，直接通过引用类型再下次请求的时候更新
    const contractCalls = useRef<any[]>([]);

    const { address: usrAddress } = useAccount();




    useEffect(() => {
        const availableLpCalls = [{
            ...LiquidityContractParams,
            functionName: 'getAvailableToken',
            args: [LongContractParams.address],
          },
          {
            ...LiquidityContractParams,
            functionName: 'getAvailableToken',
            args: [ShortContractParams.address],
          },
          {
            ...LiquidityContractParams,
            functionName: 'getAvailableToken',
            args: [appConfig.contract_address.OptionAddress],
          },
          {
            ...LiquidityContractParams,
            functionName: 'getAvailableToken',
            args: [appConfig.contract_address.USDAddress]
          }];
    
        const epochCalls = [{
            ...ExchangeContractParams,
            functionName: 'epochNumber',
            args: [],
          }];
    
        const stablePriceCalls = stableTokens.map(tk => {
            return [{
                ...USDContractParams,
                functionName: 'getPrice',
                args: [tk?.address as Address, false],
            }, {
                ...USDContractParams,
                functionName: 'getPrice',
                args: [tk?.address as Address, true],
            }, {
                ...USDContractParams,
                functionName: 'balanceOf',
                args: [USDContractParams?.address as Address],
            }]
        }).flat(1);

        const walletBalanceCalls = !usrAddress ? [] : depositTokens.map(tk => {
            return [{
                address: tk.address,
                abi: erc20Abi,
                functionName: "balanceOf",
                args: [usrAddress],
            }]
        }).flat(1);


        const exchangeBalanceCalls = !usrAddress?[] : depositTokens.map(tk => {
            return {
                ...UserBalancenParams,
                functionName: 'userBalance',
                // args: [address as Address, i?.exchangeAddress || (i?.address as Address)],
                args: [tk.address, usrAddress],
            }
        }).flat(1);


        contractCalls.current = [
            availableLpCalls, 
            epochCalls, 
            stablePriceCalls,
            walletBalanceCalls,
            exchangeBalanceCalls,
        ]
    }, [
        appConfig, 
        USDContractParams, 
        ExchangeContractParams, 
        LiquidityContractParams, 
        LongContractParams, 
        ShortContractParams,
        usrAddress,
        depositTokens,
        stableTokens,
    ]) ;



    const runCalls = useCallback(() => {
        async function _run() {
            const  [
                availableLpCalls, 
                epochCalls, 
                stablePriceCalls,
                walletBalanceCalls,
                exchangeBalanceCalls
            ] =  contractCalls.current;
            const [ availableLpResults, epochResults, stablePriceResults, walletBalanceResults, exchangeBalanceResults ] = await multicallFn(client as Client, contractCalls.current);

            // console.log("BalanceAndEffects", availableLpResults, epochResults, stableBalanceResults, walletBalanceResults)
            // 

            


            const [LongAvRslt, ShortAvRslt, OpAvRslt, USDAvRslt] = availableLpResults;

            const LongAv = LongAvRslt.result?.toString();
            const ShortAv = ShortAvRslt.result?.toString();
            const OptionAv = OpAvRslt.result?.toString();

            const LongAvReadable = ethers.utils.formatUnits(LongAv || '0', 6);
            const ShortAvReadable = ethers.utils.formatUnits(ShortAv || '', 6);
            const OptionAvReadable = ethers.utils.formatUnits(OptionAv || '', 6);

            const futureTotalLP = ethers.utils.formatUnits(
                BigNumber(LongAv || '0').plus(ShortAv || '0').toString(), 
                6
            );

            const totalUSD = ethers.utils.formatUnits(
                BigNumber(LongAv || '0').plus(ShortAv || '0').plus(OptionAv || '0').toString(), 
                6
            );

            // availabel lp
            const availableLp = {
                futureLong: LongAvReadable,
                futureShort: ShortAvReadable,
                option: OptionAvReadable,
                futureTotalUsdAvailableReadable: futureTotalLP,
                totalUsdAvailableReadable: totalUSD,
                // usdBalance: usdBalanceAvailableReadable,
              };




            // 处理stable token 的price 以及 poolBalance
            let stablePriceResult: AnyObjec = {};

            stablePriceResults.forEach((rslt, index) => {

                const targetCall = stablePriceCalls[index];

                if(!targetCall.args[0]) return;

                const isPoolBalance =  typeof targetCall.args[1] === "undefined";

                const isDeposit = !!targetCall.args[1];

                const argAddress = targetCall.args[0];


                const rsltNum = rslt.result?.toString();


                if(isPoolBalance) {
                    if(!stablePriceResult[targetCall.address]) {
                        stablePriceResult[targetCall.address] = {
                            deposit: {
                                balance: '0',
                                balanceReadable: '0',
                              },
                              withdraw: {
                                balance: '0',
                                balanceReadable: '0',
                              },
                              poolBalance: {
                                balance: '0',
                                balanceReadable: '0',
                              },
                        }
                    }

                    const decimal = stableTokens?.find((tk) => {
                        return compareAddress(tk?.address, targetCall.address);
                      })?.decimal;
                    
                      stablePriceResult[targetCall.address].poolBalance = {
                        balance: rsltNum,
                        balanceReadable: BigNumber(rsltNum || '0')
                          .div(10 ** (decimal || 6))
                          .toFixed(2, BigNumber.ROUND_DOWN),
                      };


                } else {
                    if(!stablePriceResult[argAddress]) {
                        stablePriceResult[argAddress] = {
                            deposit: {
                                balance: '0',
                                balanceReadable: '0',
                              },
                              withdraw: {
                                balance: '0',
                                balanceReadable: '0',
                              },
                              poolBalance: {
                                balance: '0',
                                balanceReadable: '0',
                              },
                        }
                    }

                    stablePriceResult[argAddress][isDeposit ? 'deposit' : 'withdraw'] = {
                        balance: rsltNum,
                        balanceReadable: BigNumber(rsltNum || '0')
                        .div(1e6)
                        .toFixed(6, BigNumber.ROUND_DOWN)
                      };
                }



            });

            // epoch number
            const epoch = epochResults[0].result?.toString();

            // 链上钱包资产
            const walletBalance = walletBalanceResults.reduce((result: any, rslt, index) => {
                const cur = rslt.result?.toString();
                return {
                    ...result,

                    [depositTokens[index].symbolName]: {
                        balance: cur,
                        balanceReadable: BigNumber(cur || '0').div(1e6).toFixed(6, BigNumber.ROUND_DOWN)
                    }
                }
            }, {});

            // dex 钱包资产
            const exchangeBalance = exchangeBalanceResults.reduce((result: any, rslt, index) => {
                const cur = rslt.result?.toString();
                return {
                    ...result,

                    [depositTokens[index].symbolName]: {
                        balance: cur,
                        balanceReadable: BigNumber(cur || '0').div(1e6).toFixed(6, BigNumber.ROUND_DOWN)
                    }
                }
            }, {});

            console.log("exchangeBalance", exchangeBalance);

            updateBalancePool({
                walletBalance,
                exchangeBalance,
                epoch,
                availableLp,
                stableTokenPrice: stablePriceResult,
            });

            // console.log("BalanceAndEffects", availableLp, stablePriceResult ,walletBalance, exchangeBalance, epoch);


        }

        return _run();
    }, []);


    const {run, cancel} = useRequest(runCalls, {
        manual: true,
        pollingInterval: 15_000,
    });


    useEffect(() => {
        run();

        return () => {
            cancel();
        }
    }, [run]);

    return null;
}