// import type { AppProps } from "next/app";
import "../styles/globals.css";
import "../scss/styles.scss";
import "../public/assets/plugins/select2/select2.min.css";
import AppContext from "../components/utils/AppContext";
import { useState } from "react";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { blockchainConstants } from "../lib/constants/blockchain-constants";
import { Web3Wrapper } from "../web3";
import { AuthProvider } from "../components/utils/AuthContext";
import { RefreshContextProvider } from "../components//utils/RefreshContext";
import { MarketContextProvider } from "../components//utils/MarketContext";

function MyApp({ Component, pageProps }: any) {
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [networkString, setNetworkString] = useState<string>("POLYGON");
  const [contractAddresses, setContractAddresses] = useState<any>({});
  // {
  //   [key: string]: any;
  // }
  const [selectedComp, setSelectedComp] = useState<string>(
    "0x61aAeaBdc65e4A95CcaA1a9573906604121ff87a"
  );
  const [dataObj, setDataObj] = useState<any>({
    //{ viewFarmType: "lendWithdraw" } // this line should be removed.
    subtabType: "stake",
    viewFarmType: "stake",
  });
  const [tokenData, setTokenData] = useState<any[]>([
    // THIS STATE SHOULD BE EMPTY OBJECT AS DEFAULT, make it simple {} later.
    {
      symbol: "LIME",
      name: "LIME",
      approved: true,
    },
    {
      symbol: "OCP",
      name: "OCP",
      approved: false,
    },
  ]);

  const [networkData, setNetworkData] = useState<{
    name: string;
    defaultGasPrice: any;
    blocksPerYear: number;
  }>({
    name: "polygon",
    defaultGasPrice: ethers.utils.parseUnits("35", "gwei"),
    blocksPerYear: 15017150,
  });

  const [polling, setPolling] = useState<any>();

  const [web3, setWeb3] = useState<any>();

  const injectedGlobalContext = {
    currentAccount,
    setCurrentAccount,
    networkString,
    setNetworkString,
    contractAddresses,
    setContractAddresses,
    selectedComp,
    setSelectedComp,
    dataObj,
    setDataObj,
    tokenData,
    setTokenData,
    networkData,
    setNetworkData,
    polling,
    setPolling,
    web3,
    setWeb3,
  };

  return (
    <>
      <Web3Wrapper>
        <RefreshContextProvider>
          <MarketContextProvider>
            <AuthProvider>
              <AppContext.Provider value={injectedGlobalContext}>
                <Component {...pageProps} />
              </AppContext.Provider>
            </AuthProvider>
          </MarketContextProvider>
        </RefreshContextProvider>
      </Web3Wrapper>
    </>
  );
}
export default MyApp;
