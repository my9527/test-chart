import { FC, useCallback, useEffect, useRef } from "react";

import { MarketSocket } from "./socket";
import { SOCKET_MSG_TYPE } from "../../constant";
import { useRecoilState } from "recoil";
import { recoilMarkets } from "../../models/market";
import { useAppConfig } from "@/app/hooks/useAppConfig";






export const CmptMarketSocket: FC = () => {

    const marketWss = useRef<MarketSocket | null>(null);

    const appConfig = useAppConfig();

    console.log("appconfig", appConfig);



    const [, updateMarkets] = useRecoilState(recoilMarkets);


    const handleTopGainerChange = useCallback((evt: Event & { data: string }) => {
        // console.log("handleTopGainerChange", evt);
        const data = JSON.parse(evt?.data);
        if(data.type === SOCKET_MSG_TYPE.MARKET_CHANGE) {
        }

    }, []);

    const handleIndexPriceAll = useCallback(( evt: Event & { data: string } ) => {
        const data = JSON.parse(evt?.data);
        if(data.type === SOCKET_MSG_TYPE.MARKET_INDEX_PRICE) {
            updateMarkets(data.data);
        }

    }, []);

    const handleCurSymbolIndexPrice = useCallback(() => {

    }, []);
    
    // wsRef.current = new Wss(`${baseWssUrl}market/`);

    useEffect(() => {
        marketWss.current = new MarketSocket("wss://api-testnet.substancex.io/market/", true);
        marketWss.current.subscribe('change', {
            param: '24h',
        }, handleTopGainerChange);

        marketWss.current.subscribe('index_price_all', {
            symbols: ['KAS'],
        }, handleIndexPriceAll);

    }, []);


    return null;
}