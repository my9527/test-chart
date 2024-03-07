'use client';

import { KlineSymbolType } from "./types";
import { getHistoryChartData } from "../../service";
import { HistoryCallback, Bar } from "charting_library";
import { sleep } from "@/app/lib/sleep";
import BigNumber from "bignumber.js";


type TradingViewInterval = '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '2h' | '12h' | '1d' | '1w';


type SubscribeInfoType = {
    symbolInfo: KlineSymbolType,
    interval: TradingViewInterval,
    limit: number,
    onRealtimeCallback: AnyFunc,
}

// event: 'unsubscribe', symbol: symbolInfo?.symbol, channel: 'kline', param: interval
type SubscribtionType = {
    symbol: string;
    interval: TradingViewInterval;
    channel: string;
}

class TradingViewSocket {

    url: string | null = null;

    connection: null | WebSocket = null;
    inited: boolean = false;
    data: Bar[] = [];
    onHistoryCallback: any;
    onRealtimeCallback: any;
    subscribed: boolean = false;
    timerId: null | NodeJS.Timeout = null;
    allTickerPriceHandler?: AnyFunc;
    tickerPriceHandler?: AnyFunc;
    ticker24hHandler?: AnyFunc;
    openCbList: AnyFunc[] = [];
    disconnectCbList: any[] = [];
    receiveMessageCbList: any[] = [];
    // lastSubscriptions: SubscribeInfoType[] = [];
    curInterval: TradingViewInterval = '15m';
    curSubscriptionInfo?: SubscribeInfoType;

    pingAble: boolean = true; // enable ping pong;
    pinging: boolean = false; // is now waiting ping response

    connected: boolean = false;

    PingPongDelay: number = 30_000;

    autoReconnect: boolean = true;

    changingInterval: boolean = false;


    constructor(url_: string) {
        this.url = url_;
    }

    init(isReconnect: boolean = false) {
        if (this.inited) return Promise.resolve();
        const _wssUrl = this.url;
        return new Promise<void>((resolve, reject) => {
            // const conn = new Wss(`wss://stream.cryptowat.ch/connect?apikey=${cryptoWatchApi}`);
            const connection = new window.WebSocket(_wssUrl as string);
            this.connection = connection;
            this.bind();
            this.data = [];

            console.log("inited")

            resolve();

            if (this.curSubscriptionInfo && isReconnect) {
                const { symbolInfo, interval, onRealtimeCallback, limit } = this.curSubscriptionInfo;
                this.subscribe(symbolInfo, interval, limit, onRealtimeCallback);
            }
        });
    }


    addOpenCallback(cb: AnyFunc) {
        this.openCbList.push(cb);
    }

    getData() {
        return this.data || [];
    }

    updateData(data_: Bar[]) {
        this.data = data_;
    }

    pushData(data_: Bar) {
        this.data.push(data_);
    }

    _formatKlineData(newData: any) {
        const tempData = JSON.parse(JSON.stringify(newData));
        const data: Bar[] = tempData.map((i: any) => ({
            time: i?.open_time ? +i?.open_time * 1000 : i?.time,
            high: i?.max_price ? i?.max_price?.toString() : i?.high,
            low: i?.min_price ? i?.min_price?.toString() : i?.low,
            open: i?.open_price ? i?.open_price?.toString() : i?.open,
            close: i?.close_price ? i?.close_price?.toString() : i?.close,
        }));

        const originData = [...this.getData()];

        // 插入新数据
        data.forEach((i) => {
            const ifExistItemIndex = originData.findIndex((j) => j?.time?.toString() === i?.time?.toString());

            // 去重
            if (ifExistItemIndex >= 0) {
                originData[ifExistItemIndex] = {
                    ...i,
                    open: originData[ifExistItemIndex]?.open,
                };
            } else {
                originData.push(i);
            }
        });

        const sortedOriginData = Array.from(new Set(originData.map((item: any) => JSON.stringify(item))))
            .map((item) => JSON.parse(item))
            .sort((a, b) => +a?.time - +b?.time);

        this.updateData(sortedOriginData);
        return data;
    }

    ping() {

        if (!this.pingAble || !this.connection) return;
        // 上次的ping 未返回;
        if (this.pinging) {
            this.connected = false;
        }
        this.pinging = true;

        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }

