import { BigNumber } from "bignumber.js";
import { ethers } from "ethers";

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });

export const toBN = (num: number | string | BigNumber) => {
  return new BigNumber(num.toString());
};

export const toBnFixed = (num: number | string | BigNumber) => {
  return toBN(num).toFixed();
};

export const encodeParameters = (fnABI: string, fnParams: string[]): string => {
  // eslint-disable-next-line
  const regex = /(\w+)\(([\w,\[\]]+)\)/;
  const res = regex.exec(fnABI);
  if (!res) {
    return "0x00";
  }
  const [_, __, fnInputs] = <[string, string, string]>(<unknown>res);
  return ethers.utils.defaultAbiCoder.encode(fnInputs.split(","), fnParams);
};

export const weiToNum = (
  amount: string | number | BigNumber,
  decimals: string | number | BigNumber
): string => {
  const amt = toBN(amount);
  const dec = toBN(decimals);
  const ten = toBN(10);

  const result = amt.div(ten.pow(dec));
  return result.toFixed();
};

export const numToWei = (
  amount: string | number | BigNumber,
  decimals: string | number | BigNumber
): string => {
  const amt = toBN(amount);
  const dec = toBN(decimals);
  const ten = toBN(10);

  const result = amt.times(ten.pow(dec));
  return result.toFixed(0, 1); // rounding mode: Round_down
};

export const truncateAddress = (address: string) => {
  if (address === null || address === undefined) {
    return;
  }
  const start4Digits = address.slice(0, 6);
  const separator = "...";
  const last4Digits = address.slice(-4);
  return (
    start4Digits.padStart(2, "0") +
    separator.padStart(2, "0") +
    last4Digits.padStart(2, "0")
  );
};

export const localeString = (num: any, precision: any) => {
  if (num === null || num === undefined) {
    return;
  }
  num = num.toLocaleString(undefined, { maximumFractionDigits: precision });
  return num;
};

export const toDecimal = (val: any, decimal: any) => {
  if (val === undefined || val === null) {
    return 0;
  }
  val = val.toString();
  val = new BigNumber(val);
  return val.toFixed(decimal);
};

export const getAbsoluteValueWithDecimals = (val: any, decimal: any) => {
  if (val === undefined || val === null) {
    return 0;
  }
  val = val.toString();
  val = new BigNumber(val);
  return val.abs().toFixed(decimal); // Returns absolute value for a big number with decimals
};

export const tokenToDecimals = (amount: number, decimals: number) => {
  const amt = new BigNumber(amount);
  const dec = new BigNumber(decimals);
  const ten = new BigNumber(10);

  const result = amt.times(ten.pow(dec));
  return result.toFixed(0);
};
