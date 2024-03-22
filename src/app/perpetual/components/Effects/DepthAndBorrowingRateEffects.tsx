import { useCallback, useEffect, useRef } from "react";
import useCurToken from "../../hooks/useCurToken";
import { useRequest } from "ahooks";
import { request } from "@/app/lib/request";
import BigNumber from "bignumber.js";
import { useSetRecoilState } from "recoil";
import { recoilDepthAndBorrowingRate } from "../../models/market";


export const DepthAndBorrowingRateEffect = () => {

    const curToken = useCurToken();

    const updateDepthAndBorrowingRate = useSetRecoilState(recoilDepthAndBorrowingRate);


    const tokenRef = useRef(curToken);

    useEffect(() => {
        tokenRef.current = curToken;
    }, [curToken]);


    const getMarketDepth = useCallback((symbolName: string) => {
        async function _run() {
            const result = await request.get(`api/backend/get_substance_depth?symbol=${symbolName}`)
            const buyPriceImpactDepth = BigNumber(result.data?.data?.bid_total_volume || 0).toString();
            const sellPriceImpactDepth = BigNumber(result.data?.data?.ask_total_volume || 0).toString();

            return {
                origin: result.data.data,
                buyPriceImpactDepth,
                sellPriceImpactDepth,
            }

        }

        return _run();
        
    }, []);

    const getBorrowingRate = useCallback((symbolName: string)=> {
        async function _run() {
            const res: any = await Promise.all([
                request.get(`api/backend/get_substance_borrowing_rate?symbol=${symbolName}&futuretype=0`),
                request.get(`api/backend/get_substance_borrowing_rate?symbol=${symbolName}&futuretype=1`),
              ]);
          
              return {
                borrowingRateLong: res?.[0]?.data?.data,
                borrowingRateShort: res?.[1]?.data?.data,
                borrowingRateLongPerDay: BigNumber(24).multipliedBy(res?.[0]?.data?.data).div(1e6).multipliedBy(100).toString(),
                borrowingRateShortPerDay: BigNumber(24).multipliedBy(res?.[1]?.data?.data).div(1e6).multipliedBy(100).toString(),
              };
        }

        return _run();
    }, []);


    const runRequests = useCallback((symbolName: string) => {
        async function _run() {

            if(!symbolName) return;
            const [depth, borrowingRate] = await Promise.all([
                getMarketDepth(symbolName),
                getBorrowingRate(symbolName)
            ]);

            updateDepthAndBorrowingRate({
                depth,
                borrowingRate,
            });

        }

        return _run();
    }, [getMarketDepth, getBorrowingRate]);


    
    const { run, cancel } = useRequest(runRequests, {
        manual: true,
        pollingInterval: 15_000,
        refreshDeps: [curToken.symbolName]
    });


    useEffect(() => {

        if(curToken.symbolName) {
            run(curToken.symbolName);

            return () => {
                cancel();
            }
        }
        
    }, [run, cancel, curToken.symbolName]);









    return null;
}