




// config kline symbol
export type KlineSymbolType = {
    ticker: string,
    symbol: string,
    name: string,
    description: string,
    type: string,
    session: '24x7',
    timezone: 'UTC',
    minmov: number, // 最小波动
    pricescale: number,
    has_intraday: boolean, // 是否提供日内分钟数据
    has_weekly_and_monthly: boolean,
    exchange: string,
}


export const timeScale: any = {
    '1s': '1s',
    1: '1m',
    5: '5m',
    15: '15m',
    30: '30m',
    60: '1h',
    120: '2h',
    240: '4h',
    360: '6h',
    720: '12h',
    '1d': '1d',
    '2d': '2d',
    // '1w': '1w',
  };
  
export const timeScaleInterval: any = {
'1s': 1000,
1: 1000,
5: 3000,
15: 3000,
30: 3000,
60: 3000,
120: 3000,
720: 3000,
'1d': 3000,
// '1w': '1w',
};