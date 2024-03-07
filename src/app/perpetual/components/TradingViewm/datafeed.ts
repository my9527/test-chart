
/**
 * tradingview 数据源
 */

import { ResolveCallback,  ErrorCallback, SymbolResolveExtension } from "charting_library"
import { tradingviewSocketIns } from "./socket";
import { timeScale } from "./types";


class Datafeed {

    supportedResolutions: string[];
    symbols: any;


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

        console.log("run getBars", symbolInfo)

         const nextInterval = timeScale[resolution.toString().toLowerCase()];
        // timeScale

        await tradingviewSocketIns.initHistoryKline(symbolInfo, nextInterval, fromParams.countBack, fromParams.from, fromParams.to, onHistoryCallback);
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
        console.log('resolveSymbol', symbolInfo);
        if (symbolInfo) {
            onSymbolResolvedCallback(symbolInfo);
        } else {
            onResolveErrorCallback(`symbol not found`);
        }
    }


    subscribeBars() {
        console.log("0000000000000")
    }

    unsubscribeBars() {

    }





}


export { Datafeed };
export default Datafeed;
