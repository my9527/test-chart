"use client";
import styled, { useTheme } from "styled-components";
import DraggableIcon from "../DraggableIcon";
import ArrowIcon from "@/app/assets/header/arrow.svg";
import FavoriteIcon from "@/app/assets/perpetual/favorite.svg";
import StarIcon from "@/app/assets/perpetual/star.svg";
import Image from "next/image";
import { useMemo, memo, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import SearchIcon from "@/app/assets/perpetual/search.svg";
import IntroIcon from "@/app/assets/perpetual/intro.svg";
import ChartIcon from "@/app/assets/perpetual/chart.svg";
import { useRecoilState } from "recoil";
import { recoilFavoriateList } from "@/app/models";
import { filterPrecision } from "@/app/utils/tools";
import use24hPrice from "@/app/perpetual/hooks/use24hPrice";
import useCurToken from "@/app/perpetual/hooks/useCurToken";
import ChangPrice from "./ChangPrice";
import { useIndexPricesById } from "@/app/hooks/useIndexPrices";
import BigNumber from "bignumber.js";
import useTickerPrice from "@/app/hooks/useTickerPrice";
import {
  useOpenInterests,
  useOpenInterestsByAddressId,
  useOpenInterestsBySideId,
} from "../../hooks/useOpenInterest";
import { FutureType } from "@/app/config/common";
import { FundingFeeCountDown } from "./FundingFeeCountDown";
import { FundingFeeRate } from "./FundingFeeRate";
import dynamic from "next/dynamic";
// import { MarketPanel } from "./MarketPanel";

const MarketPanel = dynamic(
  () => import("./MarketPanel").then((mod) => mod.MarketPanel),
  {
    ssr: false,
  }
);

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  padding: 10px 0;
  background: ${(props) => props.theme.colors.fill1};

  padding-left: 34px;
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Layout = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  img {
    cursor: pointer;
  }
`;
const Symbol = styled(Layout)`
  gap: 10px;
  .label {
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.header0};
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
  }

  .change_price {
    color: ${(props) => props.theme.colors.text2};
    font-family: Arial;
    font-style: normal;
    line-height: 100%;
    font-weight: 700;
    .change {
      font-size: ${(props) => props.theme.fontSize.small};
    }
    .price {
      font-size: ${(props) => props.theme.fontSize.header2};
      margin-bottom: 3px;
    }
  }
`;
const Favorite = styled(Image)`
  cursor: pointer;
`;
const Line = styled.div`
  width: 1px;
  height: 17px;
  background: ${(props) => props.theme.colors.border1};
`;
const InfoItem = styled.div`
  font-family: Arial;

  font-style: normal;
  font-weight: 400;

  .label {
    font-size: ${(props) => props.theme.fontSize.min};
    color: ${(props) => props.theme.colors.text4};
    margin-bottom: 7px;
    position: relative;
    display: inline-block;
    line-height: 100%;
    img {
      margin-left: 5px;
    }
  }
  .content {
    line-height: 120%;
    font-size: ${(props) => props.theme.fontSize.small};
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.colors.text1};
  }
`;
const OpenInterest = styled(InfoItem)`
  .pie_chart {
    width: 28px;
    height: 28px;
    position: absolute;
    right: -28px;
    top: 50%;
    transform: translateY(-50%);
  }
  .content {
    .long {
      color: ${(props) => props.theme.colors.text2};
    }
    .short {
      color: ${(props) => props.theme.colors.text5};
    }
  }
`;
const FundingRate = styled(InfoItem)`
  .content {
    .rate {
      color: ${(props) => props.theme.colors.primary1};
    }
    .countdown {
      color: ${(props) => props.theme.colors.text1};
    }
  }
