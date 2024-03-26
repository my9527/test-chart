"use client";
import styled from "styled-components";
import Tabs from "../Tabs";
import { tabProps } from "../Tabs";
import { useState, useMemo } from "react";
import Modal from "@/app/components/Modal";
import TokenImage from "@/app/components/TokenImage";
import { useTokenByFutureId } from "@/app/hooks/useTokens";
import BigNumber from "bignumber.js";
import Input from "@/app/components/Input";
import { filterPrecision } from "@/app/utils/tools";
import { verifyValidNumber } from "@/app/utils/tools";
import Slider from "../Slider";
import { useEffect } from "react";
import { getLiqPrice } from "@/app/perpetual/lib/getLiqPrice";
import { recoilOpenInterests } from "@/app/models";
import { useRecoilValue } from "recoil";
import { useExchangeBalance } from "@/app/hooks/useBalance";
import { PositionType } from "@/app/models";
import { getLeverage } from "../../lib/getLeverage";
import { useIndexPricesById } from "@/app/hooks/useIndexPrices";
import { getMaxProfitPrice } from "../../lib/getMaxProfitPrice";
import { DefaultRemainCollateralRatio, FutureType } from "@/app/config/common";
import { ethers } from "ethers";
import { useContractParams } from "@/app/hooks/useContractParams";
import { useAppConfig } from "@/app/hooks/useAppConfig";
import { encodeTx } from "@/app/lib/txTools";
import { useSendTxByDelegate } from "@/app/hooks/useSendTxByDelegate";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const TypeTabs = styled(Tabs)`
  padding: 10px 0 10px 0;
  .tab {
    padding: 0px;
  }
`;
const Symbol = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  .symbol_name {
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.header2};
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
  }
  .future_type {
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.small};
    font-style: normal;
    font-weight: 400;
    line-height: 120%;
  }
  .future_type_long {
    color: ${(props) => props.theme.colors.text2};
  }
  .future_type_short {
    color: ${(props) => props.theme.colors.text5};
  }
  img {
    border-radius: 50%;
  }
`;
const OrderInfo = styled.div`
  border-radius: 8px;
  background: ${(props) => props.theme.colors.fill3};
  padding: 11px 13px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    .label {
      color: ${(props) => props.theme.colors.text4};
    }
    .value {
      color: ${(props) => props.theme.colors.text1};
    }
    .liqPrice {
      color: ${(props) => props.theme.colors.primary1};
    }
  }
`;
const Layout = styled.div`
  .title {
    color: ${(props) => props.theme.colors.text1};
    font-family: Arial;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
    margin-bottom: 5px;
  }

  .input {
    color: ${(props) => props.theme.colors.text1};
    background: ${(props) => props.theme.colors.fill3} !important;
    border: 1px solid transparent;
  }
`;
const MaxAmount = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: Arial;
  font-size: ${(props) => props.theme.fontSize.min};
  font-style: normal;
  font-weight: 400;
  line-height: 120%; /* 12px */
  .label {
    color: ${(props) => props.theme.colors.text4};
  }
  .value {
    color: ${(props) => props.theme.colors.text1};
  }
`;
const StyledOrderInfo = styled(OrderInfo)`
  margin-top: 20px;
`;
type TypeMap = { [key: string]: string };

export interface ParamsProps extends PositionType {
  liqPrice: string;
  pnl: string;
  feesReadable: string;
}

