import { ethers } from "ethers";
import { createContext, Dispatch } from "react";

export interface ContextType {
  currentAccount: string;
  setCurrentAccount: Dispatch<string>;
  networkString: string;
  setNetworkString: Dispatch<string>;
  // contractAddresses: { [key: string]: any };
  // setContractAddresses: Dispatch<{ [key: string]: any }>;
  contractAddresses: any;
  setContractAddresses: Dispatch<any>;
  selectedComp: string;
  setSelectedComp: Dispatch<string>;
  dataObj: any;
  setDataObj: Dispatch<any>;
  tokenData: any[];
  setTokenData: Dispatch<any[]>;
  setupData: any;
  setSetupData: Dispatch<any>;
  totalCashDeployed: number;
  setTotalCashDeployed: Dispatch<number>;
  farmDataObj: any;
  setFarmDataObj: Dispatch<any>;
  bonusApy: boolean;
  setBonusApy: Dispatch<boolean>;
  availabletoBorrowUser: number;
  setAvailabletoBorrowUser: Dispatch<number>;
  repayMaxAmount: boolean;
  setRepayMaxAmount: Dispatch<boolean>;
  networkData: {
    name: string;
    defaultGasPrice: any;
    blocksPerYear: number;
  };
  setNetworkData: Dispatch<{
    name: string;
    defaultGasPrice: any;
    blocksPerYear: number;
  }>;
  Contracts: any;
  setContracts: Dispatch<any>;
  adminAddress: string;
  setAdminAddress: Dispatch<string>;
  DECIMAL_18: any;
  setDECIMAL_18: Dispatch<any>;
  callCount: number;
  setCallCount: Dispatch<number>;
  numListedMarkets: number;
  setNumListedMarkets: Dispatch<number>;
  borrowPausedTokens: any[];
  setBorrowPausedTokens: Dispatch<any[]>;
  borrowPausedTokensSymbols: any[];
  setBorrowPausedTokensSymbols: Dispatch<any[]>;
  accountLiquidity: number;
  setAccountLiquidity: Dispatch<number>;
  compPrice: any;
  setCompPrice: Dispatch<any>;
  compRate: any;
  setCompRate: Dispatch<any>;
  compAddress: any;
  setCompAddress: Dispatch<any>;
  apyData: any;
  setApyData: Dispatch<any>;
  totalCashLoans: number;
  setTotalCashLoans: Dispatch<number>;
  usdoTokenDetails: any;
  setUsdoTokenDetails: Dispatch<any>;
  loadComplete: boolean;
  setLoadComplete: Dispatch<boolean>;
  collateralSupplyEnable: boolean;
  setCollateralSupplyEnable: Dispatch<boolean>;
  collateralBorrowEnable: boolean;
  setCollateralBorrowEnable: Dispatch<boolean>;
  vaultApy: number;
  setVaultApy: Dispatch<number>;
  polling: any;
  setPolling: Dispatch<any>;
  web3: any;
  setWeb3: Dispatch<any>;
}

const AppContext = createContext<ContextType>({
  currentAccount: "",
  setCurrentAccount: () => {},
  networkString: "BSC",
  setNetworkString: () => {},
  contractAddresses: {},
  setContractAddresses: () => {},
  selectedComp: "0x5AcEc8328f41145562548Dd335556c12559f2913",
  setSelectedComp: () => {},
  dataObj: {},
  setDataObj: () => {},
  tokenData: [],
  setTokenData: () => {},
  setupData: {},
  setSetupData: () => {},
  totalCashDeployed: 0,
  setTotalCashDeployed: () => {},
  farmDataObj: {},
  setFarmDataObj: () => {},
  bonusApy: true,
  setBonusApy: () => {},
  availabletoBorrowUser: 0,
  setAvailabletoBorrowUser: () => {},
  repayMaxAmount: false,
  setRepayMaxAmount: () => {},
  networkData: {
    name: "bsc",
    defaultGasPrice: ethers.utils.parseUnits("5", "gwei"),
    blocksPerYear: 10512000,
  },
  setNetworkData: () => {},
  Contracts: null,
  setContracts: () => {},
  adminAddress: "",
  setAdminAddress: () => {},
  DECIMAL_18: 10 ** 18,
  setDECIMAL_18: () => {},
  callCount: 0,
  setCallCount: () => {},
  numListedMarkets: 0,
  setNumListedMarkets: () => {},
  borrowPausedTokens: [],
  setBorrowPausedTokens: () => {},
  borrowPausedTokensSymbols: [],
  setBorrowPausedTokensSymbols: () => {},
  accountLiquidity: 0,
  setAccountLiquidity: () => {},
  compPrice: "",
  setCompPrice: () => {},
  compRate: "",
  setCompRate: () => {},
  compAddress: "",
  setCompAddress: () => {},
  apyData: {
    netApy: 0,
    posApy: 0,
    negApy: 0,
  },
  setApyData: () => {},
  totalCashLoans: 0,
  setTotalCashLoans: () => {},
  usdoTokenDetails: {},
  setUsdoTokenDetails: () => {},
  loadComplete: false,
  setLoadComplete: () => {},
  collateralSupplyEnable: false,
  setCollateralSupplyEnable: () => {},
  collateralBorrowEnable: false,
  setCollateralBorrowEnable: () => {},
  vaultApy: 0,
  setVaultApy: () => {},
  polling: 0,
  setPolling: () => {},
  web3: null,
  setWeb3: () => {},
});

export default AppContext;
