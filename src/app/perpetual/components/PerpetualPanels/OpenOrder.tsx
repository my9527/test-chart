"use client";
import styled from "styled-components";
import Price from "./Price";
import CurrencySelect from "@/app/components/CurrencySelect";
import Slider from "../Slider";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import Input from "@/app/components/Input";
import CheckBox from "@/app/components/CheckBox";
import { verifyValidNumber } from "@/app/utils/tools";
import {
  filterPrecision,
  getExponent,
  filterThousands,
} from "@/app/utils/tools";
import { recoilOpenInterests } from "@/app/models";
import { useRecoilValue } from "recoil";
import BigNumber from "bignumber.js";
import { Token } from "@/app/config/tokens";
import Btns from "./Btns";
import Modal from "@/app/components/Modal";
import OrderConfirm from "./OrderConfirm";
import { ParamsProps } from "./OrderConfirm";
import { useExchangeBalance } from "@/app/hooks/useBalance";
import { usePriceImpactK } from "../../hooks/usePriceImpactK";
import { usePriceImpactDepth } from "../../hooks/usePriceImpactDepth";
import { useSendTxByDelegate } from "@/app/hooks/useSendTxByDelegate";
import { ethers } from "ethers";
import { useContractParams } from "@/app/hooks/useContractParams";
import { useAppConfig } from "@/app/hooks/useAppConfig";
import { FutureType } from "@/app/config/common";
import dayjs from "dayjs";
import { formatNumber } from "@/app/lib/common";
import useTickerPrice from "@/app/hooks/useTickerPrice";
import { encodeTx } from "@/app/lib/txTools";
import { useExecutionFee } from "@/app/hooks/useExecutionFee";



const MakeOrderFunctionName = {
  LIMIT: 'makeIncreaseLimitOrder',
  MARKET: 'makeIncreaseMarketOrder',
  STOP: 'makeFutureStopOrder',
}



const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 14px;
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
  }
`;

// const Price = styled(Layout)`
//   .market {
//     color: ${(props) => props.theme.colors.primary1};
//     text-align: right;
//     font-family: Arial;
//     font-size: ${(props) => props.theme.fontSize.medium};
//     font-style: normal;
//     font-weight: 400;
//     line-height: 100%;
//     cursor: pointer;
//     padding: 0 8px;
//   }
// `;
const MarginAmount = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
  .unit {
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;

    padding: 0 4px;
    border-radius: 2px;
    background: ${(props) => props.theme.colors.fill2};
    display: flex;
    align-items: center;
    height: 20px;
  }
`;
const StyledLayout = styled(Layout)`
  flex: 1;
`;
const StyledCurrencySelect = styled(CurrencySelect)`
  padding: 0 4px;
  border-radius: 2px;
  background: ${(props) => props.theme.colors.fill2};
  .cur_currency {
    height: 20px;
    padding-right: 0px;
  }
