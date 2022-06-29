import sample from "lodash/sample";

export const LS_KEY_CONNECTED_CONNECTOR = "connected-connector";

export const RPC_URLS: {
  [key: string]: string[];
} = {
  "97": [
    "https://bsc-dataseed.binance.org",
    "https://bsc-dataseed1.defibit.io",
    "https://bsc-dataseed1.ninicoin.io",
  ],
  "137": [
    "https://polygon-rpc.com/"
  ],
};

export const CHAIN_ID = 137;

export enum BscChainId {
  "MAINNET" = 137,
  "TESTNET" = 97,
}

export const RPC_URL = sample(RPC_URLS[CHAIN_ID]) as string;

export const BASE_BSC_SCAN_URLS = {
  "137": "https://polygonscan.com",
  "97": "https://testnet.bscscan.com",
};

export const BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URLS[CHAIN_ID];