        try {
            console.log("send ping");
            this._send({ event: 'ping' });
        } catch (e) {
            console.log('ping error:', e);
        }
        this.timerId = setTimeout(() => {
            this.ping();
        }, this.PingPongDelay);
    }

    reset() {
        this.unbind();
        // this.lastSubscription = null;
    }


    // (type: K, listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined): void
    // handle open
    _open = (evt: Event): void  => {
        this.inited = true;

        if (!this.connection) return;
        console.log("on open");

        // call func on open;
        if (this.openCbList.length) {
            this.openCbList.map((i) => i?.());
        }
        // res();
        this.ping();
    }

    async _error(msg: { [x: string]: any; toString: () => string }) {
        this.inited = false;

        console.log("on error")
        if (this.autoReconnect) {
            this.reset();
            await sleep(30 * 1000);
            this.init(true);
        }
    }

    async _beforeunload() {

    }

    async _close(msg: { [x: string]: any; toString: () => string }) {
        if (msg.code === 1006) {
            this.disconnect();
            this.reset();
            if (this.autoReconnect) {
                await sleep(30 * 1000);
                this.init(true);
            }
        }
    }

    async _message(msg: { [x: string]: any; toString: () => string }) {
        if (!this.connection) return;

        const d = JSON.parse(msg?.data);

        if (d.event === 'pong') {
            this.pinging = false;
            this.connected = true;
        }

        if (d.type === 'candle.stick.chart') {
            // 如果在切换interval， 此时先不接受数据,避免因为最新数据的进入导致历史数据无法渲染
            // if (this.isSwitchInterval) {
            //   return;
            // }

            // 11.9 修改k线返回格式
            // let _data = d?.data?.[this.curInterval];
            // _data = _data?.replace(/'/g, '"');
            // _data = _data ? JSON.parse(_data) : '';

            let _data = d?.data;
            if (_data) {
                this.initSubV2Kline([_data]);
            }
        } else {
            if (this.receiveMessageCbList?.length) {
                this.receiveMessageCbList.map((i) => i?.(d));
            }
        }
    }




    unbind() {
        this.connection?.removeEventListener('open', this._open);

        this.connection?.removeEventListener('error', this._error);

        this.connection?.removeEventListener('beforeunload', this._beforeunload);

        this.connection?.removeEventListener('close', this._close);

        this.connection?.removeEventListener('message', this._message);
    }

    bind() {
        // eslint-dosable
        this.connection?.addEventListener('open', this._open);

        this.connection?.addEventListener('error', this._error);

        this.connection?.addEventListener('beforeunload', this._beforeunload);

        this.connection?.addEventListener('close', this._close);

        this.connection?.addEventListener('message', this._message);

    }

    async subscribe(
        symbolInfo: KlineSymbolType,
        interval: TradingViewInterval = '15m',
        limit = 1,
        onRealtimeCallback: AnyFunc,
    ) {

        if (!this.connection || this.inited) {
            return;
        }

        // unsubscribe if symbol or interval changed

        const ifChanged = this.curSubscriptionInfo?.interval !== interval || this.curSubscriptionInfo.symbolInfo.symbol !== symbolInfo.symbol

        if (!ifChanged) return;


        // unsubscribe last subscribtion
        this._send({
            event: 'unsubscribe',
            symbol: this.curSubscriptionInfo?.symbolInfo?.symbol,
            channel: 'kline',
            param: this.curSubscriptionInfo?.interval
        });


        // subscribe new kline
        this._send({
            event: 'subscribe',
            symbol: symbolInfo?.symbol,
            channel: 'kline',
            param: interval
        });

        this.curSubscriptionInfo = {
            symbolInfo,
            interval,
            limit,
            onRealtimeCallback
        };


    }

    disconnect() {
        if (!this.connection) return;
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
        this.connection.close();
        this.inited = false;
        this.connection = null;
    }


    // symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, periodParams: PeriodParams, onResult: HistoryCallback, onError: ErrorCallback

    async initHistoryKline(
        symbolInfo: KlineSymbolType,
        interval: TradingViewInterval = '15m',
        limit: number = 1,
        from: number,
        to: number,
        onHistoryCallback?: HistoryCallback,
    ) {
        // if (!this.connection || !this.inited) return;

        const result = await getHistoryChartData({
            symbol: symbolInfo?.symbol,
            from: from,
            to: to,
            interval,
        });

        console.log("init kline his", result);


        if (!result?.data?.data?.length) {
            onHistoryCallback && onHistoryCallback([], {
                noData: true,
            });
            return;
        }
        // 根据时间排序
        const sortedData = [...result?.data?.data].sort((a, b) => +a?.open_time - +b?.open_time);

        const uniqData = Array.from(new Set(sortedData.map((item) => JSON.stringify(item)))).map((item) =>
            JSON.parse(item),
        );

        const formattedData = this._formatKlineData(uniqData);

        // setTimeout(() => {
        onHistoryCallback && onHistoryCallback(formattedData, {
            noData: !formattedData.length,
        });

    }

    initSubV2Kline(newData: any) {
        const originData = [...this.getData()];
        const originLastData = JSON.parse(JSON.stringify(originData.slice(-1)[0]));
        const tempData = JSON.parse(JSON.stringify(newData));

        // 优化k线连接价格
        // todo 优化时间戳
        const data = tempData.map((i: any) => {
            const time = i?.update_time ? +BigNumber(i?.update_time * 1000).toFixed(0, BigNumber.ROUND_DOWN) : +new Date();
            const ifInDuration = originLastData?.time >= i.start_time * 1000 && i.end_time * 1000 > originLastData?.time;

            return {
                time: time,
                high: ifInDuration
                    ? BigNumber.max(originLastData?.close, i?.max_price ? i?.max_price?.toString() : i?.high).toString()
                    : i?.max_price
                        ? i?.max_price?.toString()
                        : i?.high,
                low: ifInDuration
                    ? BigNumber.min(originLastData?.close, i?.min_price ? i?.min_price?.toString() : i?.low).toString()
                    : i?.min_price
                        ? i?.min_price?.toString()
                        : i?.low,
                open: ifInDuration ? (i?.open_price ? i?.open_price?.toString() : i?.open) : originLastData?.close,
                close: i?.close_price ? i?.close_price?.toString() : i?.close,
            };
        });

        // 更新数据
        this.pushData(data);

        // 如果数据超过300条， 取最新的300 条
        if (this.getData().length > 300) {
            this.updateData(this.getData().slice(-300));
        }

        this.onRealtimeCallback?.(data?.[0]);
    }


    _send(msg: any) {
        // { event: 'subscribe', symbol: symbolInfo?.symbol, channel: 'kline', param: interval }
        console.log("send msg", msg);
        this.connection?.send(JSON.stringify(msg));
    }





}


export const tradingviewSocketIns = new TradingViewSocket('wss://api-testnet.substancex.io/common/');