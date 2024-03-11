import { FC, memo, useCallback, useEffect, useRef } from "react";

import { MarketSocket } from "./socket";
import { SOCKET_MSG_TYPE } from "../../constant";
import { useRecoilState } from "recoil";
import { recoilMarkets } from "../../models/market";
import { useAppConfig } from "@/app/hooks/useAppConfig";
import { useParams } from "next/navigation";






export const CmptMarketSocket: FC = memo(() => {

    const marketWss = useRef<MarketSocket | null>(null);
    const routeParams = useParams<{ symbol: string }>();

    const appConfig = useAppConfig();

    const [, updateMarkets] = useRecoilState(recoilMarkets);


    const handleTopGainerChange = useCallback((evt: Event & { data: string }) => {
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

    }, [routeParams.symbol]);
    
    // wsRef.current = new Wss(`${baseWssUrl}market/`);

    useEffect(() => {
        if(marketWss.current) {
            console.log("symbol:", routeParams.symbol);
            // marketWss.current.unsubscribe();
            // marketWss.current.subscribe();
        }
    }, [routeParams.symbol, handleCurSymbolIndexPrice, marketWss.current]);

    useEffect(() => {
        marketWss.current = new MarketSocket(appConfig.api.wss, true);
        marketWss.current.subscribe('change', {
            param: '24h',
        }, handleTopGainerChange);

        marketWss.current.subscribe('index_price_all', {
            symbols: ['KAS'],
        }, handleIndexPriceAll);

    }, []);


    return null;
});