import { ethers } from "ethers";
import { createContext, Dispatch } from "react";

export interface ContextType {
  currentAccount: string;
  setCurrentAccount: Dispatch<string>;
  networkString: string;
  setNetworkString: Dispatch<string>;
  contractAddresses: any;
  setContractAddresses: Dispatch<any>;
  selectedComp: string;
  setSelectedComp: Dispatch<string>;
  dataObj: any;
  setDataObj: Dispatch<any>;
  tokenData: any[];
  setTokenData: Dispatch<any[]>;
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
  polling: any;
  setPolling: Dispatch<any>;
  web3: any;
  setWeb3: Dispatch<any>;
}

const AppContext = createContext<ContextType>({
  currentAccount: "",
  setCurrentAccount: () => {},
  networkString: "POLYGON",
  setNetworkString: () => {},
  contractAddresses: {},
  setContractAddresses: () => {},
  selectedComp: "0x5AcEc8328f41145562548Dd335556c12559f2913",
  setSelectedComp: () => {},
  dataObj: {},
  setDataObj: () => {},
  tokenData: [],
  setTokenData: () => {},
  networkData: {
    name: "polygon",
    defaultGasPrice: ethers.utils.parseUnits("35", "gwei"),
    blocksPerYear: 15017150,
  },
  setNetworkData: () => {},
  polling: 0,
  setPolling: () => {},
  web3: null,
  setWeb3: () => {},
});

export default AppContext;
