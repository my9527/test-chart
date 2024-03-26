
/**
 * 监听futureOrders
 * 
 */

import { FutureType } from "@/app/config/common";
import { futureOrders } from "@/app/graphql/future/orders";
import { useAppConfig } from "@/app/hooks/useAppConfig";
import { useContractParams } from "@/app/hooks/useContractParams";
import useGraphqlFetch from "@/app/hooks/useGraphqlFetch";
import { useTokensIdMap, useTokensMap } from "@/app/hooks/useTokens";
import { compareAddress } from "@/app/lib/compareAddress";
import { getNetvalue } from "@/app/lib/perpetualTools";
import { recoilFutureOrders } from "@/app/models";
import { getLiqPrice } from "@/app/perpetual/lib/getLiqPrice";
import { useRequest } from "ahooks";
import BigNumber from "bignumber.js";
import { useCallback, useEffect } from "react"
import { useSetRecoilState } from "recoil";
import { useAccount } from "wagmi";


const defaultOrders = {
    updateOffsets: [],
    updateCollateralOrders: [],
    futureStopOrders: [],
    increaseMarketOrders: [],
    decreaseMarketOrders: [],
    increaseLimitOrders: [],
    decreaseLimitOrders: [],
  }

  // 非 order
  const excludeOrderEvent = ['updateOffsets', 'updateCollateralOrders'];


export const OrderEffects = () => {


    const updateFutureOrders = useSetRecoilState(recoilFutureOrders);
    const _fetch = useGraphqlFetch('perpetual', futureOrders);

    const appConfig = useAppConfig();
    const LongContractaParams = useContractParams(appConfig.contract_address.LongAddress);
    const { address } = useAccount();

    const tokens = useTokensIdMap();

    const fetchFutureOrders = useCallback((user_: string) => {

        async function _run () {
            const data: any = await _fetch({address: user_});

            if(!data) {
                updateFutureOrders({
                    orders: [],
                    inValidOrders: [],
                    validOrders: [],
                });
                return ;
            }

            let offsetObject: any = {};

            (data.updateOffsets || [])
            ?.forEach((item: any) => {

                const _token = tokens[item.futureId];
                if(!_token) {
                    return;
                }
                const kLineSymbol = _token.symbolName;

                const isLong = compareAddress(LongContractaParams.address, item.future);
                const orderType = isLong ? FutureType.LONG : FutureType.SHORT;

                if(!offsetObject[kLineSymbol]) {
                    offsetObject[kLineSymbol] = {
                        long: {},
                        short: {}
                    }
                    offsetObject[kLineSymbol][orderType] = item;
                }else {
                    if(
                        !offsetObject[kLineSymbol][orderType]?.blockNumber ||
                        BigNumber(offsetObject[kLineSymbol][orderType]?.blockNumber).lte(item?.blockNumber)
                    ) {
                        offsetObject[kLineSymbol][orderType] = item;
                    }
                }








                


            //   const kLineSymbol = getTokenByIdAndContract(i?.futureId, i?.future)?.kLineSymbol;
            //   const ifLong = getIsLongByContractAddress(i?.future);
            //   if (!kLineSymbol) return;
            //   if (!offsetObject[kLineSymbol]) {
            //     offsetObject[kLineSymbol] = {
            //       long: {},
            //       short: {},
            //     };
      
            //     offsetObject[kLineSymbol][ifLong ? 'long' : 'short'] = i;
            //   } else {
            //     if (
            //       !offsetObject[kLineSymbol][ifLong ? 'long' : 'short']?.blockNumber ||
            //       BigNumber(offsetObject[kLineSymbol][ifLong ? 'long' : 'short']?.blockNumber).lte(i?.blockNumber)
            //     ) {
            //       offsetObject[kLineSymbol][ifLong ? 'long' : 'short'] = i;
            //     }
            //   }
            });


            // 排除offset 与 update
            const keys = Object.keys(data || defaultOrders).filter(v => !excludeOrderEvent.includes(v));


            // 这里是query 到的orders， 还需要与监听到的orders 进行融合
            const allOrders = keys
            .map((orderType) => {
                
                return data[orderType].map((order: any) => {
                    const isLong = compareAddress(LongContractaParams.address, order.future);
                    const _token = tokens[order.futureId];
                    const size = order?.increaseTokenSize || order?.decreaseTokenSize;
                    const positionReadable = BigNumber(size || 0)
                        .multipliedBy(_token?.pars)
                        .toString();

                    const collateral = order?.increaseCollateral || order?.decreaseCollateral;
                    const collateralReadable = BigNumber(collateral).div(1e6).toString();
                    const netValueReadable = getNetvalue({ pnl: '0', collateral: collateralReadable });
            
                    const entryPrice = order?.price || order?.executePrice;
                    const entryPriceReadable = BigNumber(entryPrice).div(1e6).toString();
                    const liqPriceReadable = getLiqPrice({
                        size,
                        // futureId: i.futureId,
                        token: _token,
                        isLong: isLong,
                        collateral: collateralReadable,
                        fees: 0,
                        entryPrice: entryPriceReadable,
                      });

                    return {
                        ...order,
                        type: orderType,
                        isLong,
                        symbol: _token.symbolName,
                        par: _token.pars,
                        size: order?.increaseTokenSize || order?.decreaseTokenSize,
            
                        positionReadable,
                        collateral,
                        collateralReadable,
                        netValueReadable,
            
                        liqPriceReadable,
                        entryPriceReadable,
                        entryPrice,
                      };

                })
            })
            .flat(Infinity)
            .filter((i) => i?.status?.toString() !== '2' && i?.status?.toString() !== '1');


            // validOrder 与 invalidOrder 可以合并，一次循环获取所有内容
            const validOrders = allOrders.filter((order: any) => {
                // const kLineSymbol = getTokenByIdAndContract(i?.futureId, i?.future)?.kLineSymbol;

                if (!order.symbol) return false;
                const orderType  = order.isLong ? FutureType.LONG : FutureType.SHORT;

                const curOffset = offsetObject?.[order.symbol]?.[orderType]?.offset || 0;

                if (order?.offset === undefined) return true;

                return !curOffset || BigNumber(order?.offset).gte(curOffset);
            });

            const inValidOrders = allOrders.filter((order: any) => {
                if (!order.symbol) return false;
                const orderType  = order.isLong ? FutureType.LONG : FutureType.SHORT;
                const curOffset = offsetObject?.[order.symbol]?.[orderType]?.offset || 0;
        
                return curOffset && BigNumber(order?.offset).lt(curOffset);
            });



            updateFutureOrders({
                orders: allOrders,
                validOrders,
                inValidOrders,
            });



        }

        return _run();

    }, []);


    const { run, error } = useRequest(fetchFutureOrders, {
        manual: true,
        pollingInterval: 5_000,
        // defaultParams: [address],
        refreshDeps: [fetchFutureOrders],
    });


    useEffect(() => {
        if(address) {
            run(address);
        }
    }, [address]);

    return null;




}