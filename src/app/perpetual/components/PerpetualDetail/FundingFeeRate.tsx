import { recoilLPInfo } from "@/app/models";
import { FC, memo, useMemo } from "react";
import { useRecoilValue } from "recoil";
import useCurToken from "../../hooks/useCurToken";
import { useGlobalUSDValue, useGlobalUSDValueByIdSide } from "../../hooks/useGlobalUSDValue";
import { useUSDTokens } from "@/app/hooks/useTokens";
import BigNumber from "bignumber.js";
import { useOpenInterestsBySideId } from "../../hooks/useOpenInterest";
import { FutureType } from "@/app/config/common";



export const FundingFeeRate: FC = memo(() => {


    const lpInfo = useRecoilValue(recoilLPInfo);

    const currentToken = useCurToken();


    const [longUSD, shortUSD] = useGlobalUSDValue();

    const { tokenSize: currentTokenUSDValueLong } = longUSD || { tokenSize: 0 };
    const { tokenSize: currentTokenUSDValueShort } = shortUSD || { tokenSize: 0 };
    const usdTokens = useUSDTokens();

    const currentTokenOpenInterestLong = useOpenInterestsBySideId(FutureType.LONG, currentToken.token.futureLongId);
    const currentTokenOpenInterestShort = useOpenInterestsBySideId(FutureType.SHORT, currentToken.token.futureShortId);

    // const liquidityPoolData: LiquidityPoolInterface[] = useMemo(() => {
    //     const poolAmountList = tokens.map((token) => {
    //       const { label, image: icon, stable, exchangeStable, kLineSymbol } = token;
    //       const poolAmount = lpInfoData ? lpInfoData.amount : '0';
    //       const lockedAmount = lpInfoData ? lpInfoData.lockedAmount : '0';
    //       const price = token?.stable || token?.exchangeStable ? 1 : priceList[kLineSymbol || '']?.price || 0;
    //       const poolSize = BigNumber(poolAmount).multipliedBy(price).toNumber();
    //       const obj: any = {
    //         label,
    //         icon,
    //         poolAmount,
    //         lockedAmount,
    //         poolSize,
    //         price,
    //       };
    //       stable && (obj.stable = stable);
    //       exchangeStable && (obj.exchangeStable = exchangeStable);
    //       return obj;
    //     });

    //     const totalAmount = poolAmountList.reduce((a, b) => BigNumber(b.poolAmount).plus(a).toNumber(), 0);
    //     const totalPoolSize = poolAmountList.reduce((a, b) => BigNumber(b.poolSize).plus(a).toNumber(), 0);
    //     setTotalPoolSize(totalPoolSize);

    //     const resData = poolAmountList.map((el) => {
    //       const { label: token, icon, poolSize, price, poolAmount, lockedAmount } = el;
    //       const poolSizeStr = formatNum(poolSize, { suffix: `${token}` });
    //       const priceStr = formatNum(price, { prefix: '$' });
    //       const currentWeight = BigNumber(totalAmount).eq(0)
    //         ? '0.00'
    //         : BigNumber(poolAmount).div(totalAmount).times(100).toFixed(2, BigNumber.ROUND_DOWN);
    //       const availableAmount = BigNumber(poolAmount).minus(lockedAmount).toNumber();
    //       const available = formatNum(availableAmount, { suffix: `${token}` });
    //       const usage = BigNumber(poolAmount).eq(0) ? 0 : BigNumber(lockedAmount).div(poolAmount).toNumber();
    //       const usagePct = BigNumber(usage).times(100).toFixed(4, BigNumber.ROUND_DOWN);
    //       const ifShowLpUsageWarning = BigNumber(usagePct).gte(70);

    //       return {
    //         token,
    //         icon,
    //         poolSizeUnformatted: poolSize.toString(),
    //         poolSize: poolSizeStr,
    //         price: priceStr,
    //         currentWeight: `${currentWeight}%`,
    //         targetWeight: '0.00%',
    //         available,
    //         usage: `${usagePct}%`,
    //         ifShowLpUsageWarning,
    //       };
    //     });

    //     return resData;
    //   }, [lpInfoData, priceList, tokens]);


    // 只有一个pool
    const poolInfoData = useMemo(() => {

        const usdToken = usdTokens[0];

        const { poolAmount, poolLockedAmount } = lpInfo;
        const price = 1;
        const poolSize = BigNumber(poolAmount).multipliedBy(price).toNumber();

        return {
            poolSizeUnformatted: poolSize.toString(),
            poolSize: 'formatNum(poolSize, { suffix: `${token}` }),',
        }


        // const amounts

    }, [usdTokens, lpInfo]);

    const totalLiquidity = useMemo(() => {
        return poolInfoData.poolSizeUnformatted;
    }, [poolInfoData]);


    const longPosPayfeeRate = useMemo(() => {

        if (!currentTokenUSDValueLong || BigNumber(currentTokenUSDValueLong).isNaN() || BigNumber(totalLiquidity).isNaN()) {
            return undefined;
        }
        return BigNumber(currentToken.token?.fundingFeeBaseRate)
            .plus(
                BigNumber(currentToken.token?.fundingFeeLinearRate)
                    .multipliedBy(currentTokenUSDValueLong)
                    .div(totalLiquidity)
                    .div(currentToken.token?.maxliquidityLockRatio),
            )
            .toString();


    }, [currentTokenUSDValueLong, totalLiquidity, currentToken.token]);

    const shortPosPayfeeRate = useMemo(() => {
        if (
            !currentTokenUSDValueShort ||
            BigNumber(currentTokenUSDValueShort).isNaN() ||
            // BigNumber(currentSelectTokenGlobalUsdValue?.short).isZero() ||
            BigNumber(totalLiquidity).isNaN()
        ) {
            return undefined;
        }

        const shortPosPayfeerate = BigNumber(currentToken.token?.fundingFeeBaseRate)
            .plus(
                BigNumber(currentToken.token?.fundingFeeLinearRate)
                    .multipliedBy(currentTokenUSDValueShort)
                    .div(totalLiquidity)
                    .div(currentToken.token?.maxliquidityLockRatio),
            )
            .toString();

        return shortPosPayfeerate;
    }, [
        currentTokenUSDValueShort,
        totalLiquidity,
        currentToken.token?.fundingFeeBaseRate,
        currentToken.token?.fundingFeeLinearRate,
        currentToken.token?.maxliquidityLockRatio,
    ]);

    const longOIFee = useMemo(() => {
        if (!shortPosPayfeeRate || !longPosPayfeeRate) return undefined;
        let resV2 = '0';

        if (
            BigNumber(currentTokenOpenInterestLong?.tokenSize).isZero() &&
            BigNumber(currentTokenOpenInterestLong?.tokenSize).eq(currentTokenOpenInterestShort?.tokenSize)
        ) {
            resV2 = '0';
        } else if (BigNumber(currentTokenOpenInterestLong?.tokenSize).gte(currentTokenOpenInterestShort?.tokenSize)) {
            // shortPosPayfeerate * shortGlobalUsdValue / longGlobalUsdValue - longPosPayfeerate
            resV2 = BigNumber(shortPosPayfeeRate)
                .multipliedBy(currentTokenUSDValueShort)
                .div(currentTokenUSDValueLong)
                .minus(longPosPayfeeRate)
                .multipliedBy(100)
                .toString();
        } else {
            // ( shortPosPayfeerate - longPosPayfeerate ) * ( 1 )
            resV2 = BigNumber(1)
                .multipliedBy(BigNumber(shortPosPayfeeRate).minus(longPosPayfeeRate))
                .multipliedBy(100)
                .toString();
        }

        return BigNumber(resV2).isNaN() ? '-' : resV2;
    }, [
        currentTokenOpenInterestLong,
        currentTokenOpenInterestShort,
        currentTokenUSDValueShort,
        currentTokenUSDValueLong,
        longPosPayfeeRate,
        shortPosPayfeeRate,
    ]);


    return <span>{longOIFee || '-'}</span>;
});