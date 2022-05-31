// import type { AppProps } from "next/app";
import "../styles/globals.css";
import "../scss/styles.scss";
import "../public/assets/plugins/select2/select2.min.css";
import AppContext from "../components/utils/AppContext";
import { useState } from "react";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { blockchainConstants } from "../lib/constants/blockchain-constants";

function MyApp({ Component, pageProps }: any) {
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [networkString, setNetworkString] = useState<string>("");
  const [contractAddresses, setContractAddresses] = useState<any>({});
  // {
  //   [key: string]: any;
  // }
  const [selectedComp, setSelectedComp] = useState<string>(
    "0x5AcEc8328f41145562548Dd335556c12559f2913"
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

  const [setupData, setSetupData] = useState({
    totalValueLocked: 0,
    availabletoBorrowUser: 0,
    repayMaxAmount: false,
    bonusApy: true,
    selectedTokenIndex: 0,
    totalSupplyBalance: 0,
    totalBorrowBalance: 0,
    accountLiquidity: 0,
    sliderPercentage: 0,
    roiFactor: 0,
    compEarned: new BigNumber(0),
    compBalance: 0,
  });

  const [totalCashDeployed, setTotalCashDeployed] = useState<number>(0);
  const [availabletoBorrowUser, setAvailabletoBorrowUser] = useState<number>(0);
  const [farmDataObj, setFarmDataObj] = useState<any>({});
  const [bonusApy, setBonusApy] = useState<boolean>(true);
  const [repayMaxAmount, setRepayMaxAmount] = useState<boolean>(false);

  const [networkData, setNetworkData] = useState<{
    name: string;
    defaultGasPrice: any;
    blocksPerYear: number;
  }>({
    name: "bsc",
    defaultGasPrice: ethers.utils.parseUnits("5", "gwei"),
    blocksPerYear: 10512000,
  });

  const [Contracts, setContracts] = useState<any>(blockchainConstants.bsc);
  const [adminAddress, setAdminAddress] = useState<string>("");

  const [DECIMAL_18, setDECIMAL_18] = useState<any>(10 ** 18);

  const [callCount, setCallCount] = useState<number>(0);
  const [numListedMarkets, setNumListedMarkets] = useState<number>(0);

  const [borrowPausedTokens, setBorrowPausedTokens] = useState<any[]>([]);
  const [borrowPausedTokensSymbols, setBorrowPausedTokensSymbols] = useState<
    any[]
  >([]);

  const [accountLiquidity, setAccountLiquidity] = useState<number>(0);

  const [compPrice, setCompPrice] = useState<any>();
  const [compRate, setCompRate] = useState<any>();
  const [compAddress, setCompAddress] = useState<any>();

  const [apyData, setApyData] = useState<any>({
    netApy: 0,
    posApy: 0,
    negApy: 0,
  });

  const [totalCashLoans, setTotalCashLoans] = useState<number>(0);
  const [usdoTokenDetails, setUsdoTokenDetails] = useState<any>({});

  const [loadComplete, setLoadComplete] = useState<boolean>(false);

  const [collateralSupplyEnable, setCollateralSupplyEnable] =
    useState<boolean>(false);
  const [collateralBorrowEnable, setCollateralBorrowEnable] =
    useState<boolean>(false);

  const [vaultApy, setVaultApy] = useState<number>(0);

  const [polling, setPolling] = useState<any>();

  const [web3, setWeb3] = useState<any>();

  //  Below declared in angular code, but unused

  // const [provideLiquidityLinks] = useState([
  //   "https://bsc.valuedefi.io/#/add/0xb632bed9661bc88fc5fd89d3cb48da365991f730",
  //   "https://exchange.pancakeswap.finance/#/add/0x5801d0e1c7d977d78e4890880b8e579eb4943276/0x2ed076fc51685e7eb12804f8c10210cd305792e3",
  // ]);

  // const [liquidityPoolNames] = useState(["USDO/USDT Pool", "USDO/EURO Pool"]);

  // const [swapLinks] = useState([
  //   "https://bsc.valuedefi.io/#/vpeg-swap?inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=0x5801d0e1c7d977d78e4890880b8e579eb4943276",
  //   "https://exchange.pancakeswap.finance/#/swap?inputCurrency=0x5801d0e1c7d977d78e4890880b8e579eb4943276&outputCurrency=0x2eD076fC51685E7EB12804F8c10210cd305792E3",
  // ]);

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
    setupData,
    setSetupData,
    totalCashDeployed,
    setTotalCashDeployed,
    farmDataObj,
    setFarmDataObj,
    bonusApy,
    setBonusApy,
    availabletoBorrowUser,
    setAvailabletoBorrowUser,
    repayMaxAmount,
    setRepayMaxAmount,
    networkData,
    setNetworkData,
    Contracts,
    setContracts,
    adminAddress,
    setAdminAddress,
    DECIMAL_18,
    setDECIMAL_18,
    callCount,
    setCallCount,
    numListedMarkets,
    setNumListedMarkets,
    borrowPausedTokens,
    setBorrowPausedTokens,
    borrowPausedTokensSymbols,
    setBorrowPausedTokensSymbols,
    accountLiquidity,
    setAccountLiquidity,
    compPrice,
    setCompPrice,
    compRate,
    setCompRate,
    compAddress,
    setCompAddress,
    apyData,
    setApyData,
    totalCashLoans,
    setTotalCashLoans,
    usdoTokenDetails,
    setUsdoTokenDetails,
    loadComplete,
    setLoadComplete,
    collateralSupplyEnable,
    setCollateralSupplyEnable,
    collateralBorrowEnable,
    setCollateralBorrowEnable,
    vaultApy,
    setVaultApy,
    polling,
    setPolling,
    web3,
    setWeb3,
  };

  return (
    <>
      <AppContext.Provider value={injectedGlobalContext}>
        <Component {...pageProps} />
      </AppContext.Provider>
    </>
  );
}
export default MyApp;
