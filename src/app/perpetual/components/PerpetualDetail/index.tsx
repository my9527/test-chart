"use client";
import styled, { useTheme } from "styled-components";
import DraggableIcon from "../DraggableIcon";
import ArrowIcon from "@/app/assets/header/arrow.svg";
import FavoriteIcon from "@/app/assets/perpetual/favorite.svg";
import StarIcon from "@/app/assets/perpetual/star.svg";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useMemo, memo } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import SearchIcon from "@/app/assets/perpetual/search.svg";
import IntroIcon from "@/app/assets/perpetual/intro.svg";
import ChartIcon from "@/app/assets/perpetual/chart.svg";
import { useRecoilState, useRecoilValue } from "recoil";
import { recoilFavoriateList, recoilIndexPrices } from "@/app/models";
import { tokens } from "@/app/config/tokens";

const Wrapper = styled.div`
  width: 100%;
  /* height: 50px; */
  padding: 10px 0;
  background: ${(props) => props.theme.colors.fill1};
  /* border-bottom: ${(props) => `1px solid ${props.theme.colors.border1}`}; */
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
  const params = useParams<{ symbol: string }>();
  const { symbol } = params;

  const theme = useTheme();
  const [favoriateList, setFavoriateList] = useRecoilState(recoilFavoriateList);
  const indexPrices = useRecoilValue(recoilIndexPrices);

  const isFavoriate = useMemo(() => {
    return Object.keys(favoriateList).filter((i) => i === symbol).length > 0;
  }, [favoriateList]);

  const ifZeroOI = 0,
    longPie = 130,
    shortPie = 232;
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
          <h3 className="label">{symbol}/USDT</h3>
          <Image src={ArrowIcon} width={11} height={6} alt="" />
          <div className="change_price">
            <p className="price">{indexPrices[symbol]?.price || '-'}</p>
            <p className="change">+10.26%</p>
          </div>
        </Symbol>
        <Favorite
          onClick={() => {
            let _favoriateList = { ...favoriateList };
            if (isFavoriate) {
              delete _favoriateList[symbol];
            } else {
              _favoriateList[symbol] = { label: symbol, favoriate: true };
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
          <p className="content">26000.00/24000.00</p>
        </InfoItem>
        <Line />
        <OpenInterest>
          <div className="label">
            <p>Open Interest L/S</p>
            <div className="pie_chart">{oiChart}</div>
          </div>
          <div className="content">
            <p className="long">$2,123,456.00</p>/
            <p className="short">$2,123,456.00</p>
          </div>
        </OpenInterest>
        <Line />
        <FundingRate>
          <div className="label">
            <p>Funding Rate L/S(D) | Countdown</p>
          </div>
          <div className="content">
            <p className="rate">+0.1% / -0.1% </p>
            <p className="short">|1h 56m 59s</p>
          </div>
        </FundingRate>
        <Line />
        <InfoItem>
          <p className="label">Max Profit Ratio</p>
          <p className="content">9,999.99%</p>
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
