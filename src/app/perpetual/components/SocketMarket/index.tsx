import { FC, memo, useCallback, useEffect, useRef } from "react";

import { MarketSocket } from "./socket";
import { SOCKET_MSG_TYPE } from "../../constant";
import { useRecoilState } from "recoil";
import { recoilMarkets } from "../../models/market";
import { useAppConfig } from "@/app/hooks/useAppConfig";
import { useParams } from "next/navigation";
import { recoilIndexPrices } from "@/app/models";
import { etherUnits } from "viem";
import { ethers } from "ethers";


type MARKET_CHANGE_RES = {
    change: string | number;
    displaySymbol: string;
    price: number;
    priceDecimal: number;
    symbol: string;
}





export const CmptMarketSocket: FC = memo(() => {

    const marketWss = useRef<MarketSocket | null>(null);
    const routeParams = useParams<{ symbol: string }>();
    const lastSymbol = useRef<string | null>(null);

    const [, updateIndexPrices] = useRecoilState(recoilIndexPrices);

    const appConfig = useAppConfig();


    const handleIndexPrices = useCallback((evt: Event & { data: string }) => {
        const data = JSON.parse(evt?.data);
        if(data.type === SOCKET_MSG_TYPE.MARKET_CHANGE) {

            let result: Record<string, MARKET_CHANGE_RES> = {};

            const _d: MARKET_CHANGE_RES[] = data?.data || [];

            for(let i = 0; i <_d.length; i++) {
                result[_d[i].symbol] = _d[i];
            }

            updateIndexPrices(result);
        }

    }, []);

    const handleFutureChange = useCallback((evt: Event & { data: string }) => {
        const data = JSON.parse(evt?.data);
        console.log('handleFutureChange', data);
        // if(data.type === SOCKET_MSG_TYPE.MARKET_CHANGE) {
        // }

    }, []);



    // const handleIndexPriceAll = useCallback(( evt: Event & { data: string } ) => {
    //     const data = JSON.parse(evt?.data);
    //     if(data.type === SOCKET_MSG_TYPE.MARKET_INDEX_PRICE) {
    //         console.log("MARKET_INDEX_PRICE");
    //         updateMarkets(data.data);
    //     }

    // }, []);

    const handleCurSymbolIndexPrice = useCallback(( evt: Event & { data: string } ) => {
        const data = JSON.parse(evt?.data);
        if(data.type === SOCKET_MSG_TYPE.MARKET_INDEX_PRICE && data.symbol === routeParams.symbol) {
            console.log("MARKET_INDEX_PRICE");
            // updateMarkets(data.data);
            // 此处不用reduce， 减少性能消耗，直接for 循环
            // const result = data?.data.

            
          
            
            updateIndexPrices((last) => {
                return {
                    ...last,
                    [data.symbol]: {
                        ...last[data.symbol],
                        // price: data?.data.price,
                        price: ethers.utils.formatUnits((data?.data.price || 0)?.toString(), 6).toString(),
                        priceDecimal: data?.data.price,
                    }
                }
            });
            
            // updateIndexPrices(result);
        }

    }, [routeParams.symbol]);
    
    // wsRef.current = new Wss(`${baseWssUrl}market/`);

    useEffect(() => {
        
        if(marketWss.current) {
            console.log("symbol:", routeParams.symbol);
            // 单个币种的价格变化
            // 取消上一个币种的变化
            if(lastSymbol.current) {
                marketWss.current.unsubscribe('index_price_all', {
                    symbols: [lastSymbol.current]
                });
            }
            
            // 当前币种的变化
            marketWss.current.subscribe('index_price_all', {
                symbols: [routeParams.symbol],
            }, handleCurSymbolIndexPrice);


            lastSymbol.current = routeParams.symbol;
        }
        
    }, [routeParams.symbol, handleCurSymbolIndexPrice, marketWss.current]);

    useEffect(() => {
        marketWss.current = new MarketSocket(`${appConfig.api.wss}market/`, true);

        // 监听所有币种的变化
        marketWss.current.subscribe('change', {
            param: '24h',
        }, handleIndexPrices);


    }, []);


    return null;
});