import dayjs, { Dayjs } from "dayjs";
import UTC from "dayjs/plugin/utc";
import BigNumber from "bignumber.js";

/**
 * 数字精度 -> decimalPlaces[does not retain trailing zeros]
 * @param value
 * @param decimal
 * @returns
 */
export const filterPrecision = (
  value: string | number | undefined,
  decimal = 4,
  round: any = BigNumber.ROUND_DOWN
) => {
  if (!value || BigNumber(value).isNaN()) return "-";
  const result = new BigNumber(value).toFixed(decimal, round).toString();
  return result;
};
//size 精度转换
export function getExponent(num: number) {
  if (num >= 1) return 0;
  // 将数字转换为指数形式
  let expString = num.toExponential();
  // 提取出指数部分
  let exp = expString.split("-")[1];
  return Number(exp);
}

/**
 * 非负数校验
 * @param value
 * @param decimal
 * @returns
 */
export const verifyValidNumber = (value: string, decimal = 4) => {
  const regexp =
    decimal === 0
      ? "(^(0|[1-9]\\d*)$)"
      : `(^(0|([1-9]\\d*))(\\.\\d{0,${decimal}})?$)`;
  return !new RegExp(regexp).test(value);
};
/**
 * 数字千位分割
 * @param value
 * @param decimal
 * @param isCutZero
 * @returns
 */
export const filterThousands = (
  value: string | number,
  decimal = 4,
  options: {
    isCutZero?: boolean;
    round?: any;
    k?: number;
  } = {
    isCutZero: false,
    round: BigNumber.ROUND_DOWN,
    k: 1,
  }
) => {
  const { isCutZero = false, round = BigNumber.ROUND_DOWN, k = 1 } = options;

  if (new BigNumber(value).isNaN()) return `${value}`;
  if (isCutZero)
    return new BigNumber(value)
      .multipliedBy(k)
      .decimalPlaces(decimal, round)
      .toFormat();
  const result = new BigNumber(
    filterPrecision(BigNumber(value).multipliedBy(k).toString(), decimal)
  ).toFormat(decimal, round);
  return +result === 0 ? "0" : result;
};

export const uniqArrWithObjParams = (arr: any[], key: any) => {
  return arr.reduce((prev: any[], cur: any) => {
    let ids = prev.map((obj) => obj[key]);
    if (!ids.includes(cur[key])) {
      return [...prev, cur];
    } else {
      return prev;
    }
  }, []);
};