`;
const PerpetualDetail = memo((props) => {
  const { token: curToken, symbolName } = useCurToken();

  const theme = useTheme();
  const [favoriateList, setFavoriateList] = useRecoilState(recoilFavoriateList);

  //获取24h high/low
  const { run, data } = use24hPrice();
  useEffect(() => {
    if (curToken?.symbolName) {
      run({ symbol: curToken?.symbolName });
    }
  }, [curToken]);

  const isFavoriate = useMemo(() => {
    return (
      Object.keys(favoriateList).filter((i) => i === symbolName).length > 0
    );
  }, [favoriateList]);

  const tickerPrice = useTickerPrice();

  const currentTokenOpenLongInterest = useOpenInterestsBySideId(
    FutureType.LONG,
    curToken.futureLongId
  );
  const currentTokenOpenShortInterest = useOpenInterestsBySideId(
    FutureType.SHORT,
    curToken.futureShortId
  );

  // long open interest
  const longIO = useMemo(() => {
    const _long = BigNumber(currentTokenOpenLongInterest?.tokenSize)
      .multipliedBy(curToken.pars)
      .toString();
    return BigNumber(tickerPrice?.currentTickerPrice)
      .multipliedBy(_long || "0")
      .toFixed(2, BigNumber.ROUND_DOWN);
  }, [currentTokenOpenLongInterest, tickerPrice?.currentTickerPrice]);

  // short open interest
  const shortIO = useMemo(() => {
    const _long = BigNumber(currentTokenOpenShortInterest?.tokenSize)
      .multipliedBy(curToken.pars)
      .toString();
    return BigNumber(tickerPrice?.currentTickerPrice)
      .multipliedBy(_long || "0")
      .toFixed(2, BigNumber.ROUND_DOWN);
  }, [currentTokenOpenShortInterest, tickerPrice?.currentTickerPrice]);

  const ifZeroOI = 0,
    longPie = longIO,
    shortPie = shortIO;
  const oiChart = useMemo(() => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={14} height={14}>
          {ifZeroOI ? (
            <Pie
              data={[{ name: "longOI", value: 1 }]}
              dataKey="value"
              fill={theme.colors.text4}
            >
              {[{ name: "longOI", value: 1 }].map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  stroke="transparent"
                  fill={
                    [theme.colors.text4][index % [theme.colors.text4].length]
                  }
                />
              ))}
            </Pie>
          ) : (
            <Pie
              data={[
                { name: "longOI", value: Number(longPie) },
                { name: "shortOI", value: Number(shortPie) },
              ]}
              dataKey="value"
              fill={theme.colors.text4}
            >
              {[
                { name: "longOI", value: Number(longPie) },
                { name: "shortOI", value: Number(shortPie) },
              ].map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  stroke="transparent"
                  fill={
                    [theme.colors.text2, theme.colors.text5][
                      index % [theme.colors.text2, theme.colors.text5].length
                    ]
                  }
                />
              ))}
            </Pie>
          )}
        </PieChart>
      </ResponsiveContainer>
    );
  }, [ifZeroOI, longPie, shortPie]);

  return (
    <Wrapper>
      <Layout>
        <Symbol>
          {/* <Image src={ArrowIcon} width={11} height={6} alt="" /> */}

          <MarketPanel>
            <h3 className="label">{symbolName}/USDT</h3>
          </MarketPanel>
          <ChangPrice
            symbolName={symbolName}
            displayDecimal={curToken?.displayDecimal}
          />
        </Symbol>
        <Favorite
          onClick={() => {
            let _favoriateList = { ...favoriateList };
            if (isFavoriate) {
              delete _favoriateList[symbolName];
            } else {
              _favoriateList[symbolName] = {
                label: symbolName,
                favoriate: true,
              };
            }
            setFavoriateList(_favoriateList);
          }}
          src={isFavoriate ? FavoriteIcon : StarIcon}
          width={22}
          height={22}
          alt=""
        />
        <Line />
        <InfoItem>
          <p className="label">24h High/Low</p>
          <p className="content">
            {filterPrecision(data?.high, curToken?.displayDecimal || 2)}
            &nbsp;/&nbsp;
            {filterPrecision(data?.low, curToken?.displayDecimal || 2)}
          </p>
        </InfoItem>
        <Line />
        <OpenInterest>
          <div className="label">
            <p>Open Interest L/S</p>
            <div className="pie_chart">{oiChart}</div>
          </div>
          <div className="content">
            <p className="long">
              ${filterPrecision(longIO, curToken.displayDecimal)}
            </p>
            /
            <p className="short">
              ${filterPrecision(shortIO, curToken.displayDecimal)}
            </p>
          </div>
        </OpenInterest>
        <Line />
        <FundingRate>
          <div className="label">
            <p>Funding Rate L/S(D) | Countdown</p>
          </div>
          <div className="content">
            <p className="rate">
              <FundingFeeRate />
            </p>
            <p className="short">
              |<FundingFeeCountDown />
            </p>
          </div>
        </FundingRate>
        <Line />
        <InfoItem>
          <p className="label">Max Profit Ratio</p>
          <p className="content">
            {BigNumber(curToken.maxProfitRatio as number)
              .multipliedBy(100)
              .toFixed(2, BigNumber.ROUND_DOWN)}
            %
          </p>
        </InfoItem>
      </Layout>
      <Layout>
        <Image src={SearchIcon} width={23} height={23} alt="" />
        <Image src={IntroIcon} width={23} height={23} alt="" />
        <Image src={ChartIcon} width={23} height={23} alt="" />
      </Layout>
      <DraggableIcon />
    </Wrapper>
  );
});
export default PerpetualDetail;