const AdjustMargin: React.FC<{
  params: ParamsProps;
  visible: boolean;
  setVisible: Function;
}> = ({ params, visible, setVisible }) => {
  const appConfig = useAppConfig();
  const [activeTypeTab, setActiveTypeTab] = useState<string>("add");
  const curToken = useTokenByFutureId(params?.futureId);
  const [margin, setMargin] = useState<string>("");
  const [marginPercent, setMarginPercent] = useState<number>(0);
  const { currentTokenAvailableLiq } = useRecoilValue(recoilOpenInterests);
  const [isMarginInput, setIsMarginInput] = useState(false);
  const balance = useExchangeBalance();
  const UpdateCollateralOrderContractParams = useContractParams(
    appConfig.contract_address.UpdateCollateralOrderImplementationAddress
  );
  const typeTabList = [
    { label: "Add Margin", key: "add" },
    { label: "Reduce Margin", key: "reduce" },
  ];
  const futureTypeMap: TypeMap = { long: "Long", short: "Short" };
  const actionTypeMap: TypeMap = {
    add: "Add margin",
    reduce: "Reduce margin",
  };
  const indexPrices = useIndexPricesById(params?.futureId);
  const markPrice = useMemo(() => {
    return filterPrecision(indexPrices?.price, curToken?.displayDecimal);
  }, [indexPrices?.price, curToken?.displayDecimal]);

  const { sendByDelegate } = useSendTxByDelegate();

  const maxAmount = useMemo(() => {
    if (activeTypeTab === "add") {
      const v =
        Math.max(
          0,
          Math.min(
            BigNumber(
              params?.isLong
                ? currentTokenAvailableLiq?.longReadable
                : currentTokenAvailableLiq?.shortReadable
            )
              .dividedBy(curToken?.maxProfitRatio || 1)
              .toNumber(),
            +balance["USDX"]?.balanceReadable,
            BigNumber(params?.tokenSize)
              .multipliedBy(params?.entryPriceReadable)
              .minus(params?.collateralReadable)
              .minus(0.1)
              .toNumber()
          )
        ) || 0;
      return filterPrecision(v, curToken?.displayDecimal);
    } else {
      const netValue = BigNumber(params?.collateralReadable)
        .plus(params?.pnl)
        .minus(params?.feesReadable)
        .toNumber();

      const minCollaterinPosition = 0.1;
      const predictedliqiodatefeeratio = 0.0008;

      const feeRatio = BigNumber(curToken?.tradingFeeRatio || 0)
        .div(100)
        .plus(curToken?.maintainMarginRatio || DefaultRemainCollateralRatio)
        .toString();

      const minremaincollateral = BigNumber(params?.tokenSize)
        .multipliedBy(markPrice)
        .multipliedBy(
          Math.max(
            BigNumber(2)
              .multipliedBy(
                BigNumber(predictedliqiodatefeeratio).plus(feeRatio)
              )
              .toNumber(),
            BigNumber(1)
              .dividedBy(curToken?.maxLeverage || "5")
              .toNumber()
          )
        )
        .toNumber();
      const max = Math.max(
        0,
        BigNumber(Math.min(netValue, +params?.collateralReadable))
          .minus(
            Math.max(
              minremaincollateral,
              minCollaterinPosition,
              BigNumber(params?.pnl)
                .dividedBy(curToken?.maxProfitRatio || "1")
                .toNumber()
            )
          )
          .minus(0.1)
          .toNumber()
      );
      return filterPrecision(max, curToken?.displayDecimal);
    }
  }, [
    curToken?.maxProfitRatio,
    currentTokenAvailableLiq,
    params?.tokenSize,
    params?.entryPriceReadable,
    balance,
    params?.collateralReadable,
    params?.isLong,
    activeTypeTab,
  ]);

  const origin_leverage = useMemo(() => {
    return getLeverage({
      size: params?.tokenSize,
      price: params?.entryPriceReadable,
      margin: params?.collateralReadable,
      pnl: params?.pnl,
      fees: params?.feesReadable,
    });
  }, [
    params?.tokenSize,
    params?.entryPriceReadable,
    params?.collateralReadable,
    params?.pnl,
    params?.feesReadable,
  ]);

  const liqPriceReadable = useMemo(() => {
    const _margin =
      activeTypeTab === "add"
        ? BigNumber(params?.collateralReadable).plus(margin).toString()
        : BigNumber(params?.collateralReadable).minus(margin).toString();

    return filterPrecision(
      getLiqPrice({
        size: params?.tokenSize,
        token: curToken,
        isLong: params?.isLong,
        collateral: _margin,
        fees: params?.feesReadable,
        entryPrice: params?.entryPriceReadable,
      }),
      curToken?.displayDecimal
    );
  }, [
    params?.tokenSize,
    curToken,
    params?.isLong,
    params?.collateralReadable,
    margin,
    params?.feesReadable,
    params?.entryPriceReadable,
    activeTypeTab,
  ]);

  const origin_maxProfitPrice = useMemo(() => {
    return getMaxProfitPrice({
      margin: params?.collateralReadable,
      maxProfitRatio: curToken?.maxProfitRatio || 1,
      isLong: params?.isLong,
      price: params?.entryPriceReadable,
      size: params?.tokenSize,
      displayDecimal: curToken?.displayDecimal,
    });
  }, [
    curToken?.maxProfitRatio,
    params?.collateralReadable,
    params?.tokenSize,
    params?.entryPriceReadable,
    curToken?.displayDecimal,
    params?.isLong,
  ]);

  const maxProfitPrice = useMemo(() => {
    const _margin =
      activeTypeTab === "add"
        ? BigNumber(params?.collateralReadable).plus(margin).toString()
        : BigNumber(params?.collateralReadable).minus(margin).toString();
    return getMaxProfitPrice({
      margin: _margin,
      maxProfitRatio: curToken?.maxProfitRatio || 1,
      isLong: params?.isLong,
      price: params?.entryPriceReadable,
      size: params?.tokenSize,
      displayDecimal: curToken?.displayDecimal,
    });
  }, [
    curToken?.maxProfitRatio,
    params?.collateralReadable,
    params?.tokenSize,
    params?.entryPriceReadable,
    curToken?.displayDecimal,
    params?.isLong,
    margin,
    activeTypeTab,
  ]);

  useEffect(() => {
    !isMarginInput &&
      curToken?.displayDecimal &&
      maxAmount &&
      setMargin(
        filterPrecision(
          BigNumber(marginPercent).multipliedBy(maxAmount).toString(),
          curToken?.displayDecimal
        )
      );
  }, [marginPercent, curToken, isMarginInput, maxAmount]);

  const leverage = useMemo(() => {
    const _margin =
      activeTypeTab === "add"
        ? BigNumber(params?.collateralReadable).plus(margin).toString()
        : BigNumber(params?.collateralReadable).minus(margin).toString();
    return getLeverage({
      size: params?.tokenSize,
      price: params?.entryPriceReadable,
      margin: _margin,
      pnl: params?.pnl,
      fees: params?.feesReadable,
    });
  }, [
    margin,
    params?.tokenSize,
    params?.entryPriceReadable,
    params?.collateralReadable,
    params?.pnl,
    params?.feesReadable,
    activeTypeTab,
  ]);
  useEffect(() => {
    if (!visible) {
      setMargin("");
      setMarginPercent(0);
      setActiveTypeTab("add");
    }
  }, [visible]);
  const onClose = () => {
    setVisible(false);
  };
  const onConfirm = async () => {
    const _margin = ethers.utils.parseUnits(margin, 6).toString();
    // ele?.futureId,
    // _i,
    // !collateralTabValue,
    // ele?.futureType,

    const _encodedData = encodeTx({
      abi: UpdateCollateralOrderContractParams.abi,
      functionName: "createUpdateCollateralOrder",
      args: [
        params.futureId,
        _margin,
        activeTypeTab === "add",
        params.isLong ? FutureType.LONG : FutureType.SHORT,
      ],
    });

    await sendByDelegate({
      data: [
        [
          UpdateCollateralOrderContractParams.address,
          false,
          appConfig.executionFee,
          _encodedData,
        ],
      ],
      value: appConfig.executionFee,
      showMsg: false,
    });

    setVisible(false);
  };
  const onCancel = () => {
    setVisible(false);
  };

  return (
    <Modal
      height={600}
      onClose={onClose}
      visible={visible}
      title="Adjust Margin"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <Wrapper>
        <TypeTabs
          gap={20}
          list={typeTabList}
          handleClick={(item: tabProps) => {
            setActiveTypeTab(item?.key);
          }}
        />
        <Symbol>
          <TokenImage name={curToken?.symbolName} width={20} height={20} />
          <p className="symbol_name">{curToken?.symbolName}USD</p>
          <p
            className={`future_type future_type_${
              params?.isLong ? "long" : "short"
            }`}
          >
            {futureTypeMap[params?.isLong ? "long" : "short"]}
            &nbsp;
            {origin_leverage}X
          </p>
        </Symbol>
        <OrderInfo>
          <div className="item">
            <p className="label">Liq. price</p>
            <p className="value liqPrice">{params?.liqPrice}</p>
          </div>
          <div className="item">
            <p className="label">Max profit price</p>
            <p className="value">{origin_maxProfitPrice}</p>
          </div>
        </OrderInfo>
        <Layout>
          <p className="title">{actionTypeMap[activeTypeTab]}</p>
          <Input
            type={
              (margin && BigNumber(margin).gt(maxAmount)) ||
              BigNumber(margin).lt(0)
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
              setIsMarginInput(true);
            }}
          />
        </Layout>
        <MaxAmount>
          <p className="label">Max adjustment amount</p>
          <p className="value">{maxAmount || "0"} USD</p>
        </MaxAmount>
        <Slider
          onChange={(value) => {
            setIsMarginInput(false);
            setMarginPercent(BigNumber(value).dividedBy(100).toNumber());
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
        <StyledOrderInfo>
          <div className="item">
            <p className="label">Leverage after adjust</p>
            <p className="value">{leverage}X</p>
          </div>
          <div className="item">
            <p className="label">Liq. price after adjust</p>
            <p className="value">{liqPriceReadable}</p>
          </div>
          <div className="item">
            <p className="label">Max profit price after adjust</p>
            <p className="value">{maxProfitPrice}</p>
          </div>
        </StyledOrderInfo>
      </Wrapper>
    </Modal>
  );
};
export default AdjustMargin;
