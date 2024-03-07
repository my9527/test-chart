'use client';


import {
    DrawingEventType,
    IChartingLibraryWidget,
    IOrderLineAdapter,
    IPositionLineAdapter,
    ResolutionString,
    Timezone,
    widget,
    ChartingLibraryFeatureset,
} from "charting_library";

import { overrides } from "./overrides";
import { memo, useCallback, useEffect, useRef } from "react";

import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import UTC from 'dayjs/plugin/utc';
import DataFeed from "./datafeed";

import { tokens } from "@/config/tokens";
import { tradingviewSocketIns } from "./socket";
import { useParams } from "next/navigation";
import styled from "styled-components";



dayjs.extend(timezone);
dayjs.extend(UTC);


const TRADINGVIEW_CONTAINER_ID = 'trading-view';

const TRADINGVIEW_STORAGE_PREFIX = 'tv.setting';


const WrapperTradingView = styled.div`
    height: 100%;
    width: 100%;
`;





export const CmptTradingView: FCC<{
    // disabled_features?: ChartingLibraryFeatureset[];
    // symbol: string;

}> = memo(() => {

    const disabled_features: ChartingLibraryFeatureset[] = [];

    const params = useParams<{ symbol: string }>();

    const { symbol }= params;



    const _widget = useRef<null | IChartingLibraryWidget>(null);

    const _symbol = useRef<string>(symbol);

    const initChart = useCallback((_symbol: string) => {

        const symbols = tokens.reduce((result, token) => {

            return {
                ...result,
                [token.symbolName]: {
                    ticker: token.symbolName,
                    symbol: token.symbolName,
                    name: `${token.symbolName}-USD`,
                    description: token.symbolName,
                    type: `.${token.symbolName}`,
                    session: '24x7',
                    timezone: 'UTC',
                    minmov: 1, // 最小波动
                    pricescale: token.displayDecimal || 1000,
                    has_intraday: true, // 是否提供日内分钟数据
                    has_weekly_and_monthly: false,
                    exchange: '',
                }
            }
        }, {});


        _widget.current = new widget({
            autosize: true,
            theme: 'Dark',
            timezone: dayjs.tz.guess() as Timezone,
            interval: '1' as ResolutionString,
            library_path: '/charting_library/',
            symbol,
            overrides,
            datafeed: new DataFeed({
              symbols,
            }),
            container: TRADINGVIEW_CONTAINER_ID,
            locale: 'en',
            custom_css_url: './custom.css',
            saved_data: JSON.parse(localStorage.getItem(TRADINGVIEW_STORAGE_PREFIX) || JSON.stringify({ charts: [] })), // 同步通用设置
            auto_save_delay: 0,
            
            disabled_features: disabled_features || [
              'header_saveload',
              'control_bar', //   底部工具栏
              'go_to_date',
              'create_volume_indicator_by_default',
              'header_symbol_search',
              'header_compare',
            ],
            enabled_features: [
              'items_favoriting',
              'side_toolbar_in_fullscreen_mode',
              'header_in_fullscreen_mode',
              'show_dom_first_time',
              'iframe_loading_compatibility_mode',
            ],
        });
    }, []);


    useEffect(() => {
        if(symbol) {
            initChart(symbol);
            // tradingviewSocketIns.init();
        }
    }, [symbol]);

    // useEffect(() => {

    //     if(_symbol.current !== symbol) {
    //         // _widget.current.sy
    //         _widget.current?.setSymbol(symbol, '1' as ResolutionString, () => {});
    //         _symbol.current = symbol;
    //     }

       
    // }, [ symbol]);

    useEffect(() => {
        return () => {
            tradingviewSocketIns.disconnect();
            _widget.current && _widget.current.remove();
        }
    }, []);





    









    

    return (
        <WrapperTradingView id="trading-view"></WrapperTradingView>
    );
});


CmptTradingView.displayName = 'CmptTradingView';