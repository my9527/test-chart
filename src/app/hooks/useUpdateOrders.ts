import { useSetRecoilState } from "recoil"
import { FutureOrderType, recoilFutureOrders } from "../models"
import { useCallback } from "react";
import { compareAddress } from "../lib/compareAddress";
import { useTokensIdMap } from "./useTokens";
import { useContractParams } from "./useContractParams";
import { useAppConfig } from "./useAppConfig";
import { useAccount } from "wagmi";
import BigNumber from "bignumber.js";
import { getNetvalue } from "../lib/perpetualTools";
import { getLiqPrice } from "../perpetual/lib/getLiqPrice";
import { FutureType } from "../config/common";


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



export const useUpdateOrders = () => {

    const appConfig = useAppConfig();
    const updateRecoilOrders = useSetRecoilState(recoilFutureOrders);
    const tokens = useTokensIdMap();
    const LongContractaParams = useContractParams(appConfig.contract_address.LongAddress);
    const { address } = useAccount();


    const preResolveOrder = useCallback((order: any, orderType: string) => {
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


    }, [tokens]);


    //FutureOrderType
    /**
     * 
     * orderType: defaultOrders 中除 excludeOrderEvent外的所有类型
     * updateOrReplace: true update/ false replace
     */
    const updateOrders = useCallback((newOrder: any, orderType: string, updateOrReplace: boolean) => {
        // 这里是query 到的orders， 还需要与监听到的orders 进行融合

        console.log("updateOrders: ", newOrder, orderType, updateOrReplace);

        updateRecoilOrders((last) => {

            const {
                orders,
                offsetObject
            } = last;


            const [_newOrder] = [newOrder].map(order => {
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
            });

            let _allOrders = [...orders];

            const sameIdIndex = orders.findIndex(ord => ord.id === _newOrder.id);

            // 如果存在已经存在对应的订单
            if (sameIdIndex > -1) {
                if (updateOrReplace) {
                    // 更新
                    _allOrders?.splice(sameIdIndex, 1, {
                        ..._allOrders[sameIdIndex],
                        ..._newOrder,
                    });

                } else {
                    // replace
                    _allOrders?.splice(sameIdIndex, 1, _newOrder);
                }
            } else {
                _allOrders.push(_newOrder);
            }

            // validOrder 与 invalidOrder 可以合并，一次循环获取所有内容
            const _validOrders = _allOrders.filter((order: any) => {
                if (!order.symbol) return false;
                const orderType = order.isLong ? FutureType.LONG : FutureType.SHORT;

                const curOffset = offsetObject?.[order.symbol]?.[orderType]?.offset || 0;

                if (order?.offset === undefined) return true;

                return !curOffset || BigNumber(order?.offset).gte(curOffset);
            });

            const _inValidOrders = _allOrders.filter((order: any) => {
                if (!order.symbol) return false;
                const orderType = order.isLong ? FutureType.LONG : FutureType.SHORT;
                const curOffset = offsetObject?.[order.symbol]?.[orderType]?.offset || 0;

                return curOffset && BigNumber(order?.offset).lt(curOffset);
            });

            return {
                orders: _allOrders,
                inValidOrders: _inValidOrders,
                validOrders: _validOrders,
                offsetObject,
            }


        });

    }, []);


    return {
        updateOrders,
        preResolveOrder,
    };

}