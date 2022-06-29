import sample from 'lodash/sample';

export enum BscChainId {
  'MAINNET' = 137,
  'TESTNET' = 97,
}

export const CHAIN_ID: BscChainId = process.env.REACT_APP_CHAIN_ID
  ? parseInt(process.env.REACT_APP_CHAIN_ID, 10)
  : BscChainId.MAINNET;

export const isOnTestnet = CHAIN_ID === BscChainId.TESTNET;

const BASE_BSC_SCAN_URLS = {
  [BscChainId.MAINNET]: 'https://polygonscan.com',
  [BscChainId.TESTNET]: 'https://testnet.bscscan.com',
};

const API_ENDPOINT_URLS = {
  [BscChainId.MAINNET]: 'https://api-opendao.opendao.io/api',
  [BscChainId.TESTNET]: 'https://testnetapi.venus.io/api',
};

export const RPC_URLS: {
  [key: string]: string[];
} = {
  [BscChainId.MAINNET]: [
    'https://matic-mainnet.chainstacklabs.com',
    // 'https://bsc-dataseed1.defibit.io',
    // 'https://bsc-dataseed.binance.org',
  ],
  [BscChainId.TESTNET]: [
    'https://data-seed-prebsc-1-s1.binance.org:8545',
    'https://data-seed-prebsc-2-s1.binance.org:8545',
    'https://data-seed-prebsc-1-s2.binance.org:8545',
  ],
};

export const RPC_URL = sample(RPC_URLS[CHAIN_ID]) as string;

export const BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URLS[CHAIN_ID];

export const API_ENDPOINT_URL = API_ENDPOINT_URLS[CHAIN_ID];

export const LS_KEY_CONNECTED_CONNECTOR = 'connected-connector';

export const VTOKEN_DECIMALS = 8;

// Note: this is a temporary fix. Once we start refactoring this part we should
// probably fetch the treasury address using the Comptroller contract
const TREASURY_ADDRESSES = {
  137: '0xa2a1343d9981b2be9cce36dc0DdB479cBB298636',
  // When querying comptroller.treasuryAddress() we get an empty address back,
  // so for now I've let it as it is
  97: '0x0000000000000000000000000000000000000000',
};

const COMP_LENS_ADDRESSES = {
  137: '0x845b54041765A66941d426b9E4bE56003BCF005b',
  // When querying comptroller.treasuryAddress() we get an empty address back,
  // so for now I've let it as it is
  97: '0x0000000000000000000000000000000000000000',
};

export const TREASURY_ADDRESS = TREASURY_ADDRESSES[CHAIN_ID];
export const COMP_LENS_ADDRESS = COMP_LENS_ADDRESSES[CHAIN_ID];


export const BSCSCAN_FNR_CONTRACT_ADDRESS = '0xA919C7eDeAb294DD15939c443BCacA1FA1a1850f';
export const VENUS_MEDIUM_URL = 'https://docs.fenrirfinance.com/';
export const VENUS_DISCORD_URL = 'https://discord.com/invite/HUwVQQ8e9N';
export const VENUS_TWITTER_URL = 'https://twitter.com/FenrirFi';
export const FNR_GITHUB_URL = 'https://github.com/FenrirFi';
export const FNR_GITBOOK_URL = 'https://docs.fenrirfinance.com';

// TODO: update
export const VENUS_TERMS_OF_SERVICE_URL = 'https://www.swipe.io/terms';

export const SAFE_BORROW_LIMIT_PERCENTAGE = 80;
export const DEFAULT_GAS_PRICE = 35
