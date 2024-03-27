import { useRequest } from "ahooks";
import useCurToken from "../../hooks/useCurToken";
import { getHistoryChartData } from "../../service";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { recoilIndexPrices } from "@/app/models";
import dayjs from "dayjs";


/**
 * 初次通过tradingview 的数据获取当前币种的数据
 * @returns 
 */
export const CurrentSymnolPriceEffect = () => {

    const currentToken = useCurToken();
    const updateIndexPrices = useSetRecoilState(recoilIndexPrices);

    const { run, data } = useRequest(getHistoryChartData, {
        manual: true,
    });

    useEffect(() => {
        if(currentToken?.symbolName && data){
            const candle = data.data.data[0];
            updateIndexPrices(last => {
                return {
                    ...last,
                    [currentToken.symbolName]: {
                        price: candle.close_price,
                        change: 0,
                    }
                }
            })
        }

    }, [data, currentToken])

    useEffect(() => {
        run({
            symbol: currentToken.symbolName,
            interval: '1m',
            from: dayjs().subtract(2, 'm').unix(),
            to: dayjs().subtract(1, 'm').unix()
        });
    }, [currentToken.symbolName]);






    return null;
}