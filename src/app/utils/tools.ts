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
  let exp = expString.split('-')[1];
  return Number(exp);
}