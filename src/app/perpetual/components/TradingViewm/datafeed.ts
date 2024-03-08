
/**
 * tradingview 数据源
 */

import { ResolveCallback,  ErrorCallback, SymbolResolveExtension, LibrarySymbolInfo, ResolutionString, SubscribeBarsCallback } from "charting_library"
import { tradingviewSocketIns } from "./socket";
import { KlineSymbolType, timeScale } from "./types";


class Datafeed {

    supportedResolutions: string[];
    symbols: any;

    listenerGuid: any;


    constructor({ symbols }: any) {
        this.supportedResolutions = ['1', '5', '15', '30', '60', '120', '240', '360', 'D'];
        this.symbols = symbols;
    }

    onReady(configurationData: (arg0: {
        exchanges: never[];
        symbolsTypes: never[];
        supported_resolutions: any;
        supports_marks: boolean;
        supports_search: boolean;
        supports_time: boolean;
        supports_timescale_marks: boolean;
        has_no_volume: boolean;
      }) => void) {
        
        setTimeout(async () => {
            await tradingviewSocketIns.init();

        configurationData({
            exchanges: [],
            symbolsTypes: [],
            supported_resolutions: this.supportedResolutions,
            supports_marks: false,
            supports_search: false,
            supports_time: true,
            supports_timescale_marks: false,
            has_no_volume: true,
        });
        }, 0);
    }


    async getBars(
        symbolInfo: any,
        resolution: string | number,
        fromParams: {
            countBack: number;
            firstDataRequest: boolean;
            from: number;
            to: number;
        },
        onHistoryCallback: any,
        onErrorCallback: any,
    ) {




        const nextInterval = timeScale[resolution.toString().toLowerCase()];
        // 
        // if(resolution !== tradingviewSocketIns.curInterval || symbolInfo.symbol !== tradingviewSocketIns.curSubscriptionInfo?.symbolInfo.symbol) {
        //     await tradingviewSocketIns.unsubscribeLast();
        //     tradingviewSocketIns.clearData();
        // }

        // timeScale
        await tradingviewSocketIns.initHistoryKline(symbolInfo, nextInterval, fromParams.countBack, fromParams.from, fromParams.to, onHistoryCallback);
        // await tradingviewSocketIns.subscribe();
        
    }


    async searchSymbols (
        userInput: string,
        exchange: any,
        symbolType: any,
        onResultReadyCallback: any
    ) {
        console.log('[searchSymbols]: Method call');
    }

    // (symbolName: string, onResolve: ResolveCallback, onError: ErrorCallback, extension?: SymbolResolveExtension | undefined) => void

    resolveSymbol(symbolName: string, onSymbolResolvedCallback: ResolveCallback, onResolveErrorCallback: ErrorCallback, extension?: SymbolResolveExtension | undefined): void {
        let symbolInfo = null;
        
        for (const name in this.symbols) {
            if (name.indexOf(symbolName) !== -1) {
                symbolInfo = this.symbols[name];
                break;
            }
        }
        if (symbolInfo) {
            onSymbolResolvedCallback(symbolInfo);
        } else {
            onResolveErrorCallback(`symbol not found`);
        }
    }

    // subscribeBars(symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, onTick: SubscribeBarsCallback, listenerGuid: string, onResetCacheNeededCallback: () => void): void;
  // unsubscribeBars(listenerGuid: string): void;


    subscribeBars(
        symbolInfo: KlineSymbolType,
        resolution: ResolutionString,
        onTick: SubscribeBarsCallback,
        listenerGuid: string, 
        onResetCacheNeededCallback: () => void
    ) {

        const interval = timeScale[resolution.toString().toLowerCase()];
        // initTimeout(subscriberUID);
        this.listenerGuid = listenerGuid;

        // cw.setOnRealtimeCallback(onRealtimeCallback);
        tradingviewSocketIns.setOnRealtimeCallback(onTick);

        (async()=>{
            await tradingviewSocketIns.unsubscribeLast();
            // tradingviewSocketIns.clearData();
            await tradingviewSocketIns.subscribe(symbolInfo, interval, 1, onTick);
        })();

        

        // const intervalCallback = async () => {
        //     initTimeout(subscriberUID);

        //     await cw.subscribe(symbolInfo, timeScale[resolution.toString().toLowerCase()], 1, onRealtimeCallback);
        //     if (!timeoutList[subscriberUID]) {
        //         timeoutList[subscriberUID] = null;
        //     }
        //     timeoutList[subscriberUID] = setTimeout(intervalCallback, interval);
        // };

        // intervalCallback();
    }

    unsubscribeBars() {

    }

    // unsubscribeBars(
    //     symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, onTick: SubscribeBarsCallback, listenerGuid: string, onResetCacheNeededCallback: () => void
    // ) {
    //     console.log("unsub", symbolInfo);
    // }





}


export { Datafeed };
export default Datafeed;
