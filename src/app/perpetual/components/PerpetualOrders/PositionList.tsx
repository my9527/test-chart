import { Col } from "@/app/components/Col";
import { Row } from "@/app/components/Row";
import { TokenById } from "@/app/components/Token";
import { useIndexPricesById } from "@/app/hooks/useIndexPrices";
import { useTokenByFutureId } from "@/app/hooks/useTokens";
import { PositionType, recoilPositions } from "@/app/models";
import { filterPrecision } from "@/app/utils/tools";
import BigNumber from "bignumber.js";
import { ThHTMLAttributes, useMemo, useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { getLiqPrice } from "../../lib/getLiqPrice";
import { useFundingFeeByAddressSide } from "../../hooks/useFundingFees";
import { FutureType } from "@/app/config/common";
import { useBorrowingFeeByAddressSide } from "../../hooks/useBorrowingFees";
import { calcPnl, calcPnlPercentage } from "../../lib/getPnl";
import ClosePosition from "./ClosePosition";
import AdjustMargin from "./AdjustMargin";

const Wrapper = styled(Row)`
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
  .table-wrapper {
    height: 100%;
  }
  table {
    border-spacing: 0;
    width: 100%;
    height: 100%;
    position: relative;
    thead {
      width: 100%;
      background: ${(props) => props.theme.colors.fill1};

      position: sticky;
      top: 0;
      th {
        padding: 9px 8px 16px;
      }
    }
    tr {
      cursor: pointer;
    }
    tbody tr:hover {
      background: ${(props) => props.theme.colors.fill2};
    }
    td {
      // width: 140px;
      color: var(--white, #fafafa);
      font-family: Arial;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 100%; /* 14px */
      padding: 16px 8px;
      border-top: 0.5px solid ${(props) => props.theme.colors.border1};
      border-bottom: 0.5px solid ${(props) => props.theme.colors.border1};
      border-collapse: collapse;
      text-align: left;
    }
    // td + td {
    //     padding-left: 40px;
    //     padding-right: 40px;
    // }
  }

  .header {
    color: ${(props) => props.theme.colors.text4};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%; /* 14px */
  }
`;

const TableWrapper = styled.div`
  height: 100%;
  width: 100%;
`;

type HeaderItem = {
  title: string;
  key: string;
  // ThHTMLAttributes<HTMLTableHeaderCellElement>.align
  // align: .align;
} & ThHTMLAttributes<HTMLTableHeaderCellElement>;

const Headers: HeaderItem[] = [
  {
    title: "Symbol",
    key: "symbol",
    align: "left",
  },
  {
    title: "Size",
    key: "size",
  },
  {
    title: "Mark Price",
    key: "marketPrice",
  },
  {
    title: "Entry Price",
    key: "entryPrice",
  },
  {
    title: "Unreallzed PnL(%)",
    key: "pnl",
  },
  {
    title: "Margin",
    key: "collotral",
  },
  {
    title: "Est.liq.Price",
    key: "liqPrice",
  },
  {
    title: "TP/SL",
    key: "tpsl",
  },
  {
    title: "Action",
    key: "action",
  },
];

const PositionTdAttrs: ThHTMLAttributes<HTMLTableDataCellElement> = {
  align: "center",
};

const PositionItemWrapper = styled.tr`
  .symbol-name {
    border-left: 4px solid;
    padding: 0 10px;
  }
  .long-pos {
    border-left-color: ${(props) => props.theme.colors.text2};
    .pos-dir {
      color: ${(props) => props.theme.colors.text2};
    }
  }
  .short-pos {
    border-left-color: ${(props) => props.theme.colors.text5};
    .pos-dir {
      color: ${(props) => props.theme.colors.text5};
    }
  }
  .pos-dir {
    /* small */
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.small};
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 14.4px */
  }

  .pos-long {
    color: ${(props) => props.theme.colors.text2};
  }
  .pos-short {
    color: ${(props) => props.theme.colors.text5};
  }

  .pnl-col {
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%; /* 14px */
  }

  .pnl-profit {
    color: ${(props) => props.theme.colors.text2};
  }
  .pnl-loss {
    color: ${(props) => props.theme.colors.text5};
  }

  .margin-col {
    color: ${(props) => props.theme.colors.text3};
    font-family: Arial;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-style: normal;
    font-weight: 400;
    line-height: 100%; /* 14px */
  }
  .button_wrapper {
    display: inline-block;
    .content {
      border-radius: 999px;
      border: ${(props) => `1px solid ${props.theme.colors.border1}`};
      background: ${(props) => props.theme.colors.fill2};
      font-size: ${(props) => props.theme.fontSize.medium};
      font-style: normal;
      font-weight: 400;
      line-height: 100%;
      display: flex;
      align-items: center;
      cursor: pointer;
    }
  }
  .button {
    .content {
      color: ${(props) => props.theme.colors.text1};
      font-family: Arial;
      gap: 10px;
      padding: 6px 18px;
      height: 32px;
      box-sizing: border-box;
      .plus {
        font-size: 20px;
        color: ${(props) => props.theme.colors.text4};
      }
      &:active {
        border: ${(props) => `1px solid ${props.theme.colors.primary1}`};
        background: ${(props) => props.theme.colors.border1};
        color: ${(props) => props.theme.colors.primary1};
        .plus {
          color: ${(props) => props.theme.colors.primary1};
        }
      }
    }
  }
  .action_buttons {
    .button {
      height: 30px;

      padding: 9px 23px;
      display: flex;
      align-items: center;
      border: ${(props) => `1px solid transparent`};
      &:active {
        border-radius: 999px;
        border: ${(props) => `1px solid ${props.theme.colors.primary1}`};
        background: ${(props) => props.theme.colors.border1};
        color: ${(props) => props.theme.colors.primary1};
      }
    }
  }
`;

const Position: FCC<{
  pos: PositionType;
  handleShowAdujustMargin: Function;
  handleClose: Function;
}> = ({ pos, handleShowAdujustMargin, handleClose }) => {
  const token = useTokenByFutureId(pos.futureId);

  const indexPrices = useIndexPricesById(pos.futureId);

  const fundingFee = useFundingFeeByAddressSide(
    token.address as string,
    pos.isLong ? FutureType.LONG : FutureType.SHORT
  );

  const borrowingFee = useBorrowingFeeByAddressSide(
    token.address as string,
    pos.isLong ? FutureType.LONG : FutureType.SHORT
  );

  // const fundingFee =

  const fundingfeeReadable = BigNumber(pos.tokenSize)
    .multipliedBy(
      BigNumber((fundingFee?.fee || "0") / 1e6).minus(
        pos.entryFundingFeePerTokenReadable
      )
    )
    .plus(pos.cumulativeFundingFeeReadable)
    .multipliedBy(-1)
    .toString();
  // tokensize*（BorrowingFeePerToken-entryBorrowingFeePerToken）+ cumulativeBorrowingFee
  const borrowingfeeReadable = BigNumber(pos.tokenSize)
    .multipliedBy(
      BigNumber((borrowingFee?.fee || "0") / 1e6).minus(
        pos.entryBorrowingFeePerTokenReadable
      )
    )
    .plus(pos.cumulativeBorrowingFeeReadable)
    .multipliedBy(-1)
    .toString();

  const openingfeeReadable = BigNumber(pos.cumulativeTeamFeeReadable)
    .multipliedBy(-1)
    .toString();

  const feesReadable = BigNumber(fundingfeeReadable)
    .plus(borrowingfeeReadable)
    .plus(openingfeeReadable)
    .toString();

  const liqPrice = useMemo(() => {
    // console.log("liqPrice", pos.collateral, feesReadable, pos.entryPriceReadable, pos.tokenSize, pos.isLong, token)
    const _liqPrice = getLiqPrice({
      collateral: pos.collateralReadable,
      fees: feesReadable,
      entryPrice: pos.entryPriceReadable,
      size: pos.tokenSize,
      isLong: pos.isLong,
      token: token,
    });
    return filterPrecision(
      _liqPrice,
      token.displayDecimal,
      pos?.isLong ? BigNumber.ROUND_CEIL : BigNumber.ROUND_DOWN
    );
  }, [
    feesReadable,
    pos.collateral,
    pos.entryPriceReadable,
    pos.tokenSize,
    pos.isLong,
    token,
  ]);

  const tickPrice = useIndexPricesById(pos.futureId);

  const pnl = useMemo(() => {
    return calcPnl({
      isLong: pos.isLong,
      entryPrice: pos.entryPriceReadable,
      tickPrice: tickPrice?.price,
      size: pos.tokenSize,
      pars: token.pars,
    });
  }, [
    pos.entryPriceReadable,
    pos.tokenSize,
    tickPrice?.price,
    pos.isLong,
    token.pars,
  ]);

  const pnlPercent = useMemo(() => {
    return calcPnlPercentage({ pnl, collateral: pos.collateralReadable });
  }, [pnl, pos.collateralReadable]);

  const hasProfit = useMemo(() => {
    return BigNumber(pnl).lt(0) ? false : true;
  }, [pnl]);
  const markPrice = useMemo(() => {
    return filterPrecision(indexPrices?.price, token.displayDecimal);
  }, [indexPrices?.price, token.displayDecimal]);
  return (
    <PositionItemWrapper>
      <td align="left" width={140}>
        <Col
          gap="6px"
          align="start"
          className={`symbol-name ${pos.isLong ? "long-pos" : "short-pos"}`}
        >
          <div>
            <TokenById futureId={pos.futureId} />
          </div>
          <div className={`pos-dir`}>{pos.isLong ? "Long" : "Short"}</div>
        </Col>
      </td>
      <td {...PositionTdAttrs} width={140}>
        <div className={`pos-dir ${pos.isLong ? "pos-long" : "pos-short"}`}>
          {pos.tokenSize}
        </div>
      </td>
      <td {...PositionTdAttrs} width={140}>
        {markPrice}
      </td>
      <td {...PositionTdAttrs} width={140}>
        {filterPrecision(pos.entryPriceReadable, token.displayDecimal)}
      </td>
      <td {...PositionTdAttrs} width={200}>
        <Col
          gap="6px"
          className={hasProfit ? "pnl-profit" : "pnl-loss"}
          align="flex-start"
        >
          <div>${filterPrecision(pnl, 2)}</div>
          <div>({pnlPercent}%)</div>
        </Col>
      </td>
      <td {...PositionTdAttrs} width={140}>
        <div className="margin-col">
          ${filterPrecision(pos.collateralReadable, 2)}
        </div>
      </td>
      <td {...PositionTdAttrs} width={140}>
        {liqPrice}
      </td>
      <td {...PositionTdAttrs} width={140}>
        <div
          className="button button_wrapper"
          onClick={() =>
            handleShowAdujustMargin({
              ...pos,
              liqPrice,
              pnl,
              feesReadable,
              markPrice,
            })
          }
        >
          <div className="content">
            <p className="plus">+</p>
            <p>Add</p>
          </div>
        </div>
      </td>
      <td {...PositionTdAttrs}>
        <div className="button_wrapper action_buttons">
          <div className="content">
            <div className="button" onClick={() => handleClose(pos)}>
              close
            </div>
            <div className="button">share</div>
          </div>
        </div>
      </td>
    </PositionItemWrapper>
  );
};

export const PositionList = () => {
  const _openPositions = useRecoilValue(recoilPositions);
  const [showAdujustMargin, setShowAdujustMargin] = useState(false);
  const [activePosition, setActivePosition] = useState({});
  const [showClosePosition, setShowClosePosition] = useState(false);

  // sort by futureId asc
  const openPositions = useMemo(() => {
    if (!_openPositions.length) return [];
    return [..._openPositions].sort((a: any, b: any) =>
      BigNumber(b.futureId).minus(a.futureId).toNumber()
    );
  }, [_openPositions]);

  const handleShowAdujustMargin = (ele: PositionType) => {
    console.log("ele", ele);
    setShowAdujustMargin(true);
    setActivePosition(ele);
  };
  const handleClose = (ele: PositionType) => {
    setShowClosePosition(true);
    setActivePosition(ele);
  };
  return (
    <Wrapper>
      <TableWrapper>
        <table>
          <thead>
            <tr>
              {Headers.map((h) => {
                return (
                  <th
                    key={h.key}
                    align={h.align ?? "left"}
                    className="thead-td"
                  >
                    <div className="header">{h.title}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {openPositions.map((pos: any) => {
              return (
                <Position
                  key={pos.id}
                  pos={pos}
                  handleShowAdujustMargin={handleShowAdujustMargin}
                  handleClose={handleClose}
                />
              );
            })}
          </tbody>
        </table>
      </TableWrapper>
      <AdjustMargin
        visible={showAdujustMargin}
        setVisible={setShowAdujustMargin}
        params={activePosition}
      />
      <ClosePosition
        visible={showClosePosition}
        setVisible={setShowClosePosition}
        params={activePosition}
        // params={{
        //   amount: "10",
        //   symbolName: "ARB",
        //   price: "233.34",
        //   margin: "66",
        //   futureType: "long",
        //   fees: "233",
        //   tradeFee: "2323",
        //   impactFee: "2323",
        // }}
      />
    </Wrapper>
  );
};
