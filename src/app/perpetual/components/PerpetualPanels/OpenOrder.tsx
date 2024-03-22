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
import { useAppConfig } from "@/app/hooks/useAppConfig";
import useTickerPrice from "@/app/hooks/useTickerPrice";
import { useExecutionFee } from "@/app/hooks/useExecutionFee";
import { useContractParams } from "@/app/hooks/useContractParams";
import { usePriceImpactK } from "../../hooks/usePriceImpactK";
import { usePriceImpactDepth } from "../../hooks/usePriceImpactDepth";
import { useSendTxByDelegate } from "@/app/hooks/useSendTxByDelegate";
import { BasicTradingFeeRatio, FutureType } from "@/app/config/common";
import { encodeTx } from "@/app/lib/txTools";
import { formatNumber } from "@/app/lib/common";
import { ethers } from "ethers";
import dayjs from "dayjs";

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


// 合约执行方法名称
const MakeOrderFunctionName = {
  LIMIT: 'makeIncreaseLimitOrder',
  MARKET: 'makeIncreaseMarketOrder',
  STOP: 'makeFutureStopOrder',
}

const OpenOrder: React.FC<{
  activeOrderTab: string;
  margin: string;
  setMargin: Function;
  symbolName: string;
  leverage: string;
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

  const [confirmedParams, setConfirmedParams] = useState<
    ParamsProps | undefined
  >();
  const [longStopPriceInputType, setLongStopPriceInputType] =
    useState("normal");
  const [shortStopPriceInputType, setShortStopPriceInputType] =
    useState("normal");

  const [showStopOrder, setShowStopOrder] = useState<boolean>(false);
  const [longStopPrice, setLongStopPrice] = useState<string>("");
  const [shortStopPrice, setShortStopPrice] = useState<string>("");

  const { currentTokenAvailableLiq } = useRecoilValue(recoilOpenInterests);

  const [slippage, setSlippage] = useState(
    localStorage.getItem("slippage") ?? "0.5"
  );

  const [visible, setVisible] = useState(false);


  const exchangeBalance = useExchangeBalance();
  const appConfig = useAppConfig();
  const tickerPrice = useTickerPrice();
  const executionFee = useExecutionFee();

  const priceImpactK = usePriceImpactK(curToken.symbolName);
  const { sendByDelegate } = useSendTxByDelegate();

  //usePriceImpactDepth
  const { buyPriceImpactDepth, sellPriceImpactDepth } = usePriceImpactDepth();



  const MarketOrderContractParams = useContractParams(appConfig.contract_address.MarketOrderImplementationAddress);
  const LimitOrderContractParams = useContractParams(appConfig.contract_address.LimitOrderImplementationAddress);
  const StopOrderContractParams = useContractParams(appConfig.contract_address.StopOrderImplementationAddress);


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
    
      // 是否是市价单
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
      // 根据单的类型确定合约地址
      const contractAddress = isMarket ? MarketOrderContractParams.address : LimitOrderContractParams.address;
      return [
        contractAddress, 
        false, // allowfailure 此处应该是false， 及不允许失败
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

    }, []);


    // 发起交易
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
    }, [curToken]);




  const onClose = () => {
    setVisible(false);
  };
  const onConfirm = () => {
    submitTx(confirmedParams, confirmedParams?.futureType as string, tickerPrice.currentTickerPrice);
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


  const fundsAvailable = exchangeBalance["USDX"]?.balanceReadable || "0";
  const [isInput, setIsInput] = useState(false);
  const [isMarginInput, setIsMarginInput] = useState(false);

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
          margin && leverage
            ? filterPrecision(
                BigNumber(margin).multipliedBy(leverage).toString(),
                amountDecimal
              )
            : ""
        );
      } else {
        setAmount(
          margin && price && leverage
            ? filterPrecision(
                BigNumber(margin)
                  .multipliedBy(leverage)
                  .dividedBy(price)
                  .toString(),
                amountDecimal
              )
            : ""
        );
      }
    }
  }, [margin, leverage, curCurrency, price, isInput, curToken, amountDecimal]);

  useEffect(() => {
    !isMarginInput &&
      curToken?.displayDecimal &&
      marginPercent &&
      setMargin(
        filterPrecision(
          BigNumber(marginPercent).multipliedBy(fundsAvailable).toString(),
          curToken?.displayDecimal
        )
      );
  }, [marginPercent, curToken, isMarginInput]);

  useEffect(() => {
    setInputAmount(amount);
  }, [amount, amountDecimal]);

  useEffect(() => {
    if (isInput) {
      if (curCurrency === "USD") {
        setMargin(
          filterPrecision(
            BigNumber(amount).dividedBy(leverage).toString(),
            curToken?.displayDecimal
          ) || ""
        );
      } else {
        setMargin(
          filterPrecision(
            BigNumber(amount)
              .multipliedBy(price)
              .dividedBy(leverage)
              .toString(),

            curToken?.displayDecimal
          ) || ""
        );
      }
    }
  }, [inputAmount, isInput, curCurrency, price]);


  const currencyAmount = useMemo(() => {
    let _amount = amount;
    if (curCurrency !== "USD") {
      _amount = BigNumber(amount).multipliedBy(price).toString();
    }

    return _amount;
  }, [amount, curCurrency, curToken]);

  const handleOpen = (type: string) => {
    setLongStopPriceInputType("normal");
    setShortStopPriceInputType("normal");
    if (showStopOrder) {
      //判断止盈止损价格是否超出
      let longFlag = false,
        shortFlag = false;
      if (type === "long") {
        const maxProfitPrice = BigNumber(price).multipliedBy(
          (curToken?.maxProfitRatio || 0) + 1
        );
        longFlag =
          !!longStopPrice &&
          !!price &&
          (BigNumber(longStopPrice).gt(maxProfitPrice) ||
            BigNumber(longStopPrice).lt(price));

        shortFlag =
          !!shortStopPrice && !!price && BigNumber(shortStopPrice).gt(price);
      } else {
        const maxProfitPrice = BigNumber(price).dividedBy(
          (curToken?.maxProfitRatio || 0) + 1
        );

        longFlag =
          !!longStopPrice &&
          !!price &&
          (BigNumber(longStopPrice).lt(maxProfitPrice) ||
            BigNumber(longStopPrice).gt(price));

        shortFlag =
          !!shortStopPrice && !!price && BigNumber(shortStopPrice).lt(price);
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
      _amount = filterPrecision(
        BigNumber(amount).dividedBy(price).toString(),
        decimal
      );
    }

    const tradeFee = filterPrecision(
      BigNumber(_amount).multipliedBy(curToken?.tradingFeeRatio || BasicTradingFeeRatio).div(100).multipliedBy(price).toString(),
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
      fees: BigNumber(tradeFee).plus(priceImpactFee).toString() ,
    };
    console.log("handleOpen", params);
    setConfirmedParams(params);
    const show = localStorage.getItem("showAgain_open");

    if (!show || show === "true") {
      setVisible(true);
    } else{
      // 如果不弹窗，则直接发起交易
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
              setMarginPercent(0);
              setIsInput(false);
              setIsMarginInput(true);
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
          setIsMarginInput(false);
          setMarginPercent(BigNumber(value).dividedBy(100).toNumber());

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