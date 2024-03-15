import { request } from "../lib/request";

// get token price kline data
export const getTokenPriceChartData = () => {
  return request.get('api/backend/get_epoch_statistics', {
    params: {
      limit: 100,
    },
  });
}