
interface AddEthereumChainParameter {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

const polygonRpcs: string[] = [
  'https://rpc-mainnet.matic.network',
  'https://rpc-mainnet.maticvigil.com',
  'https://rpc-mainnet.matic.quiknode.pro',
  'https://matic-mainnet.chainstacklabs.com',
  'https://matic-mainnet-full-rpc.bwarelabs.com',
  'https://matic-mainnet-archive-rpc.bwarelabs.com'
];

const bscRpcs: string[] = [
  'https://bsc-dataseed.binance.org/',
  'https://bsc-dataseed1.defibit.io/'
];

export const params: { [key: string]: AddEthereumChainParameter } = {
  '137': {
    chainId: '0x89',
    chainName: 'Polygon',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: polygonRpcs,
    blockExplorerUrls: ['https://polygonscan.com/'],
  },
  '56': {
    chainId: '0x38',
    chainName: 'BSC',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: bscRpcs,
    blockExplorerUrls: ['https://bscscan.com/'],
  },
}
