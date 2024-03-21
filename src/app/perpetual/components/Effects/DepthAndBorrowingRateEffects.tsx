import { useCallback, useEffect, useRef } from "react";
import useCurToken from "../../hooks/useCurToken";
import { useRequest } from "ahooks";
import { request } from "@/app/lib/request";
import BigNumber from "bignumber.js";
import { useSetRecoilState } from "recoil";
import { recoilDepthAndBorrowingRate } from "../../models/market";


// export const getSubstanceDepth = async ({ symbol }: { symbol: string }) => {
//     const res = await Promise.all([
//       // axios.get(`${baseUrl}api/backend/get_funding_fee_per_token?futurename=${symbol}&futuretype=0`),
//       // axios.get(`${baseUrl}api/backend/get_funding_fee_per_token?futurename=${symbol}&futuretype=1`),
//       axios.get(`${baseUrl}api/backend/get_substance_depth?symbol=${symbol}`),
//     ]);
  
//     // const longBorrowFee = BigNumber(res?.[0]?.data || 0).toString();
//     // const shortBorrowFee = BigNumber(res?.[1]?.data || 0).toString();
//     const buyPriceImpactDepth = BigNumber(res?.[0]?.data?.data?.bid_total_volume || 0).toString();
//     const sellPriceImpactDepth = BigNumber(res?.[0]?.data?.data?.ask_total_volume || 0).toString();
  
//     const config = res?.[0]?.data;
  
//     return { config, buyPriceImpactDepth, sellPriceImpactDepth };
//   };
  
//   export const getSubstanceBorrowingRate = async ({ symbol, chainName }: { symbol: string; chainName: string }) => {
//     try {
//       // const url = chainName.toLocaleLowerCase().includes('scroll') ? baseUrl_scroll : baseUrl;
//       // 多链配置
//       const name = (chainName || '').toLocaleLowerCase();
//       const url = name.includes('scroll') ? baseUrl_scroll : name.includes('zkfair') ? baseUrl_zkFair : baseUrl;
  
//       const res: any = await Promise.all([
//         axios.get(`${url}api/backend/get_substance_borrowing_rate?symbol=${symbol}&futuretype=0`),
//         axios.get(`${url}api/backend/get_substance_borrowing_rate?symbol=${symbol}&futuretype=1`),
//       ]);
  
//       return {
//         borrowingRateLong: res?.[0]?.data?.data,
//         borrowingRateShort: res?.[1]?.data?.data,
//         borrowingRateLongPerDay: BigNumber(24).multipliedBy(res?.[0]?.data?.data).div(1e6).multipliedBy(100).toString(),
//         borrowingRateShortPerDay: BigNumber(24).multipliedBy(res?.[1]?.data?.data).div(1e6).multipliedBy(100).toString(),
//       };
//     } catch (e) {
//       return {
//         borrowingRateLong: 0,
//         borrowingRateShort: 0,
//         borrowingRateLongPerDay: 0,
//         borrowingRateShortPerDay: 0,
//       };
//     }
  
//     // return { config, buyPriceImpactDepth, sellPriceImpactDepth };
//   };

export const DepthAndBorrowingRateEffect = () => {

    const curToken = useCurToken();

    const updateDepthAndBorrowingRate = useSetRecoilState(recoilDepthAndBorrowingRate);


    const tokenRef = useRef(curToken);

    useEffect(() => {
        tokenRef.current = curToken;
    }, [curToken]);


    const getMarketDepth = useCallback(() => {
        async function _run() {
            const result = await request.get(`api/backend/get_substance_depth?symbol=${tokenRef.current.symbolName}`)
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

    const getBorrowingRate = useCallback(()=> {
        async function _run() {
            const res: any = await Promise.all([
                request.get(`api/backend/get_substance_borrowing_rate?symbol=${tokenRef.current.symbolName}&futuretype=0`),
                request.get(`api/backend/get_substance_borrowing_rate?symbol=${tokenRef.current.symbolName}&futuretype=1`),
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


    const runRequests = useCallback(() => {
        async function _run() {

            if(!tokenRef.current) return;
            const [depth, borrowingRate] = await Promise.all([
                getMarketDepth(),
                getBorrowingRate()
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
        pollingInterval: 15_000
    });


    useEffect(() => {
        run();

        return () => {
            cancel();
        }
    }, [run, cancel]);









    return null;
}