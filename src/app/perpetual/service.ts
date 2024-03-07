

import { request } from "../lib/request";
import dayjs from "dayjs";


// get history kline data
export const getHistoryChartData = ({
    symbol = 'ETH',
    from = dayjs().subtract(1, 'd').unix(),
    to = dayjs().unix(),
    interval = '1m',
}: {
    symbol?: string;
    from?: number;
    to?: number;
    interval?: string;
}) => {
    console.log("query backend/get_candlestick_chart");
    return request.get('api/backend/get_candlestick_chart', {
        params: {
            symbol: `${symbol}/USD`,
            st: from,
            end: to,
            interval,
        },
    });
}