`;
const DataItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: Arial;
  font-size: ${(props) => props.theme.fontSize.small};
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
  .label {
    color: ${(props) => props.theme.colors.text4};
  }
  .value {
    color: ${(props) => props.theme.colors.text1};
  }
  .slippage {
    border-radius: 999px;
    background: ${(props) => props.theme.colors.fill2};
    padding: 3px 8px;
    color: ${(props) => props.theme.colors.primary1};
    border: ${(props) => `1px solid transparent`};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.small};
    font-style: normal;
    font-weight: 400;
    line-height: 120%;

    box-sizing: border-box;
    display: flex;
    align-items: center;
    &:hover,
    &:active {
      border: ${(props) => `1px solid ${props.theme.colors.primary1}`};
    }
    span {
      line-height: 120%;
      display: inline-block;
      width: 40px;
      padding-right: 5px;
      text-align: right;
    }
    .input {
      background: ${(props) => props.theme.colors.fill2};
      outline-style: none;
      width: 40px;

      height: 100%;
      border: none;
      color: ${(props) => props.theme.colors.primary1};
      text-align: right;
      font-family: Arial;
      font-size: ${(props) => props.theme.fontSize.small};
      font-style: normal;
      font-weight: 400;
      line-height: 120%;
      padding-right: 5px;
    }
  }
`;
const Data = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
`;
const StopOrder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  .title_area {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title_text {
      color: ${(props) => props.theme.colors.text1};
      font-family: Arial;
      font-size: ${(props) => props.theme.fontSize.medium};
      font-style: normal;
      font-weight: 400;
      line-height: 100%;
    }
  }
  .input_area {
    display: flex;
    align-items: center;
    gap: 20px;
    .item {
      display: flex;
      flex-direction: column;
      gap: 5px;
      .pnl {
        color: ${(props) => props.theme.colors.text1};
        font-family: Arial;
        font-size: ${(props) => props.theme.fontSize.small};
        font-style: normal;
        font-weight: 400;
        line-height: 120%;
        .long {
          color: ${(props) => props.theme.colors.text2};
        }
        .short {
          color: ${(props) => props.theme.colors.text5};
        }
      }
    }

    .unit {
      color: ${(props) => props.theme.colors.text1};
      font-family: Arial;
      font-size: ${(props) => props.theme.fontSize.medium};
      font-style: normal;
      font-weight: 400;
      line-height: 100%;
      padding-right: 8px;
    }
  }
`;
const Fee = styled(DataItem)`
  position: relative;
  & > .label {
    cursor: pointer;
    &:hover {
      color: ${(props) => props.theme.colors.primary1};
      .content {
        display: block;
      }
    }
  }

  .content {
    transition: all 0.3s linear;
    display: none;
    position: absolute;
    top: 15px;
    left: 0;
    right: 0;
    padding: 27px 20px;

    border-radius: 8px;
    border: ${(props) => `1px solid ${props.theme.colors.fill2}`};
    background: ${(props) => props.theme.colors.fill2};
    .upgrade_item {
      margin-bottom: 16px;
    }
    .upgrade {
      color: ${(props) => props.theme.colors.primary1};
      cursor: pointer;
    }
  }
`;
const DefaultBtn = styled.div`
  border-radius: 40px;
  background: ${(props) => props.theme.colors.fill2};
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.text4};
  font-family: Arial;
  font-size: ${(props) => props.theme.fontSize.medium};
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
  padding: 13px 0;
`;
const OpenOrder: React.FC<{
  activeOrderTab: string;
  margin: string;
  setMargin: Function;
  symbolName: string;
  leverage: number;
  curToken: Token;
}> = ({
  activeOrderTab,
  margin,
  setMargin,
  symbolName,
  leverage,
  curToken,
}) => {
    const [price, setPrice] = useState<string>("");
    const [curCurrency, setCurCurrency] = useState("USD");
    const [amount, setAmount] = useState<string>("");

    const [showStopOrder, setShowStopOrder] = useState<boolean>(false);
    const [longStopPrice, setLongStopPrice] = useState<string>("");
    const [shortStopPrice, setShortStopPrice] = useState<string>("");

    const { currentTokenAvailableLiq } = useRecoilValue(recoilOpenInterests);
    const appConfig = useAppConfig();
    const tickerPrice = useTickerPrice();

    const executionFee = useExecutionFee();

    const MarketOrderContractParams = useContractParams(appConfig.contract_address.MarketOrderImplementationAddress);
    const LimitOrderContractParams = useContractParams(appConfig.contract_address.LimitOrderImplementationAddress);
    const StopOrderContractParams = useContractParams(appConfig.contract_address.StopOrderImplementationAddress);






    const [slippage, setSlippage] = useState(
      localStorage.getItem("slippage") ?? "0.5"
    );

    const [visible, setVisible] = useState(false);

    const onClose = () => {
      setVisible(false);
    };
    const onConfirm = () => {
      setVisible(false);
    };
    const onCancel = () => {
      setVisible(false);
    };

    const longAvailableTokenForFutureResults = useMemo(() => {
      const long = currentTokenAvailableLiq?.longReadable || "0";

      return BigNumber(long).toString();
    }, [currentTokenAvailableLiq?.longReadable]);

    const shortAvailableTokenForFutureResults = useMemo(() => {
      const short = currentTokenAvailableLiq?.shortReadable || "0";

      return BigNumber(short).toString();
    }, [currentTokenAvailableLiq?.shortReadable]);

    const longPnl = useMemo(() => {
      let v = "--";
      if (amount && price && longStopPrice) {
        if (!shortStopPrice && shortStopPrice) {
          v = filterPrecision(
            BigNumber(
              curCurrency === "USD"
                ? ((+longStopPrice - +price) * +amount) / +price
                : (+longStopPrice - +price) * +amount
            )
              .abs()
              .toString(),
            curToken?.displayDecimal
          );
        } else {
          v = filterPrecision(
            BigNumber(
              curCurrency === "USD"
                ? ((+longStopPrice - +price) * +amount) / +price
                : (+longStopPrice - +price) * +amount
            ).toString(),
            curToken?.displayDecimal
          );
        }
      }
      return v;
    }, [amount, price, longStopPrice, curCurrency, shortStopPrice]);

    const shortPnl = useMemo(() => {
      let v = "--";
      if (amount && price && shortStopPrice) {
        if (!longStopPrice) {
          v = filterPrecision(
            BigNumber(
              curCurrency === "USD"
                ? ((+shortStopPrice - +price) * +amount) / +price
                : (+shortStopPrice - +price) * +amount
            )
              .abs()
              .toString(),
            curToken?.displayDecimal
          );
          v = "-" + v;
        } else {
          v = filterPrecision(
            BigNumber(
              curCurrency === "USD"
                ? ((+price - +shortStopPrice) * +amount) / +price
                : (+price - +shortStopPrice) * +amount
            ).toString(),
            curToken?.displayDecimal
          );
        }
      }
      return v;
    }, [amount, price, shortStopPrice, curCurrency, longStopPrice]);

    // u本位 amount=margin*leverage ,amount输入变化，leverage不变，margin变化，下面百分比变化，百分比*fund savailable=amount
    // 币本位 amount=margin*leverage/price，amount输入变化同上

    const [inputAmount, setInputAmount] = useState<string>("");
    const [marginPercent, setMarginPercent] = useState<number>(0);


    const exchangeBalance = useExchangeBalance();


    const fundsAvailable = exchangeBalance['USDX']?.balanceReadable || '0' as string;
    const [isInput, setIsInput] = useState(false);

    const amountDecimal = useMemo(() => {
      if (curCurrency === "USD") {
        return 6;
      } else {
        return getExponent(Number(curToken?.perpConfig?.contractSize) || 1);
      }
    }, [curCurrency, curToken]);

    useEffect(() => {
      if (!isInput) {
        if (curCurrency === "USD") {
          setAmount(
            BigNumber(margin).multipliedBy(leverage).gt(0) ? filterPrecision(BigNumber(margin).multipliedBy(leverage).toString(), amountDecimal) : ""
            // +margin * leverage
            //   ? filterPrecision(+margin * +leverage, amountDecimal)
            //   : ""
          );
        } else {


          setAmount(
            margin && price
            ? filterPrecision(BigNumber(margin).multipliedBy(leverage).dividedBy(price).toString(), amountDecimal) : ""
              // ? filterPrecision((+margin * leverage) / +price, amountDecimal)
              // : ""
          );
        }
      }
    }, [margin, leverage, curCurrency, price, isInput, curToken, amountDecimal]);

    useEffect(() => {
      if (!+fundsAvailable) {
        return;
      }
      const arr = (+margin / +fundsAvailable + "").split(".");
      const per = +(arr[0] + "." + (arr[1] ? arr[1].substring(0, 4) : "00"));
      setMarginPercent(+per > 1 ? 1 : +per);
    }, [margin, fundsAvailable]);

    useEffect(() => {
      setInputAmount(amount);
    }, [amount, amountDecimal]);

    useEffect(() => {
      if (isInput) {
        if (curCurrency === "USD") {
          setMargin(
            filterPrecision(+amount / leverage, curToken?.displayDecimal) || ""
          );
        } else {
          setMargin(
            filterPrecision(
              (+amount * +price) / leverage,
              curToken?.displayDecimal
            ) || ""
          );
        }
      }
    }, [inputAmount, isInput, curCurrency, price]);

    const [confirmedParams, setConfirmedParams] = useState<
      ParamsProps | undefined
    >();
    const [longStopPriceInputType, setLongStopPriceInputType] =
      useState("normal");
    const [shortStopPriceInputType, setShortStopPriceInputType] =
      useState("normal");

    const currencyAmount = useMemo(() => {
      let _amount = amount;
      if (curCurrency !== "USD") {
        _amount = BigNumber(amount).multipliedBy(price).toString();
      }

      return _amount;
    }, [amount, curCurrency, curToken]);

    const priceImpactK = usePriceImpactK(curToken.symbolName);

    const { buyPriceImpactDepth, sellPriceImpactDepth } = usePriceImpactDepth();

    const { sendByDelegate } = useSendTxByDelegate();

    /**
     * 生成 limit or market tx params;
     */
    const createTx = useCallback((side: FutureType,type: string, margin_: string, price_: string, amount_: string, slippage_: string | number, token_: Token) => {


      const curTokenParDecimal = getExponent(token_.pars);
      
      const formattedTokenSizeToPar = BigNumber(margin_)
        .div(BigNumber.max(token_?.pars))
        .toString();
        
      const formattedSize = ethers.utils
        .parseUnits(formatNumber(formattedTokenSizeToPar, curTokenParDecimal), curTokenParDecimal)
        .toString();

      const params = [
        side === FutureType.LONG ? token_.futureLongId : token_.futureShortId,
        ethers.utils.parseUnits(BigNumber(price_).toString(), 6).toString(), // 根据market 或 limit， 此处的price 有两种计算模式
        formattedSize,
        ethers.utils.parseUnits(amount_, 6).toString() 
      ];
    

      const isMarket = type === 'market';
      if(isMarket) {
        params.push(+dayjs().add(5, 'm').unix());
      }
      params.push(side === FutureType.LONG ? FutureType.LONG : FutureType.SHORT);
      const methodName = isMarket ? MakeOrderFunctionName.MARKET : MakeOrderFunctionName.LIMIT;

      const txData = encodeTx({
        abi: isMarket ? MarketOrderContractParams.abi : LimitOrderContractParams.abi,
        functionName: methodName,
        args: params,
      });

      const contractAddress = isMarket ? MarketOrderContractParams.address : LimitOrderContractParams.address;
      return [
        contractAddress, 
        false,
        appConfig.executionFee,
        txData
      ];
    }, []);

    /**
     * 生成 stop order tx params;
     */
    const createStopTx = useCallback((token_: Token, size: string | number,triggerPrice: string, futureType_: FutureType, isStopLoss: boolean ) => {

      // futureId,
      // size,
      // triggerPrice,
      // isStopLoss,
      // futureType,
      const paramData = encodeTx({
        abi: StopOrderContractParams.abi,
        functionName: MakeOrderFunctionName.STOP,
        args: [
          token_.futureLongId,
          BigNumber(size).div(getExponent(token_.pars)).toFixed(0, BigNumber.ROUND_DOWN),
          triggerPrice,
          isStopLoss,
          futureType_
        ]
      });


      return [
        StopOrderContractParams.address,
        false,
        appConfig.executionFee,
        paramData
      ]


      const p = [
        // futureId,
        // size = amount / pars
        // triggerPrice 
        // allowfailure
        // futureType
      ]




      // const contracts = await prepareWriteContract({
      //   ...StopOrderImplementationContract,
      //   chainId: chain?.id,
      //   functionName: 'makeFutureStopOrder',
      //   args: arg,
      // });
      // stopOrderConfig.push([contracts.address, false, execFeeRaw, contracts.request.data]);

    }, []);


    //
    const submitTx = useCallback((params: any, handleType: string, tickPrice: string | number) => {
      const delegateParams = [];

      // 交易方向是long 或者 short
      const isHandleTypeLong = handleType === 'long';

      // 正常单
      const normalParams = createTx(
        isHandleTypeLong ? FutureType.LONG : FutureType.SHORT, // 方向
        params.activeOrderTab, // 市价/限价
        params.margin, // 保证金
        BigNumber(params.activeOrderTab === 'limit' ? price : tickPrice).toString(),// 价格
        params.amount, // 数量
        params.slippage, // 滑点
        curToken,
      );

      delegateParams.push(normalParams);

      
      // 止盈单
      if(params.longStopPrice) {
        delegateParams.push(createStopTx(curToken, params.amount, params.longStopPrice, isHandleTypeLong ? FutureType.SHORT : FutureType.LONG, false))
      }
      // 止损单
      if(params.shortStopPrice) {
        delegateParams.push(createStopTx(curToken, params.amount, params.shortStopPrice, isHandleTypeLong ? FutureType.LONG : FutureType.SHORT, true))
      }
      // 发起交易
      sendByDelegate({
        data: delegateParams,
        // 计算需要支付的金额去执行交易
        value: delegateParams.reduce((result, cur: any) => {
          return result.plus(cur[2] as string)
        }, BigNumber(0)).toString(),
        showMsg: false,
      });
    }, [curToken, tickerPrice]);


    const handleOpen = (type: string) => {
      setLongStopPriceInputType("normal");
      setShortStopPriceInputType("normal");
      if (showStopOrder) {
        //判断止盈止损价格是否超出
        let longFlag = false,
          shortFlag = false;
        if (type === "long") {
          longFlag =
            !!longStopPrice &&
            !!price &&
            (+longStopPrice > +price * ((curToken?.maxProfitRatio || 0) + 1) ||
              +longStopPrice < +price);

          shortFlag = !!shortStopPrice && !!price && +shortStopPrice > +price;
        } else {
          longFlag =
            !!longStopPrice &&
            !!price &&
            (+longStopPrice < +price / ((curToken?.maxProfitRatio || 0) + 1) ||
              +longStopPrice > +price);

          shortFlag = !!shortStopPrice && !!price && +shortStopPrice < +price;
        }

        setLongStopPriceInputType(longFlag ? "warn" : "normal");
        setShortStopPriceInputType(shortFlag ? "warn" : "normal");

        if (longFlag || shortFlag) {
          return;
        }
      }
      let _amount = amount;
      if (curCurrency === "USD") {
        const decimal = getExponent(
          Number(curToken?.perpConfig?.contractSize) || 1
        );
        _amount = filterPrecision(+amount / +price, decimal);
      }

      const tradeFee = filterPrecision(
        BigNumber(_amount).multipliedBy(0.0008).multipliedBy(price).toString(),
        curToken?.displayDecimal
      );

      const priceImpactFee = BigNumber(BigNumber(margin).multipliedBy(leverage) || '0')
        .exponentiatedBy(2)
        .div(
          BigNumber(priceImpactK)
            // .multipliedBy(1 / 100)
            .multipliedBy(type === 'long' ? sellPriceImpactDepth : buyPriceImpactDepth),
        )
        .multipliedBy(1)
        .toString();

      const params = {
        symbolName,
        price,
        margin,
        amount: _amount,
        longStopPrice,
        shortStopPrice,
        futureType: type,
        orderType: activeOrderTab,
        slippage,
        tradeFee,
        impactFee: priceImpactFee,
        fees: BigNumber(tradeFee).plus(priceImpactFee).toString(),
      };
      console.log("handleOpen", params);
      setConfirmedParams(params);
      const show = localStorage.getItem("showAgain_open");

      if (!show || show === "true") {
        setVisible(true);
      } else {
        submitTx(params, type, tickerPrice.currentTickerPrice);
      }
    };

    return (
      <>
        <Price
          displayDecimal={curToken?.displayDecimal}
          symbolName={symbolName}
          price={price}
          setPrice={setPrice}
          activeOrderTab={activeOrderTab}
        />
        <MarginAmount>
          <StyledLayout>
            <div className="title">
              Margin
              <div className="unit">USD</div>
            </div>
            <Input
              type={
                (margin && BigNumber(margin).gt(fundsAvailable)) || +margin < 0
                  ? "warn"
                  : "normal"
              }
              placeholder="input margin"
              value={margin}
              onBlur={() => {
                setMargin(
                  margin ? filterPrecision(margin, curToken?.displayDecimal) : ""
                );
              }}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                const value = e?.currentTarget.value;

                if (value && verifyValidNumber(value, curToken?.displayDecimal)) {
                  return;
                }

                setMargin(value);
                setIsInput(false);
              }}
            />
          </StyledLayout>
          <StyledLayout>
            <div className="title">
              Amount
              <StyledCurrencySelect
                curCurrency={curCurrency}
                list={["USD", symbolName]}
                handleClick={(item: string) => {
                  setCurCurrency(item);
                }}
              />
            </div>
            <Input
              onBlur={() => {
                setAmount(amount ? filterPrecision(amount, amountDecimal) : "");
              }}
              placeholder="input amount"
              value={inputAmount}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                const value = e?.currentTarget.value;

                if (value && verifyValidNumber(value, amountDecimal)) return;
                setIsInput(true);
                setAmount(value);
              }}
            />
          </StyledLayout>
        </MarginAmount>
        <Slider
          onChange={(value) => {
            setMargin(
              filterPrecision(
                BigNumber(value).multipliedBy(fundsAvailable).div(100).toString(),
                curToken?.displayDecimal
              )
            );
            setIsInput(false);
          }}
          per={marginPercent || 0}
          marks={[
            {
              label: "",
              value: 0,
            },
            {
              label: "",
              value: 25,
            },
            {
              label: "",
              value: 50,
            },

            {
              label: "",
              value: 75,
            },
            {
              label: "",
              value: 100,
            },
          ]}
          min={0}
          max={100}
          step={25}
          unit="%"
        />
        <Data>
          <DataItem className="item">
            <p className="label">Funds Available</p>
            <p className="value">{filterThousands(fundsAvailable, 2)} USD</p>
          </DataItem>
          <DataItem className="item">
            <p className="label">Max Long</p>
            <p className="value">
              {" "}
              {longAvailableTokenForFutureResults
                ? filterThousands(longAvailableTokenForFutureResults, 2)
                : ""}
              USD
            </p>
          </DataItem>
          <DataItem className="item">
            <p className="label">Max Short</p>
            <p className="value">
              {" "}
              {shortAvailableTokenForFutureResults
                ? filterThousands(shortAvailableTokenForFutureResults, 2)
                : ""}
              USD
            </p>
          </DataItem>
        </Data>
        <StopOrder>
          <div className="title_area">
            <p className="title_text">Stop Order</p>
            <CheckBox handleClick={() => setShowStopOrder(!showStopOrder)} />
          </div>
          {showStopOrder && (
            <div className="input_area">
              <div className="item">
                <Input
                  type={longStopPriceInputType}
                  value={longStopPrice}
                  onChange={(e: React.FormEvent<HTMLInputElement>) => {
                    const value = e?.currentTarget.value;

                    if (
                      value &&
                      verifyValidNumber(value, curToken?.displayDecimal)
                    )
                      return;

                    setLongStopPrice(value);
                  }}
                  placeholder="TP Trigger Price"
                />
                <div className="pnl">
                  Est.pnl:<span className="long">{longPnl}USD</span>
                </div>
              </div>
              <div className="item">
                <Input
                  type={shortStopPriceInputType}
                  value={shortStopPrice}
                  onChange={(e: React.FormEvent<HTMLInputElement>) => {
                    const value = e?.currentTarget.value;

                    if (
                      value &&
                      verifyValidNumber(value, curToken?.displayDecimal)
                    )
                      return;
                    setShortStopPrice(value);
                  }}
                  placeholder="SL Trigger Price"
                />
                <div className="pnl">
                  Est.pnl:<span className="short">{shortPnl}USD</span>
                </div>
              </div>
            </div>
          )}
        </StopOrder>

        <DataItem className="item">
          <p className="label">Slippage tolerance</p>

          <div className="slippage">
            <input
              onBlur={() => {
                localStorage.setItem("slippage", slippage);
              }}
              value={slippage}
              className="input"
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                const value = e?.currentTarget.value;

                if (value && verifyValidNumber(value, 2)) return;

                if (+value / 100 > (curToken?.maxLeverage as number)) {
                  setSlippage((curToken?.maxLeverage as number) * 100 + "");
                  return;
                }
                setSlippage(value);
              }}
            />
            %
          </div>
        </DataItem>
        <Fee>
          <p className="label">
            Fee
            <div className="content">
              <DataItem className="item upgrade_item">
                <p className="label">VIP Level:Tier</p>
                <p className="value upgrade">upgrade</p>
              </DataItem>
              <DataItem className="item">
                <p className="label">Fee discount</p>
                <p className="value">20%</p>
              </DataItem>
            </div>
          </p>
          <p className="value">0.08%</p>
        </Fee>
        {price && margin && leverage && BigNumber(currencyAmount).gt(10) ? (
          <Btns
            handleClick={handleOpen}
            longBtnText="LONG"
            shortBtnText="SHORT"
            showIcon={true}
          />
        ) : (
          <DefaultBtn>
            {price && margin && leverage && !BigNumber(currencyAmount).gt(10)
              ? "Amount should over 10 USD"
              : "Please enter the price"}
          </DefaultBtn>
        )}
        <Modal
          height={500}
          onClose={onClose}
          visible={visible}
          title="Open Position"
          onConfirm={onConfirm}
          onCancel={onCancel}
        >
          {confirmedParams && (
            <OrderConfirm params={confirmedParams} actionType="open" />
          )}
        </Modal>
      </>
    );
  };
export default OpenOrder;
