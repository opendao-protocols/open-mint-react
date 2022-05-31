import { Switch } from "@chakra-ui/react";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { blockchainConstants } from "../../lib/constants/blockchain-constants";
import {
  getAbsoluteValueWithDecimals,
  localeString,
  toBN,
  toDecimal,
  tokenToDecimals,
} from "../../lib/utils";
import AppContext from "../utils/AppContext";
import { cTokenAddressSymabolMapping } from "../../lib/constants/ctokenaddress-symbol";

import //* as
ERC20Detailed from "./../../public/assets/contracts/ERC20Detailed.json";
import * as CErc20Immutable from "./../../public/assets/contracts/CErc20Immutable.json";
import // * as
ComptrollerV3 from "./../../public/assets/contracts/ComptrollerV3.json";
import // * as
Comptroller from "./../../public/assets/contracts/Comptroller.json";
import // * as
Comp from "./../../public/assets/contracts/Comp.json";
import //* as
UniswapOracleTWAP from "./../../public/assets/contracts/UniswapOracleTWAP.json";
import //* as
CErc20Delegator from "./../../public/assets/contracts/CErc20Delegator.json";
import //* as
IVTDemoABI from "./../../public/assets/contracts/IVTDemoABI.json";
import axios from "axios";
import { getOmniSteaksApys, getTVL } from "../../lib/hooks";

declare var window: any;

interface Props {}

export const TxnSection: React.FC<Props> = ({}) => {
  const {
    currentAccount,
    setCurrentAccount,
    networkString,
    setNetworkString,
    contractAddresses,
    setContractAddresses,
    selectedComp,
    setSelectedComp,
    tokenData,
    setTokenData,
    dataObj,
    setDataObj,
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
  } = useContext(AppContext);

  const [showPuffCakeVaultContent, setShowPuffCakeVaultContent] =
    useState<boolean>(true);

  const supplyMax = (i: number, p: number) => {
    let amount = new BigNumber(tokenData[i].tokenBalance);
    let obj = { ...farmDataObj };
    obj["stakeInputAmt"] = amount.multipliedBy(toBN(p)).toFixed(4, 1);
    setFarmDataObj(obj);
  };

  const viewMintTab = () => {
    let obj = {
      ...dataObj,
    };
    obj["subtabType"] = "mint";
    obj["viewFarmType"] = "mint";
    setDataObj(obj);
  };

  const viewStakeTab = () => {
    let obj = {
      ...dataObj,
    };
    obj["subtabType"] = "stake";
    obj["viewFarmType"] = "stake";
    setDataObj(obj);
  };

  const viewLendTab = () => {
    let obj = {
      ...dataObj,
    };
    obj["subtabType"] = "lend";
    obj["viewFarmType"] = "lend";
    setDataObj(obj);
  };

  const withdrawMax = (i: number, p: number) => {
    let amount = new BigNumber(tokenData[i].cTokenSupplyBalance);
    let liquidity = new BigNumber(tokenData[i].availableBorrow);
    let obj = { ...farmDataObj };
    if (liquidity.isGreaterThanOrEqualTo(amount)) {
      obj["withdrawInputAmt"] = amount
        .multipliedBy(toBN(p))
        .toFixed(tokenData[i].erc20Decimals);
    } else {
      obj["withdrawInputAmt"] = liquidity
        .multipliedBy(toBN(p))
        .toFixed(tokenData[i].erc20Decimals);
    }
    setFarmDataObj(obj);
  };

  const borrowMax = (i: number, p: number) => {
    let amount = new BigNumber(availabletoBorrowUser / tokenData[i].priceUsd);
    let liquidity = new BigNumber(tokenData[i].availableBorrow);
    let obj = { ...farmDataObj };
    if (liquidity.isGreaterThanOrEqualTo(amount)) {
      obj["mintInputAmt"] = amount.multipliedBy(toBN(p)).toFixed(2);
    } else {
      obj["mintInputAmt"] = liquidity.multipliedBy(toBN(p)).toFixed(2);
    }
    setFarmDataObj(obj);
  };

  const lendMax = (i: number, p: number) => {
    let amount = new BigNumber(tokenData[i].tokenBalance);
    let obj = { ...farmDataObj };
    obj["lendInputAmt"] = amount.multipliedBy(toBN(p)).toFixed(4, 1);
    setFarmDataObj(obj);
  };

  const repayMax = (i: any | number, p: string | number | BigNumber) => {
    let userBalanceBN = new BigNumber(tokenData[i].tokenBalanceBN);
    let decimals = tokenData[i].erc20Decimals;
    let userBalance = new BigNumber(userBalanceBN.div(10 ** decimals));
    let maxRepayBalance = tokenData[i].tokenBorrowBalance;
    let amount;
    if (maxRepayBalance < userBalance) {
      amount = new BigNumber(maxRepayBalance).multipliedBy(toBN(p));
      setRepayMaxAmount(true);
    } else {
      amount = new BigNumber(userBalance).multipliedBy(toBN(p));
      setRepayMaxAmount(false);
    }
    let obj = { ...farmDataObj };
    obj["repayInputAmt"] = amount.toFixed(decimals);
    setFarmDataObj(obj);
  };

  const lendWithdrawMax = (i: number, p: number) => {
    let amount = new BigNumber(tokenData[i].cTokenSupplyBalance);
    let liquidity = new BigNumber(tokenData[i].availableBorrow);
    let obj = { ...farmDataObj };

    if (liquidity.isGreaterThanOrEqualTo(amount)) {
      farmDataObj["lendWithdrawInputAmt"] = amount
        .multipliedBy(toBN(p))
        .toFixed(tokenData[i].erc20Decimals);
    } else {
      farmDataObj["lendWithdrawInputAmt"] = liquidity
        .multipliedBy(toBN(p))
        .toFixed(tokenData[i].erc20Decimals);
    }
    setFarmDataObj(obj);
  };

  const viewFarmType = (type: string) => {
    let obj = {
      ...dataObj,
    };
    switch (type) {
      case "stake":
        obj["viewFarmType"] = "stake";
        break;
      case "withdraw":
        obj["viewFarmType"] = "withdraw";
        break;
      case "mint":
        obj["viewFarmType"] = "mint";
        break;
      case "repay":
        obj["viewFarmType"] = "repay";
        break;
      case "lend":
        obj["viewFarmType"] = "lend";
        break;
      case "lendWithdraw":
        obj["viewFarmType"] = "lendWithdraw";
        break;
      default:
        obj["viewFarmType"] = "";
    }
    setDataObj(obj);
  };

  const estimateGasPrice = async () => {
    const obj: {
      name: string;
      defaultGasPrice: any;
      blocksPerYear: number;
    } = { ...networkData };
    obj.defaultGasPrice = ethers.utils.parseUnits(
      blockchainConstants[obj.name].DefaultGasPrice,
      "gwei"
    );
    setNetworkData(obj);
  };

  const setNetworkVariables = async () => {
    // const web3 = new ethers.providers.Web3Provider(window["ethereum"]);
    const network = await web3.getNetwork();
    let obj = { ...networkData };
    obj.name = network.name;
    if (blockchainConstants[obj.name]) {
      obj.defaultGasPrice = ethers.utils.parseUnits(
        blockchainConstants[obj.name].DefaultGasPrice,
        "gwei"
      );
      obj.blocksPerYear = blockchainConstants[obj.name].BlocksPerYear;
    }
  };

  const enterExitMarket = async (token: any) => {
    await estimateGasPrice();
    const addressArray = [];
    addressArray.push(token.cTokenAddress);
    let tx;
    const overrides = {
      gasPrice: networkData.defaultGasPrice,
      gasLimit: 300000,
    };
    if (token.enabled === true) {
      tx = await Contracts.Comptroller.exitMarket(
        token.cTokenAddress,
        overrides
      );
    } else {
      tx = await Contracts.Comptroller.enterMarkets(addressArray, overrides);
    }

    // let web3 = new ethers.providers.Web3Provider(window["ethereum"]);
    await web3.waitForTransaction(tx.hash);
    // window.location.reload();
    await setup();
  };

  const initContract = (contractAddress: string, abi: any) => {
    // let web3 = new ethers.providers.Web3Provider(window["ethereum"]);
    return new ethers.Contract(contractAddress, abi, web3.getSigner());
    // return returnObj;
  };

  const stake = async (i: any) => {
    await estimateGasPrice();
    const tokenAddress = tokenData[i].tokenAddress;
    const TokenContract = initContract(tokenAddress, ERC20Detailed.abi);
    const decimals = await TokenContract.decimals();
    let amountInDec = tokenToDecimals(farmDataObj["stakeInputAmt"], decimals);

    const cTokenAddress = tokenData[i].cTokenAddress;
    const cTokenContract = initContract(cTokenAddress, CErc20Immutable.abi);
    const overrides = {
      gasPrice: networkData.defaultGasPrice,
      gasLimit: 1000000,
    };
    const tx = await cTokenContract.mint(amountInDec, overrides);

    // let web3 = new ethers.providers.Web3Provider(window["ethereum"]);
    await web3.waitForTransaction(tx.hash);

    if (
      tokenData[i].collateralFactor !== "0.00" &&
      tokenData[i].enabled === false
    ) {
      await enterExitMarket(tokenData[i]);
    }
    setup();
  };

  const getContractAddresses = async () => {
    let myContractAddresses: any = {};

    // let web3 = new ethers.providers.Web3Provider(window["ethereum"]);
    const network = await web3.getNetwork();

    myContractAddresses = blockchainConstants["bsc"];
    myContractAddresses.Comptroller = selectedComp;
    setContractAddresses({ name: "Qw" });
    return myContractAddresses;
  };

  const initAllContracts = async (contractAddresses: any) => {
    // this.Contracts = {};
    let myContracts: any = {};

    let myComptroller: any = Comptroller;

    // setContracts({})
    console.log(
      "1!!contractAddresses.Comptroller",
      contractAddresses.Comptroller
    );
    myContracts.Comptroller = initContract(
      contractAddresses.Comptroller,
      myComptroller.abi
    );

    const compAddress = await myContracts.Comptroller.getCompAddress();
    myContracts.Comp = initContract(compAddress, Comp.abi);

    const oracleAddress = await myContracts.Comptroller.oracle();
    myContracts.PriceOracleProxy = initContract(
      oracleAddress,
      UniswapOracleTWAP.abi
    );

    setContracts(myContracts);
  };

  const setup = async () => {
    const resetState = {
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
    };

    setSetupData(resetState);

    // const mmweb3 = new ethers.providers.Web3Provider(window["ethereum"]);

    const userAddress = await web3.getSigner().getAddress();
    setCurrentAccount(userAddress);

    await setNetworkVariables();

    // if (this.networkData.name == "polygon") {
    //   cApp.blockPage({
    //     overlayColor: "#000000",
    //     state: "secondary",
    //     message:
    //       'Loading App...<br><br><div style="font-size: 0.8rem;">If it is taking too long to load, please try using different rpc urls: <br> <br> <strong>MATIC</strong> <br> 1. https://rpc-mainnet.matic.quiknode.pro <br>2. https://matic-mainnet.chainstacklabs.com</div><br>',
    //   });
    // } else {
    //   cApp.blockPage({
    //     overlayColor: "#000000",
    //     state: "secondary",
    //     message: "Loading App...",
    //   });
    // }

    const myContractAddresses = await getContractAddresses();

    if (typeof myContractAddresses === "undefined") {
      return;
    }

    const allListedTokens = await fetchAllMarkets();
    await initAllContracts(myContractAddresses);

    const necessaryMarkets = allListedTokens;

    await estimateGasPrice();

    // In case there are no markets
    // if (allListedTokens.length === 0) {
    //   cApp.unblockPage();
    //   return;
    // }
    fetchTokens(necessaryMarkets);
  };

  const getPrice = async (cTokenAddress: any) => {
    let tokenPrice = await Contracts.PriceOracleProxy.getUnderlyingPrice(
      cTokenAddress
    );
    const CTokenContract = initContract(cTokenAddress, CErc20Delegator.abi);
    const underlyingTokenAddress = await CTokenContract.underlying();
    const TokenContract = initContract(underlyingTokenAddress, IVTDemoABI.abi);
    const tokenDecimals = await TokenContract.decimals();
    const decimalDiff = 36 - parseFloat(tokenDecimals);
    const priceMantissa = toBN(tokenPrice).div(toBN(10).pow(decimalDiff));
    return priceMantissa.toFixed();
  };

  const getNumber = (hexNum: any) => {
    return ethers.utils.bigNumberify(hexNum).toString();
  };

  const getUserSupplyBalance = async (cTokenContract: any, token: any) => {
    let tokenBalance = await cTokenContract.balanceOf(currentAccount);
    tokenBalance = getNumber(tokenBalance);

    if (parseFloat(tokenBalance) > 0) {
      const underlying = await cTokenContract.underlying();
      const tokenContract = initContract(underlying, ERC20Detailed.abi);
      const tokenDecimals = await tokenContract.decimals();
      const divBy = DECIMAL_18 * 10 ** parseFloat(tokenDecimals);

      let exchangeRateStored = await cTokenContract.exchangeRateStored();
      exchangeRateStored = getNumber(exchangeRateStored);
      const bal =
        (parseFloat(tokenBalance) * parseFloat(exchangeRateStored)) / divBy;
      tokenBalance = bal;
      const supplyBal = parseFloat(token.priceUsd) * parseFloat(tokenBalance);

      let obj = { ...setupData };
      obj.totalSupplyBalance = obj.totalSupplyBalance + supplyBal;
      setSetupData(obj);
    }
    return tokenBalance;
  };

  const getUserSupplyBalanceUSD = (token: any) => {
    return parseFloat(token.cTokenSupplyBalance) * parseFloat(token.priceUsd);
  };

  const getUserBorrowBalanceUSD = (token: any) => {
    return parseFloat(token.tokenBorrowBalance) * parseFloat(token.priceUsd);
  };

  const getUserBorrowBalance = async (cTokenContract: any, token: any) => {
    let tokenBalance = await cTokenContract.borrowBalanceStored(currentAccount);
    tokenBalance = getNumber(tokenBalance);
    if (parseFloat(tokenBalance) > 0) {
      const underlying = await cTokenContract.underlying();
      const tokenContract = initContract(underlying, ERC20Detailed.abi);
      const tokenDecimals = await tokenContract.decimals();

      tokenBalance = parseFloat(tokenBalance) / 10 ** parseFloat(tokenDecimals);
      const borrowBal = parseFloat(token.priceUsd) * parseFloat(tokenBalance);

      let obj = { ...setupData };
      obj.totalBorrowBalance = obj.totalBorrowBalance + borrowBal;
      setSetupData(obj);
    }
    return tokenBalance;
  };

  const getUserTokenBalance = async (tokenContract: any) => {
    let tokenBalance = await tokenContract.balanceOf(currentAccount);
    tokenBalance = getNumber(tokenBalance);
    return tokenBalance;
  };

  const getEnteredMarkets = async () => {
    const assetsInArray = await Contracts.Comptroller.getAssetsIn(
      currentAccount
    );
    if (assetsInArray.length === 0) {
      return;
    }

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < assetsInArray.length; i++) {
      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < tokenData.length; j++) {
        if (
          assetsInArray[i].toLowerCase() ===
          tokenData[j].cTokenAddress.toLowerCase()
        ) {
          tokenData[j].enabled = true;
        }
      }
    }
  };

  const checkBorrowPaused = async () => {
    let myComptrollerV3: any = ComptrollerV3;

    const web3Contract = initContract(
      contractAddresses.Comptroller,
      myComptrollerV3["abi"]
    );

    let borrPausedTokens = [];
    let borrPausedTokensSymbols = [];

    for (const token of tokenData) {
      const isBorrowingPaused = await web3Contract.borrowGuardianPaused(
        token.cTokenAddress
      );
      if (isBorrowingPaused) {
        borrPausedTokens.push(token);
        borrPausedTokensSymbols.push(token.symbol);
      }
    }

    setBorrowPausedTokens(borrPausedTokens);
    setBorrowPausedTokensSymbols(borrPausedTokensSymbols);
  };

  const getAccountLiquidity = async (token: any, i: number) => {
    let accountLiquidity = await Contracts.Comptroller.getAccountLiquidity(
      currentAccount
    );
    accountLiquidity = new BigNumber(accountLiquidity[1].toString());

    const myAvailabletoBorrowUser = accountLiquidity.div(10 ** 18).toFixed();
    setAvailabletoBorrowUser(myAvailabletoBorrowUser);

    if (
      parseFloat(token.cTokenSupplyBalanceUSD) > 0 &&
      token.enabled === true
    ) {
      const myAccountLiquidity =
        accountLiquidity +
        (parseFloat(token.collateralFactor) *
          parseFloat(token.cTokenSupplyBalanceUSD)) /
          100;
      setAccountLiquidity(myAccountLiquidity);
    }
  };

  const getCompRate = async () => {
    let myCompRate = toBN(0);
    setCompRate(myCompRate);
    let myComptrollerV3: any = ComptrollerV3;
    console.log(
      "2!!contractAddresses.Comptroller",
      contractAddresses.Comptroller
    );
    const web3Contract = initContract(
      contractAddresses.Comptroller,
      myComptrollerV3["abi"]
    );
    let comprate = await web3Contract.compRate();
    comprate = parseFloat(comprate) / 10 ** 18; // 18 decimal reward Token
    comprate = new BigNumber(comprate);
    setCompRate(comprate);
    return comprate;
  };

  const getCompAddress = async () => {
    let myComptrollerV3: any = ComptrollerV3;

    console.log(
      "3!!contractAddresses.Comptroller",
      contractAddresses.Comptroller
    );
    const web3Contract = initContract(
      contractAddresses.Comptroller,
      myComptrollerV3["abi"]
    );
    let compaddress = await web3Contract.getCompAddress();
    setCompAddress(compaddress);
    return compaddress;
  };

  const calcNetApy = () => {
    let posApy = 0;
    let negApy = 0;
    tokenData.forEach((token: any) => {
      if (
        parseFloat(token.cTokenSupplyBalanceUSD) > 0 &&
        parseFloat(token.supplyApy) > 0 &&
        setupData.totalSupplyBalance > 0
      ) {
        posApy +=
          (parseFloat(token.cTokenSupplyBalanceUSD) *
            parseFloat(token.supplyApy)) /
          setupData.totalSupplyBalance;
      }
      if (
        parseFloat(token.tokenBorrowBalanceUSD) > 0 &&
        parseFloat(token.borrowApy) > 0 &&
        setupData.totalBorrowBalance > 0
      ) {
        negApy +=
          (parseFloat(token.tokenBorrowBalanceUSD) *
            parseFloat(token.borrowApy)) /
          setupData.totalBorrowBalance;
      }
    });

    let obj = {
      netApy: posApy - negApy,
      posApy: posApy,
      negApy: negApy,
    };
    setApyData(obj);
  };

  const calcTotalDeployedAmount = () => {
    let myTotalCaseDeployed = 0;

    tokenData.forEach((token: any) => {
      if (parseFloat(token.totalErc20Supply) >= 0) {
        myTotalCaseDeployed +=
          parseFloat(token.totalErc20Supply) * parseFloat(token.priceUsd);
      }
    });

    setTotalCashDeployed(myTotalCaseDeployed);
  };

  const getCompPrice = () => {
    if (tokenData.length === 0) {
      return;
    }
    let result = tokenData.filter(
      (token: any) =>
        token.tokenAddress.toLowerCase() === compAddress.toLowerCase()
    );
    if (result.length) {
      let myCompPrice = result[0].priceUsd;
      setCompPrice(myCompPrice);
    } else if (
      compAddress.toLowerCase() ==
      "0x3C70260eEe0a2bFc4b375feB810325801f289fBd".toLowerCase()
    ) {
      let compPrice1 = getPrice("0xfff0cC78a7E7CE5d6Ba60f23628fF9A63BEee87F");
      setCompPrice(compPrice1);
    }
  };

  const calcTotalLoanAmount = () => {
    let myTotalCashLoans = 0;

    tokenData.forEach((token: any) => {
      if (parseFloat(token.totalErc20Borrows) >= 0) {
        myTotalCashLoans +=
          parseFloat(token.totalErc20Borrows) * parseFloat(token.priceUsd);
      }
    });

    setTotalCashLoans(myTotalCashLoans);
  };

  const setCompTokenApyData = () => {
    let totalCompDistribution = toBN(compRate.multipliedBy(toBN(2)));
    let tempTokenData = [...tokenData];

    tempTokenData.forEach((token: any) => {
      if (parseFloat(token.totalErc20Borrows) > 0) {
        token.borrowPercentage = toDecimal(
          (token.totalErc20BorrowsUsd / totalCashLoans) * 100,
          18
        );
        token.compRewardPerBlock = toBN(token.borrowPercentage)
          .div(toBN(100))
          .multipliedBy(totalCompDistribution);
        token.compRewardPerDay = token.compRewardPerBlock.multipliedBy(
          toBN(networkData.blocksPerYear).div(toBN(365.25))
        );
        token.compRewardPerBlockSuppliers = token.compRewardPerBlock.div(
          toBN(2)
        );
        token.compRewardPerBlockBorrowers = token.compRewardPerBlock.div(
          toBN(2)
        );
        token.compRewardPerDaySuppliers = token.compRewardPerDay.div(toBN(2));
        token.compRewardPerDayBorrowers = token.compRewardPerDay.div(toBN(2));
        token.compRewardPerBlockPerSupplyUsd =
          token.compRewardPerBlockSuppliers.div(
            toBN(token.totalErc20SupplyUsd)
          );
        token.compRewardPerBlockPerBorrowUsd =
          token.compRewardPerBlockBorrowers.div(token.totalErc20BorrowsUsd);
        token.compRewardReturnPerBlockPerSupplyUsd =
          token.compRewardPerBlockPerSupplyUsd.multipliedBy(toBN(compPrice));
        token.compRewardReturnPerBlockPerBorrowUsd =
          token.compRewardPerBlockPerBorrowUsd.multipliedBy(toBN(compPrice));
        token.compRewardReturnPerYearPerSupplyUsd =
          token.compRewardReturnPerBlockPerSupplyUsd.multipliedBy(
            toBN(networkData.blocksPerYear)
          );
        token.compRewardReturnPerYearPerBorrowUsd =
          token.compRewardReturnPerBlockPerBorrowUsd.multipliedBy(
            toBN(networkData.blocksPerYear)
          );
        token.supplyCompApy =
          token.compRewardReturnPerYearPerSupplyUsd.multipliedBy(toBN(100));
        token.borrowCompApy =
          token.compRewardReturnPerYearPerBorrowUsd.multipliedBy(toBN(100));
        token.totalSupplywithCompApy = toBN(token.supplyApy).plus(
          toBN(token.supplyCompApy)
        );
        token.totalBorrowwithCompApy = toBN(token.borrowApy)
          .negated()
          .plus(toBN(token.borrowCompApy)); // Negated because borrow APY is always negative
      } else {
        token.borrowPercentage = toBN(0);
        token.compRewardPerBlock = toBN(0);
        token.compRewardPerDay = toBN(0);
        token.compRewardPerBlockSuppliers = toBN(0);
        token.compRewardPerBlockBorrowers = toBN(0);
        token.compRewardPerDaySuppliers = toBN(0);
        token.compRewardPerDayBorrowers = toBN(0);
        token.compRewardPerBlockPerSupplyUsd = toBN(0);
        token.compRewardPerBlockPerBorrowUsd = toBN(0);
        token.compRewardReturnPerBlockPerSupplyUsd = toBN(0);
        token.compRewardReturnPerBlockPerBorrowUsd = toBN(0);
        token.compRewardReturnPerYearPerSupplyUsd = toBN(0);
        token.compRewardReturnPerYearPerBorrowUsd = toBN(0);
        token.supplyCompApy = toBN(0);
        token.borrowCompApy = toBN(0);
        token.totalSupplywithCompApy = toBN(token.supplyApy);
        token.totalBorrowwithCompApy = toBN(token.borrowApy).negated();
      }
    });

    setTokenData(tempTokenData);
  };

  const getUsdoTokenDetails = () => {
    if (tokenData.length === 0) {
      return;
    }
    let result = tokenData.filter(
      (token: any) =>
        token.tokenAddress.toLowerCase() ===
        blockchainConstants[networkData.name].usdoAddress.toLowerCase()
    );
    setUsdoTokenDetails(result[0]);
  };

  const getCompEarned = async () => {
    const DOUBLE = new BigNumber(1e36);
    const EXP = new BigNumber(1e18);
    // this.compEarned = new BigNumber(0);
    let myCompEarned = new BigNumber(0);

    let compTokenEarned = await Contracts.Comptroller.compAccrued(
      currentAccount
    );
    compTokenEarned = new BigNumber(compTokenEarned);
    myCompEarned = myCompEarned.plus(compTokenEarned);
    const allMarkets = await Contracts.Comptroller.getAllMarkets();

    await allMarkets.forEach(async (cTokenAddr: any) => {
      const markets = await Contracts.Comptroller.markets(cTokenAddr);
      // initial filter
      // if (!markets.isComped) { return; }

      // modified filter
      const compSupplyState = await Contracts.Comptroller.compSupplyState(
        cTokenAddr
      );
      const suppIndexCheck = new BigNumber(compSupplyState.index);
      const compBorrowState = await Contracts.Comptroller.compBorrowState(
        cTokenAddr
      );
      const borrIndexCheck = new BigNumber(compBorrowState.index);
      if (suppIndexCheck.isEqualTo(0) && borrIndexCheck.isEqualTo(0)) {
        return;
      }
      const CTokenContract = initContract(cTokenAddr, CErc20Immutable.abi);

      const supplyIndex = new BigNumber(compSupplyState.index);

      let compSupplierIndex = await Contracts.Comptroller.compSupplierIndex(
        cTokenAddr,
        currentAccount
      );
      compSupplierIndex = new BigNumber(compSupplierIndex);
      if (compSupplierIndex.isEqualTo(0) && supplyIndex.isGreaterThan(0)) {
        compSupplierIndex = new BigNumber(1e36); // compInitialIndex
      }

      const deltaIndex = supplyIndex.minus(compSupplierIndex);

      let supplierTokens = await CTokenContract.balanceOf(currentAccount);
      supplierTokens = new BigNumber(supplierTokens);
      let supplierDelta = supplierTokens.times(deltaIndex);
      supplierDelta = supplierDelta.div(DOUBLE);

      // const supplierAccrued = compTokenEarned.plus(supplierDelta);
      myCompEarned = myCompEarned.plus(supplierDelta);

      // For Borrow
      const borrowIndex = new BigNumber(compBorrowState.index);
      let compBorrowerIndex = await Contracts.Comptroller.compBorrowerIndex(
        cTokenAddr,
        currentAccount
      );
      compBorrowerIndex = new BigNumber(compBorrowerIndex);

      if (compBorrowerIndex.isGreaterThan(0)) {
        const deltaIndexBorrow = borrowIndex.minus(compBorrowerIndex);

        let borrowBalanceStored = await CTokenContract.borrowBalanceStored(
          currentAccount
        );
        borrowBalanceStored = new BigNumber(borrowBalanceStored);
        borrowBalanceStored = borrowBalanceStored.times(EXP);

        let marketBorrowIndex = await CTokenContract.borrowIndex();
        marketBorrowIndex = new BigNumber(marketBorrowIndex);
        const borrowerAmount = borrowBalanceStored.div(marketBorrowIndex);

        let borrowerDelta = borrowerAmount.times(deltaIndexBorrow);
        borrowerDelta = borrowerDelta.div(DOUBLE);

        myCompEarned = myCompEarned.plus(borrowerDelta);
      }
    });

    let obj = { ...setupData };
    obj.compEarned = myCompEarned;
    setSetupData(obj);
  };

  const getCompBalance = async () => {
    let compTokenBalance = await Contracts.Comp.balanceOf(currentAccount);
    compTokenBalance = getNumber(compTokenBalance);
    const tokenDecimals = await Contracts.Comp.decimals();
    compTokenBalance =
      parseFloat(compTokenBalance) / 10 ** parseFloat(tokenDecimals);
    return compTokenBalance;
  };

  const afterInitToken = async (token: any, i: number) => {
    setCallCount(callCount + 1);
    if (callCount < numListedMarkets) {
      return;
    }
    setTimeout(async () => {
      await getEnteredMarkets();
      await checkBorrowPaused();
      await getAccountLiquidity(token, i);
      await getCompRate();
      await getCompAddress();
      calcNetApy();
      calcTotalDeployedAmount();
      getCompPrice();
      calcTotalLoanAmount();
      setCompTokenApyData();
      getUsdoTokenDetails();
      if (accountLiquidity != 0 && i == 1) {
        setupData.sliderPercentage =
          (setupData.totalBorrowBalance / accountLiquidity) * 100;
      }
      if (i == 1) {
        setupData.compBalance = await getCompBalance();
        await getCompEarned();
        if (compRate.isEqualTo(toBN(0)) || tokenData[1].symbol != "HOTCROSS") {
          setBonusApy(false);
        }
      }
      setLoadComplete(true);
    }, 100);
    // cApp.unblockPage();
  };

  const checkApproved = async (tokenContract: any, allowanceOf: any) => {
    let approvedBal = await tokenContract.allowance(
      currentAccount,
      allowanceOf
    );
    approvedBal = getNumber(approvedBal);
    return approvedBal !== "0" ? true : false;
  };

  const getCtokenBorrows = async (cTokenContract: any, tokenContract: any) => {
    const borrow = await cTokenContract.totalBorrows();
    const erc20Decimals = await tokenContract.decimals();
    const erc20Borrows = parseFloat(borrow) / 10 ** parseFloat(erc20Decimals);
    return erc20Borrows;
  };

  const getCtokenSupply = async (cTokenContract: any, tokenContract: any) => {
    const erc20Decimals = await tokenContract.decimals();
    const borrow = await cTokenContract.totalBorrows();
    const cash = await cTokenContract.getCash();
    const reserves = await cTokenContract.totalReserves();
    const added = parseFloat(cash) + parseFloat(borrow) + parseFloat(reserves);
    const divBy = 10 ** parseFloat(erc20Decimals);
    const result = added / divBy;
    return result;
  };

  const getCollateralFactor = async (cTokenAddress: any) => {
    const markets = await Contracts.Comptroller.markets(cTokenAddress);
    const colFactorStrTemp = getNumber(markets.collateralFactorMantissa);
    const divBy = 10 ** 16;
    const colFactorStr = parseFloat(colFactorStrTemp) / divBy;
    return colFactorStr.toFixed(2).toString();
  };

  const getAPY = async (cTokenContract: any) => {
    let borrowRate = await cTokenContract.borrowRatePerBlock();
    borrowRate = getNumber(borrowRate);
    let supplyRate = await cTokenContract.supplyRatePerBlock();
    supplyRate = getNumber(supplyRate);
    const borrowApy = networkData.blocksPerYear * parseFloat(borrowRate);
    const supplyApy = networkData.blocksPerYear * parseFloat(supplyRate);
    const divBy = 10 ** 16;
    const borrowApyPerc = borrowApy / divBy;
    const supplyApyPerc = supplyApy / divBy;
    return [borrowApyPerc.toFixed(3), supplyApyPerc.toFixed(3)];
  };

  const getUtilizationRate = async (cTokenContract: any) => {
    const cash = await cTokenContract.getCash();
    const borrow = await cTokenContract.totalBorrows();
    const reserves = await cTokenContract.totalReserves();
    const divBy = parseFloat(cash) + parseFloat(borrow) - parseFloat(reserves);
    if (divBy === 0) {
      return "0";
    }
    const utilizationRate = (parseFloat(borrow) * 10 ** 18) / divBy;
    return utilizationRate.toString();
  };

  const getAvailableBorrow = async (cTokenContract: any) => {
    const underlying = await cTokenContract.underlying();
    const tokenContract = initContract(underlying, ERC20Detailed.abi);
    const tokenDecimals = await tokenContract.decimals();
    let cash = await cTokenContract.getCash();
    cash = getNumber(cash);
    const availableBorrow = parseFloat(cash) / 10 ** parseFloat(tokenDecimals);
    return availableBorrow.toString();
  };

  const getAvailableBorrowUSD = (token: any) => {
    return parseFloat(token.availableBorrow) * parseFloat(token.priceUsd);
  };

  const initToken = async (token: any, i: number) => {
    token.isListed = true;
    const cTokenContract = initContract(
      token.cTokenAddress,
      CErc20Delegator.abi
    );
    let priceUsd = await getPrice(token.cTokenAddress);
    token.priceUsd =
      token.cTokenAddress == "0x606F53B25984D60559b21BEE6c51E2FE93137852"
        ? parseFloat(priceUsd).toFixed(0)
        : parseFloat(priceUsd).toFixed(18);
    getUserSupplyBalance(cTokenContract, token).then(
      (cTokenSupplyBalance: any) => {
        token.cTokenSupplyBalance = parseFloat(cTokenSupplyBalance);
        token.cTokenSupplyBalanceUSD = getUserSupplyBalanceUSD(token);
      }
    );
    getUserBorrowBalance(cTokenContract, token).then(
      (tokenBorrowBalance: any) => {
        token.tokenBorrowBalance = parseFloat(tokenBorrowBalance);
        token.tokenBorrowBalanceUSD = getUserBorrowBalanceUSD(token);
      }
    );
    // });
    cTokenContract.name().then((cTokenName: string) => {
      token.cTokenName = cTokenName;
    });
    cTokenContract.underlying().then((underlyingTokenAddress: string) => {
      token.tokenAddress = underlyingTokenAddress;

      const tokenContract = initContract(
        underlyingTokenAddress,
        IVTDemoABI.abi
      );
      tokenContract.decimals().then(async (decimals: any) => {
        const divBy = 10 ** parseFloat(decimals);
        token.erc20Decimals = decimals;
        getUserTokenBalance(tokenContract).then((tokenBalance) => {
          token.tokenBalance = parseFloat(tokenBalance) / divBy;
          token.tokenBalanceBN = new BigNumber(tokenBalance.toString());
          afterInitToken(token, i);
        });
        tokenContract.totalSupply().then((totalSupply: any) => {
          totalSupply = getNumber(totalSupply);
          token.erc20TotalSupply =
            parseFloat(totalSupply) / 10 ** parseFloat(token.erc20Decimals);
        });
      });
      tokenContract.symbol().then((symbol: any) => {
        // console.log(symbol);
        symbol = symbol;
        token.symbol = cTokenAddressSymabolMapping[token.cTokenAddress]
          ? cTokenAddressSymabolMapping[token.cTokenAddress]
          : symbol;
        token.text = cTokenAddressSymabolMapping[token.cTokenAddress]
          ? cTokenAddressSymabolMapping[token.cTokenAddress]
          : symbol;
      });
      tokenContract.name().then(async (name: any) => {
        token.name = name;
      });
      checkApproved(tokenContract, token.cTokenAddress).then((approved) => {
        token.approved = approved;
      });
      getCtokenBorrows(cTokenContract, tokenContract).then(
        (totalErc20Borrows: any) => {
          token.totalErc20Borrows = totalErc20Borrows;
          token.totalErc20BorrowsUsd =
            totalErc20Borrows * parseFloat(token.priceUsd);
        }
      );
      getCtokenSupply(cTokenContract, tokenContract).then(
        (totalErc20Supply: any) => {
          token.totalErc20Supply = totalErc20Supply;
          token.totalErc20SupplyUsd =
            totalErc20Supply * parseFloat(token.priceUsd);
        }
      );
    });
    getCollateralFactor(token.cTokenAddress).then((collateralFactor: any) => {
      token.collateralFactor = collateralFactor;
    });
    getAPY(cTokenContract).then((apy: any) => {
      token.borrowApy = apy[0];
      token.supplyApy = apy[1];
    });
    getUtilizationRate(cTokenContract).then((utilizationRate: any) => {
      token.utilizationRate = parseFloat(utilizationRate) / 10 ** 18;
    });
    getAvailableBorrow(cTokenContract).then((availableBorrow: any) => {
      token.availableBorrow = availableBorrow;
      token.availableBorrowUSD = getAvailableBorrowUSD(token);
    });
  };

  const fetchTokens = async (allListedTokens: any) => {
    let mytokenData: any = [];
    // for (const cTokenAddress of allListedTokens) {
    for (let i = 0; i < allListedTokens.length; i++) {
      const token = {} as any;
      token.id = tokenData.length;
      token.enabled = false;
      token.approved = false;
      token.cTokenAddress = allListedTokens[i];
      // include await below maybe, thoguh not in angular code.
      initToken(token, i);
      tokenData.push(token);
    }
    setTokenData(mytokenData);
  };

  const fetchAllMarkets = async () => {
    let myComptrollerV3: any = ComptrollerV3;

    console.log(
      "4!!contractAddresses.Comptroller",
      contractAddresses.Comptroller
    );
    const web3Contract = initContract(
      contractAddresses.Comptroller,
      myComptrollerV3.abi
    );
    // if (!!web3Contract) {
    let adminAddr = await web3Contract.admin();
    setAdminAddress(adminAddr);
    const allMarkets = await web3Contract.getAllMarkets();
    return allMarkets;
    // }
  };

  const erc20Approve = async (i: number, from: any) => {
    // this.spinner.show();
    await estimateGasPrice();
    const amountStr =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935";
    const tokenAddress = tokenData[i].tokenAddress;
    const tokenContract = initContract(tokenAddress, IVTDemoABI.abi);
    const overrides = {
      gasPrice: networkData.defaultGasPrice,
      gasLimit: 200000,
    };
    const tx = await tokenContract.approve(
      tokenData[i].cTokenAddress,
      amountStr,
      overrides
    );

    // const web3 = new ethers.providers.Web3Provider(window["ethereum"]);
    await web3.waitForTransaction(tx.hash);

    const tempTokenData = [...tokenData];
    tempTokenData[i].approved = true;
    setTokenData(tempTokenData);

    // CONFIRM BELOW !! IT EXISTS IN ANGULAR
    // this.cdr.detectChanges();
    // this.cdr.markForCheck();

    // this.spinner.hide();
    return true;
  };

  const enableSupplyCollateral = () => {
    setCollateralSupplyEnable(true);
    erc20Approve(1, "stake");
  };

  const enableBorrowCollateral = () => {
    setCollateralBorrowEnable(true);
    erc20Approve(0, "withdraw");
  };

  const getVaultApys = async (vaultSymbol: any) => {
    try {
      const allApys = await getOmniSteaksApys();

      // below exists in angular, but unused var
      // let apy = allApys[vaultSymbol]["totalApy"];

      let obj = { ...dataObj };

      if (typeof allApys != "undefined") {
        let apy = allApys[vaultSymbol]["totalApy"];
        setVaultApy(apy);
        obj.limeApy = allApys["omnifarm-USDO-LIME"]["totalApy"];
        obj.popenApy = allApys["omnifarm-usdo-popen"]["totalApy"];
        obj.landApy = allApys["omnifarm-USDO-LAND"]["totalApy"];
        obj.rosnApy = allApys["omnifarm-USDO-ROSN"]["totalApy"];
        obj.gfxApy = allApys["omnifarm-USDO-GFX"]["totalApy"];
        obj.busdApy = allApys["omnifarm-usdo-busd-FET"]["totalApy"];
        obj.anyMattApy = allApys["omnifarm-usdo-busd-anyMTLX"]["totalApy"];
        obj.hyveApy = allApys["omnifarm-USDO-HYVE"]["totalApy"];
      } else {
        setVaultApy(0);
        obj.limeApy = 0;
        obj.popenApy = 0;
        obj.landApy = 0;
        obj.rosnApy = 0;
        obj.gfxApy = 0;
        obj.busdApy = 0;
        obj.anyMattApy = 0;
        obj.hyveApy = 0;
      }

      setDataObj(obj);
    } catch (error) {
      console.error(error);
    }
  };

  const initializeProvider = async () => {
    try {
      // const web3 = new ethers.providers.Web3Provider(window["ethereum"]);
      const network = await web3.getNetwork();
      let tvl = await getTVL();

      let obj: any = { ...dataObj };

      obj["totalTvl"] = tvl["error"] == false ? tvl["data"]["totalTvl"] : 0;

      let contractAddresses = blockchainConstants[network.name];
      const currentComp = localStorage.getItem("currentComp");
      if (currentComp) {
        const parsedCurrentComp = JSON.parse(currentComp);
        setSelectedComp(parsedCurrentComp);
      }
      let myVaultLists = [];
      for (let i = 0; i < contractAddresses["mintingVaults"].length; i++) {
        myVaultLists.push({
          id: i,
          name: contractAddresses["mintingVaults"][i]["stakeTokenSymbol"],
          compAdd: contractAddresses["mintingVaults"][i]["comptroller"],
        });
      }
      await setup();
    } catch (error) {
      console.error(error);
    }
  };

  const updateBalanceEffect = () => {
    const secondsInYear = 31622400;
    const updateIntervalInSec = 7;
    const myPolling = setInterval(() => {
      let obj = { ...setupData };
      if (
        toDecimal(setupData.totalSupplyBalance, 7) > 0 &&
        apyData.posApy > 0
      ) {
        const posApyPerSec = apyData.posApy / secondsInYear;
        const posApyPerInterval = posApyPerSec * updateIntervalInSec;
        obj.totalSupplyBalance =
          obj.totalSupplyBalance +
          (obj.totalSupplyBalance * posApyPerInterval) / 100;
      }
      if (
        toDecimal(setupData.totalBorrowBalance, 7) > 0 &&
        apyData.negApy > 0
      ) {
        const negApyPerSec = apyData.negApy / secondsInYear;
        const negApyPerInterval = negApyPerSec * updateIntervalInSec;
        obj.totalBorrowBalance =
          obj.totalBorrowBalance +
          (obj.totalBorrowBalance * negApyPerInterval) / 100;
      }
      setSetupData(obj);
    }, updateIntervalInSec * 1000);
    setPolling(myPolling);
  };

  // useEffect(() => {
  //   getVaultApys("omnifarm-ocp-usdo");
  // }, []);

  // useEffect(() => {
  //   if (!!web3) setup();
  // }, []);

  // useEffect(() => {
  //   return updateBalanceEffect();
  // }, []);

  return (
    <>
      <div className="row mb40 mt50">
        <div className="col-md-10 offset-md-1 vault">
          <div
            className="row vault__head"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShowPuffCakeVaultContent(!showPuffCakeVaultContent);
            }}
          >
            <div className="col-md-3 my-auto">
              <div className="vault__head-label font-weight-bold">VAULT</div>
            </div>
            <div className="col-md-3 my-auto">
              <div className="vault__head-label font-weight-bold">BALANCE</div>
            </div>
            <div className="col-md-3 my-auto">
              <div className="vault__head-label font-weight-bold">MINT APY</div>
            </div>
            <div className="col-md-3 my-auto">
              <div className="vault__head-label font-weight-bold">LEND APY</div>
            </div>
          </div>
          <div
            className="row bg-white vault__subhead"
            data-toggle="collapse"
            onClick={() => {
              setShowPuffCakeVaultContent(!showPuffCakeVaultContent);
            }}
            style={{ cursor: "pointer" }}
            aria-expanded="true"
          >
            <div className="col-md-2 my-auto">
              <div className="vault__subhead-label">
                {tokenData[1].symbol && (
                  <img
                    style={{
                      maxHeight: "25px",
                      marginTop: "-4.5px",
                    }}
                    src={`/assets/img/${tokenData[1].symbol}_logo.png`}
                    alt={`${tokenData[1].symbol} logo`}
                  />
                )}
                {tokenData[1].symbol}
              </div>
            </div>
            <div className="col-md-2 my-auto">
              <div className="vault__subhead-label">
                {localeString(toDecimal(tokenData[1].tokenBalance, 2), 2)}
                {tokenData[1].symbol}
              </div>
              <div className="vault__subhead-text">Wallet</div>
              <div className="vault__subhead-label">
                {localeString(
                  toDecimal(tokenData[1].cTokenSupplyBalance, 2),
                  2
                )}
                {tokenData[1].symbol}
              </div>
              <div className="vault__subhead-text">Deposited</div>
            </div>
            <div className="col-md-2 my-auto">
              {bonusApy ? (
                <div>
                  {getAbsoluteValueWithDecimals(
                    tokenData[0].totalBorrowwithCompApy,
                    13
                  ) > 0 ? (
                    <div
                      className="vault__subhead-label"
                      style={{ color: "#BB76D8" }}
                    >
                      <i className="fa fa-plus"> </i>
                      {getAbsoluteValueWithDecimals(
                        tokenData[0].totalBorrowwithCompApy,
                        2
                      )}
                      %
                    </div>
                  ) : (
                    <div className="vault__subhead-label">
                      <i className="fa fa-minus"></i>
                      {getAbsoluteValueWithDecimals(
                        tokenData[0].totalBorrowwithCompApy,
                        2
                      )}
                      %
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="vault__subhead-label"
                  style={{ color: "black" }}
                >
                  <i className="fa fa-minus"></i>
                  {getAbsoluteValueWithDecimals(tokenData[0].borrowApy, 2)}%
                </div>
              )}
            </div>
            <div className="col-md-2 my-auto">
              {bonusApy ? (
                <div>
                  {getAbsoluteValueWithDecimals(
                    tokenData[0].totalSupplywithCompApy,
                    13
                  ) > 0 ? (
                    <div
                      className="vault__subhead-label"
                      style={{ color: "#BB76D8" }}
                    >
                      <i className="fa fa-plus"></i>
                      {getAbsoluteValueWithDecimals(
                        tokenData[0].totalSupplywithCompApy,
                        2
                      )}
                      %
                    </div>
                  ) : (
                    <div className="vault__subhead-label">
                      {" "}
                      <i className="fa fa-minus"></i>
                      {getAbsoluteValueWithDecimals(
                        tokenData[0].totalSupplywithCompApy,
                        2
                      )}
                      %
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="vault__subhead-label"
                  style={{ color: "#BB76D8" }}
                >
                  <i className="fa fa-plus"></i>
                  {getAbsoluteValueWithDecimals(tokenData[0].supplyApy, 2)}%
                </div>
              )}
            </div>
          </div>
          {/*  */}
          {/*  */}
          {showPuffCakeVaultContent && (
            <div className="row my0" style={{ height: "auto" }}>
              <div
                className="col-lg-6 col-md-6 py0 px0 bg-brand-secondary bg-light-dark-ctm"
                style={{
                  borderRight: "0.25px solid #cacaca",
                }}
              >
                <div className="pb10 px10">
                  <div className="form">
                    <div className="mb10">
                      {tokenData[1].symbol && (
                        <div className="row">
                          <div className="col-4 p-0">
                            <div className="px-3 py-2">
                              <button
                                className={`btn btn-lg btn-tab btn-dark-ctm btn-block ${
                                  dataObj.subtabType === "stake" ? "active" : ""
                                }`}
                                onClick={() => viewStakeTab()}
                              >
                                Stake {tokenData[1].symbol}
                              </button>
                            </div>
                          </div>
                          <div className="col-4 p-0">
                            <div className="px-3 py-2">
                              <button
                                className={`btn btn-lg btn-tab btn-dark-ctm btn-block ${
                                  dataObj.subtabType === "mint" ? "active" : ""
                                }`}
                                onClick={() => viewMintTab()}
                              >
                                Mint {tokenData[0].symbol}
                              </button>
                            </div>
                          </div>
                          <div className="col-4 p-0">
                            <div className="px-3 py-2">
                              <button
                                className={`btn btn-lg btn-tab btn-dark-ctm btn-block ${
                                  dataObj.subtabType === "lend" ? "active" : ""
                                }`}
                                onClick={() => viewLendTab()}
                              >
                                Lend {tokenData[0].symbol}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      {dataObj.subtabType === "stake" && (
                        <div className="row">
                          <div className="col-6" style={{ padding: 0 }}>
                            <div className="pl-3 pr-2">
                              <button
                                className={`btn btn-lg btn-sub-tab btn-subtab-darker-ctm btn-block
                    ${dataObj.viewFarmType == "stake" ? "active" : ""}`}
                                onClick={() => viewFarmType("stake")}
                              >
                                Stake
                              </button>
                            </div>
                          </div>
                          <div className="col-6" style={{ padding: 0 }}>
                            <div className="pl-2 pr-3">
                              <button
                                className={`btn btn-lg btn-sub-tab btn-subtab-darker-ctm btn-block ${
                                  dataObj.viewFarmType == "withdraw"
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() => viewFarmType("withdraw")}
                              >
                                Withdraw
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      {dataObj.subtabType === "mint" && (
                        <div className="row">
                          <div className="col-6" style={{ padding: 0 }}>
                            <div className="pl-3 pr-2">
                              <button
                                className={`btn btn-lg btn-sub-tab btn-subtab-darker-ctm btn-block ${
                                  dataObj.viewFarmType == "mint" ? "active" : ""
                                }`}
                                onClick={() => viewFarmType("mint")}
                              >
                                Mint
                              </button>
                            </div>
                          </div>
                          <div className="col-6" style={{ padding: 0 }}>
                            <div className="pl-2 pr-3">
                              <button
                                className={`btn btn-lg btn-sub-tab btn-subtab-darker-ctm btn-block ${
                                  dataObj.viewFarmType == "repay"
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() => viewFarmType("repay")}
                              >
                                Repay
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      {dataObj.subtabType === "lend" && (
                        <div className="row">
                          <div className="col-6" style={{ padding: 0 }}>
                            <div className="pl-3 pr-2">
                              <button
                                className={`btn btn-lg btn-sub-tab btn-subtab-darker-ctm btn-block ${
                                  dataObj.viewFarmType == "lend" ? "active" : ""
                                }`}
                                disabled={tokenData[0].tokenBorrowBalance > 0}
                                onClick={() => viewFarmType("lend")}
                              >
                                Lend
                              </button>
                            </div>
                          </div>
                          <div className="col-6" style={{ padding: 0 }}>
                            <div className="pl-2 pr-3">
                              <button
                                className={`btn btn-lg btn-sub-tab btn-subtab-darker-ctm btn-block
                    ${dataObj.viewFarmType == "lendWithdraw" ? "active" : ""}`}
                                onClick={() => viewFarmType("lendWithdraw")}
                              >
                                Withdraw
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      <form>
                        <div className="row align-items-center">
                          <div className="col-12 px-3">
                            {dataObj.viewFarmType === "stake" && (
                              <div className="tab-spacer">
                                <input
                                  type="text"
                                  className="form-control form-control-lg text-center"
                                  placeholder="0"
                                  //   [(ngModel)]="farmDataObj.stakeInputAmt"
                                  name="farmDataObj.stakeInputAmt"
                                  id="supply_amount"
                                />
                                <button
                                  onClick={() => supplyMax(1, 1)}
                                  className="max-btn"
                                >
                                  MAX
                                </button>
                                <button
                                  onClick={() => supplyMax(1, 0.75)}
                                  className="max-btn"
                                >
                                  75%
                                </button>
                                <button
                                  onClick={() => supplyMax(1, 0.5)}
                                  className="max-btn"
                                >
                                  50%
                                </button>
                                <button
                                  onClick={() => supplyMax(1, 0.25)}
                                  className="max-btn"
                                >
                                  25%
                                </button>
                              </div>
                            )}
                            {dataObj.viewFarmType === "withdraw" && (
                              <div className="tab-spacer">
                                <input
                                  type="text"
                                  className="form-control form-control-lg text-center"
                                  placeholder="0"
                                  //   [(ngModel)]="farmDataObj.withdrawInputAmt"
                                  name="farmDataObj.withdrawInputAmt"
                                  id="supply_amount"
                                ></input>
                                <button
                                  onClick={() => withdrawMax(1, 1)}
                                  className="max-btn"
                                >
                                  MAX
                                </button>
                                <button
                                  onClick={() => withdrawMax(1, 0.75)}
                                  className="max-btn"
                                >
                                  75%
                                </button>
                                <button
                                  onClick={() => withdrawMax(1, 0.5)}
                                  className="max-btn"
                                >
                                  50%
                                </button>
                                <button
                                  onClick={() => withdrawMax(1, 0.25)}
                                  className="max-btn"
                                >
                                  25%
                                </button>
                              </div>
                            )}
                            {dataObj.viewFarmType === "mint" && (
                              <div className="tab-spacer">
                                <input
                                  type="text"
                                  className="form-control form-control-lg text-center"
                                  placeholder="0"
                                  // [(ngModel)]="farmDataObj.mintInputAmt"
                                  name="farmDataObj.mintInputAmt"
                                  id="supply_amount"
                                ></input>
                                <button
                                  onClick={() => borrowMax(0, 0.9)}
                                  className="max-btn"
                                >
                                  MAX
                                </button>
                                <button
                                  onClick={() => borrowMax(0, 0.75)}
                                  className="max-btn"
                                >
                                  75%
                                </button>
                                <button
                                  onClick={() => borrowMax(0, 0.5)}
                                  className="max-btn"
                                >
                                  50%
                                </button>
                                <button
                                  onClick={() => borrowMax(0, 0.25)}
                                  className="max-btn"
                                >
                                  25%
                                </button>
                              </div>
                            )}
                            {dataObj.viewFarmType === "repay" && (
                              <div className="tab-spacer">
                                <input
                                  type="text"
                                  className="form-control form-control-lg text-center"
                                  placeholder="0"
                                  //   [(ngModel)]="farmDataObj.repayInputAmt"
                                  name="farmDataObj.repayInputAmt"
                                  id="supply_amount"
                                ></input>
                                <button
                                  onClick={() => repayMax(0, 1)}
                                  className="max-btn"
                                >
                                  MAX
                                </button>
                                <button
                                  onClick={() => repayMax(0, 0.75)}
                                  className="max-btn"
                                >
                                  75%
                                </button>
                                <button
                                  onClick={() => repayMax(0, 0.5)}
                                  className="max-btn"
                                >
                                  50%
                                </button>
                                <button
                                  onClick={() => repayMax(0, 0.25)}
                                  className="max-btn"
                                >
                                  25%
                                </button>
                              </div>
                            )}
                            {dataObj.viewFarmType === "lend" && (
                              <div className="tab-spacer">
                                <input
                                  type="text"
                                  className="form-control form-control-lg text-center"
                                  placeholder="0"
                                  //   [(ngModel)]="farmDataObj.lendInputAmt"
                                  name="farmDataObj.lendInputAmt"
                                  id="supply_amount"
                                />
                                <button
                                  onClick={() => lendMax(0, 1)}
                                  className="max-btn"
                                >
                                  MAX
                                </button>
                                <button
                                  onClick={() => lendMax(0, 0.75)}
                                  className="max-btn"
                                >
                                  75%
                                </button>
                                <button
                                  onClick={() => lendMax(0, 0.5)}
                                  className="max-btn"
                                >
                                  50%
                                </button>
                                <button
                                  onClick={() => lendMax(0, 0.25)}
                                  className="max-btn"
                                >
                                  25%
                                </button>
                              </div>
                            )}
                            {dataObj.viewFarmType === "lendWithdraw" && (
                              <div className="tab-spacer">
                                <input
                                  type="text"
                                  className="form-control form-control-lg text-center"
                                  placeholder="0"
                                  // [(ngModel)]="farmDataObj.lendWithdrawInputAmt"
                                  name="farmDataObj.lendWithdrawInputAmt"
                                  id="supply_amount"
                                />
                                <button
                                  onClick={() => lendWithdrawMax(0, 1)}
                                  className="max-btn"
                                >
                                  MAX
                                </button>
                                <button
                                  onClick={() => lendWithdrawMax(0, 0.75)}
                                  className="max-btn"
                                >
                                  75%
                                </button>
                                <button
                                  onClick={() => lendWithdrawMax(0, 0.5)}
                                  className="max-btn"
                                >
                                  50%
                                </button>
                                <button
                                  onClick={() => lendWithdrawMax(0, 0.25)}
                                  className="max-btn"
                                >
                                  25%
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>

                    {dataObj.subtabType === "stake" && (
                      <div className="row calculation px-3">
                        <div className="col-sm-10 col-2 text-right">
                          <span>Enable as collateral</span>
                        </div>
                        <div className="col-sm-2 col-2 text-right">
                          {tokenData[1].collateralFactor !== "0.00" ? (
                            <div>
                              {/*
                                <mat-slide-toggle
                                [checked]="tokenData[1].enabled"
                                [disabled]="false"
                                (change)="enterExitMarket(tokenData[1])"
                                >
                                </mat-slide-toggle>
                              */}
                              <Switch
                                size="md"
                                isChecked={tokenData[1].enabled}
                                onChange={() => {
                                  enterExitMarket(tokenData[1]);
                                }}
                              />
                            </div>
                          ) : (
                            <span>N.A.</span>
                          )}
                        </div>
                      </div>
                    )}

                    {dataObj.subtabType === "mint" && (
                      <div className="row">
                        <div className="col-md-12">
                          <div className="calculation">
                            <div className="col-md-6">
                              <span className="description">
                                {tokenData[0].symbol}
                                BORROWED/MINTED + INTEREST ACCRUED
                              </span>
                            </div>
                            <div
                              className="col-md-6 description"
                              style={{
                                wordBreak: "break-word",
                              }}
                            >
                              <span className="description">
                                {toDecimal(
                                  tokenData[0].tokenBorrowBalance,
                                  tokenData[0].erc20Decimals
                                )}
                                {tokenData[0].symbol}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="px-1 mt-3">
                      {dataObj.viewFarmType === "stake" &&
                        tokenData[1].approved && (
                          <div>
                            <button
                              className="btn btn-subtab-darker-ctm btn-block active"
                              onClick={() => stake(1)}
                              //   mat-raised-button
                              //   matTooltip="Supply collateral"
                              //   matTooltipclassName="custom-tooltip"
                            >
                              SUBMIT
                            </button>
                          </div>
                        )}
                      {dataObj.viewFarmType === "stake" &&
                        !tokenData[1].approved && (
                          <div>
                            <button
                              className="btn btn-subtab-darker-ctm btn-block active"
                              onClick={() => enableSupplyCollateral()}
                              //   mat-raised-button
                              //   matTooltip="Enable for Collateral Supply"
                              //   matTooltipclassName="custom-tooltip"
                            >
                              APPROVE
                            </button>
                          </div>
                        )}

                      {dataObj.viewFarmType === "withdraw" &&
                        tokenData[1].approved && (
                          <div>
                            <button
                              className="btn btn-subtab-darker-ctm btn-block active"
                              //   onClick={() => withdraw(1)}
                              //   mat-raised-button
                              //   matTooltipclassName="custom-tooltip"
                            >
                              SUBMIT
                            </button>
                          </div>
                        )}
                      {dataObj.viewFarmType === "withdraw" &&
                        !tokenData[1].approved && (
                          <div>
                            <button
                              className="btn btn-subtab-darker-ctm btn-block active"
                              //   onClick={() => enableSupplyCollateral()}
                              //   mat-raised-button
                              //   matTooltip="Enable for Supply collateral"
                              //   matTooltipclassName="custom-tooltip"
                            >
                              APPROVE
                            </button>
                          </div>
                        )}

                      {dataObj.viewFarmType === "mint" &&
                        tokenData[0].approved && (
                          <div>
                            <button
                              className="btn btn-subtab-darker-ctm btn-block activebtn-brand"
                              //    onClick={() => mint(0)}
                              //   mat-raised-button
                              //   matTooltipclassName="custom-tooltip"
                            >
                              SUBMIT
                            </button>
                          </div>
                        )}

                      {dataObj.viewFarmType === "mint" &&
                        !tokenData[0].approved && (
                          <div>
                            <button
                              className="btn btn-subtab-darker-ctm btn-block active"
                              //    onClick={() => enableBorrowCollateral()}
                              //   mat-raised-button
                              //   matTooltip="Enable"
                              //   matTooltipclassName="custom-tooltip"
                            >
                              APPROVE
                            </button>
                          </div>
                        )}
                      {dataObj.viewFarmType === "repay" &&
                        tokenData[0].approved && (
                          <div>
                            <button
                              className="btn btn-subtab-darker-ctm btn-block active"
                              //    onClick={() => repay(0)}
                              //   mat-raised-button
                              //   matTooltipclassName="custom-tooltip"
                            >
                              SUBMIT
                            </button>
                          </div>
                        )}

                      {dataObj.viewFarmType === "repay" &&
                        !tokenData[0].approved && (
                          <div>
                            <button
                              className="btn btn-subtab-darker-ctm btn-block active"
                              //    onClick={() => enableBorrowCollateral()}
                              //   mat-raised-button
                              //   matTooltip="Enable"
                              //   matTooltipclassName="custom-tooltip"
                            >
                              APPROVE
                            </button>
                          </div>
                        )}

                      {dataObj.viewFarmType === "lend" &&
                        tokenData[0].approved && (
                          <div>
                            <button
                              style={{ marginTop: "1rem" }}
                              className="btn btn-subtab-darker-ctm btn-block active"
                              disabled={tokenData[0].tokenBorrowBalance > 0}
                              //    onClick={() => lend(0)}
                              //   mat-raised-button
                              //   matTooltipclassName="custom-tooltip"
                            >
                              SUBMIT
                            </button>
                          </div>
                        )}

                      {dataObj.viewFarmType === "lend" &&
                        !tokenData[0].approved && (
                          <div>
                            <button
                              style={{ marginTop: "1rem" }}
                              className="btn btn-subtab-darker-ctm btn-block active"
                              //   onClick={() => enableBorrowCollateral()}
                              //   mat-raised-button
                              //   matTooltip="Enable"
                              //   matTooltipclassName="custom-tooltip"
                            >
                              APPROVE
                            </button>
                          </div>
                        )}

                      {dataObj.viewFarmType === "lendWithdraw" &&
                        tokenData[0].approved && (
                          <div>
                            <button
                              style={{ marginTop: "1rem" }}
                              className="btn btn-subtab-darker-ctm btn-block active"
                              //    onClick={() => lendWithdraw(0)}
                              //   mat-raised-button
                              //   matTooltipclassName="custom-tooltip"
                            >
                              SUBMIT
                            </button>
                          </div>
                        )}
                      {dataObj.viewFarmType === "lendWithdraw" &&
                        !tokenData[0].approved && (
                          <div>
                            <button
                              style={{ marginTop: "1rem" }}
                              className="btn btn-subtab-darker-ctm btn-block active"
                              onClick={() => enableBorrowCollateral()}
                              //   mat-raised-button
                              //   matTooltip="Enable"
                              //   matTooltipclassName="custom-tooltip"
                            >
                              APPROVE
                            </button>
                          </div>
                        )}

                      {dataObj.subtabType === "stake" && (
                        <div className="mt20 font-weight-light">
                          <div className="calculation py-1">
                            <span className="">
                              Collateral Ratio{" "}
                              <sup>
                                <span
                                  className="step"
                                  // mat-raised-button
                                  // matTooltip="Supplied token can mint this percent of its value as USDO"
                                  // matTooltipclassName="custom-tooltip"
                                  style={{
                                    paddingLeft: "0px",
                                  }}
                                >
                                  ?
                                </span>
                              </sup>{" "}
                            </span>
                            <span className="font-weight-light">
                              {toDecimal(tokenData[1].collateralFactor, 0)}%
                            </span>
                          </div>
                          <div className="calculation py-1">
                            <span className="">
                              Collateral Price
                              <sup>
                                <span
                                  className="step"
                                  // mat-raised-button
                                  // matTooltip="Collateral token price"
                                  // matTooltipclassName="custom-tooltip"
                                  style={{
                                    paddingLeft: "0px",
                                  }}
                                >
                                  ?
                                </span>
                              </sup>{" "}
                            </span>
                            <span className="font-weight-light">
                              $
                              {localeString(
                                toDecimal(tokenData[1].priceUsd, 4),
                                4
                              )}
                            </span>
                          </div>
                          <div className="calculation py-1">
                            <span className="">
                              Total Value Locked{" "}
                              <sup>
                                <span
                                  className="step"
                                  // mat-raised-button
                                  // matTooltip="Total value locked in this vault"
                                  // matTooltipclassName="custom-tooltip"
                                  style={{
                                    paddingLeft: "0px",
                                  }}
                                >
                                  ?
                                </span>
                              </sup>{" "}
                            </span>
                            <span className="font-weight-light">
                              ${localeString(totalCashDeployed, 0)}
                            </span>
                          </div>
                        </div>
                      )}

                      {dataObj.subtabType === "mint" && (
                        <div className="mt20 font-weight-light">
                          {tokenData[1].symbol !== "puffLINA" &&
                            tokenData[1].symbol !== "puffCake" && (
                              <div className="calculation py-1">
                                <span className="">
                                  Mint Fee{" "}
                                  <sup>
                                    <span
                                      className="step"
                                      // mat-raised-button
                                      // matTooltip="A mint fee is added to your total USDO borrowing"
                                      // matTooltipclassName="custom-tooltip"
                                      style={{
                                        paddingLeft: "0px",
                                      }}
                                    >
                                      ?
                                    </span>
                                  </sup>{" "}
                                </span>
                                {tokenData[1].symbol !== "GFX" &&
                                  tokenData[1].symbol !== "HOTCROSS" &&
                                  tokenData[1].symbol !== "bwJUP" &&
                                  tokenData[1].symbol !== "HYVE" && (
                                    <span className="font-weight-light">
                                      0.5%
                                    </span>
                                  )}
                                {tokenData[1].symbol === "GFX" ||
                                  tokenData[1].symbol === "HOTCROSS" ||
                                  tokenData[1].symbol === "bwJUP" ||
                                  (tokenData[1].symbol === "HYVE" && (
                                    <span>1%</span>
                                  ))}
                              </div>
                            )}
                          <div className="calculation py-1">
                            <span className="">
                              Vault Utilization{" "}
                              <sup>
                                <span
                                  className="step"
                                  // mat-raised-button
                                  // matTooltip="100% means no more USDO can be minted against this vault"
                                  // matTooltipclassName="custom-tooltip"
                                  style={{
                                    paddingLeft: "0px",
                                  }}
                                >
                                  ?
                                </span>
                              </sup>{" "}
                            </span>
                            <span className="font-weight-light">
                              {/* {{ toDecimal((tokenData[0].totalErc20Borrows) / (tokenData[0].totalErc20Supply) * 100, 2) }}% */}
                            </span>
                          </div>

                          <div className="calculation py-1">
                            <span className="">
                              Liquidity{" "}
                              <sup>
                                <span
                                  className="step"
                                  // mat-raised-button
                                  // matTooltip="The amount of USDO available in this vault"
                                  // matTooltipclassName="custom-tooltip"
                                  style={{
                                    paddingLeft: "0px",
                                  }}
                                >
                                  ?
                                </span>
                              </sup>{" "}
                            </span>
                            <span className="font-weight-light">
                              {localeString(
                                toDecimal(tokenData[0].availableBorrow, 2),
                                2
                              )}
                              {tokenData[0].symbol}
                            </span>
                          </div>
                          <div className="calculation py-1">
                            <span className="">USDO borrowed by all users</span>
                            <span className="font-weight-light">
                              {localeString(
                                toDecimal(tokenData[0].totalErc20Borrows, 2),
                                2
                              )}{" "}
                              {tokenData[0].symbol}
                            </span>
                          </div>

                          <div className="calculation">
                            <div>
                              {tokenData[1].symbol === "LIME" && (
                                <a
                                  className="description asset"
                                  href="https://limerekt.opendao.io/"
                                  target="_blank"
                                >
                                  All Positions
                                </a>
                              )}
                              {tokenData[1].symbol === "OCP" && (
                                <a
                                  className="description asset"
                                  href="https://ocprekt.opendao.io/"
                                  target="_blank"
                                >
                                  All Positions
                                </a>
                              )}
                              {tokenData[1].symbol === "pOPEN" && (
                                <a
                                  className="description asset"
                                  href="https://popenrekt.opendao.io/"
                                  target="_blank"
                                >
                                  All Positions
                                </a>
                              )}
                              {tokenData[1].symbol === "LAND" && (
                                <a
                                  className="description asset"
                                  href="https://landrekt.opendao.io/"
                                  target="_blank"
                                >
                                  All Positions
                                </a>
                              )}
                              {tokenData[1].symbol === "ROSN" && (
                                <a
                                  className="description asset"
                                  href="https://rosnrekt.opendao.io/"
                                  target="_blank"
                                >
                                  All Positions
                                </a>
                              )}
                              {tokenData[1].symbol === "GFX" && (
                                <a
                                  className="description asset"
                                  href="https://gfxrekt.opendao.io/"
                                  target="_blank"
                                >
                                  All Positions
                                </a>
                              )}
                              {tokenData[1].symbol === "HOTCROSS" && (
                                <a
                                  className="description asset"
                                  href="https://hotcrossrekt.opendao.io/"
                                  target="_blank"
                                >
                                  All Positions
                                </a>
                              )}
                              {tokenData[1].symbol === "puffCake" && (
                                <a
                                  className="description asset"
                                  href="https://cakerekt.ocp.finance/"
                                  target="_blank"
                                >
                                  All Positions
                                </a>
                              )}
                              {tokenData[1].symbol === "puffLINA" && (
                                <a
                                  className="description asset"
                                  href="https://linarekt.ocp.finance/"
                                  target="_blank"
                                >
                                  All Positions
                                </a>
                              )}
                              {tokenData[1].symbol === "bwJUP" && (
                                <a
                                  className="description asset"
                                  href="https://juprekt.opendao.io/"
                                  target="_blank"
                                >
                                  All Positions
                                </a>
                              )}
                              {tokenData[1].symbol === "HYVE" && (
                                <a
                                  className="description asset"
                                  href="https://hyverekt.opendao.io/"
                                  target="_blank"
                                >
                                  All Positions
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="calculation">
                            <div>
                              {tokenData[1].symbol === "LIME" && (
                                <a
                                  className="description asset"
                                  href="https://mint.opendao.io/#/admin/0x2240e2A6805b31Bd1BC03bd5190f644334F53b9A"
                                  target="_blank"
                                >
                                  Unitroller
                                </a>
                              )}
                              {tokenData[1].symbol === "OCP" && (
                                <a
                                  className="description asset"
                                  href="https://mint.opendao.io/#/admin/0xA21d5c762E13FcfC8541558dAce9BA54f1F6176F"
                                  target="_blank"
                                >
                                  Unitroller
                                </a>
                              )}
                              {tokenData[1].symbol === "pOPEN" && (
                                <a
                                  className="description asset"
                                  href="https://mint.opendao.io/#/admin/0x5AcEc8328f41145562548Dd335556c12559f2913"
                                  target="_blank"
                                >
                                  Unitroller
                                </a>
                              )}
                              {tokenData[1].symbol === "LAND" && (
                                <a
                                  className="description asset"
                                  href="https://mint.opendao.io/#/admin/0xdaD9b52fE5ffd4331aaA02321f1ffa400C827EC8"
                                  target="_blank"
                                >
                                  Unitroller
                                </a>
                              )}
                              {tokenData[1].symbol === "ROSN" && (
                                <a
                                  className="description asset"
                                  href="https://mint.opendao.io/#/admin/0x52CA265749527d86C4666788116b0CDF6012bD5F"
                                  target="_blank"
                                >
                                  Unitroller
                                </a>
                              )}
                              {tokenData[1].symbol === "GFX" && (
                                <a
                                  className="description asset"
                                  href="https://mint.opendao.io/#/admin/0x2388E81Ba9f4360e359D88A4513055c5D12a96bA"
                                  target="_blank"
                                >
                                  Unitroller
                                </a>
                              )}
                              {tokenData[1].symbol === "HOTCROSS" && (
                                <a
                                  className="description asset"
                                  href="https://mint.opendao.io/#/admin/0x8ee2C57434cECfE9501efdB112CfE73adb3c6E68"
                                  target="_blank"
                                >
                                  Unitroller
                                </a>
                              )}
                              {tokenData[1].symbol === "puffCake" && (
                                <a
                                  className="description asset"
                                  href="https://mint.opendao.io/#/admin/0x35912c80AfeD3BC925bdA3B4Ee5B0085FB36891e"
                                  target="_blank"
                                >
                                  Unitroller
                                </a>
                              )}

                              {tokenData[1].symbol === "puffLINA" && (
                                <a
                                  className="description asset"
                                  href="https://mint.opendao.io/#/admin/0x118122C7de0Fa0DE3e4017fD9eA6C422438A46C6"
                                  target="_blank"
                                >
                                  Unitroller
                                </a>
                              )}
                              {tokenData[1].symbol === "bwJUP" && (
                                <a
                                  className="description asset"
                                  href="https://mint.opendao.io/#/admin/0x88826F399CB7a843fF84f24c0b7662cfF17F45C0"
                                  target="_blank"
                                >
                                  Unitroller
                                </a>
                              )}
                              {tokenData[1].symbol === "HYVE" && (
                                <a
                                  className="description asset"
                                  href="https://mint.opendao.io/#/admin/0x8C3f575F0E4E6baB86741866910851E18ead4aDB"
                                  target="_blank"
                                >
                                  Unitroller
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {dataObj.subtabType === "lend" && (
                        <div className="mt20 font-weight-light">
                          <div className="calculation py-1">
                            <span className="">
                              Utilization Rate{" "}
                              <sup>
                                <span
                                  className="step"
                                  // mat-raised-button
                                  // matTooltip="100% means no more USDO can be minted against this vault"
                                  // matTooltipclassName="custom-tooltip"
                                  style={{
                                    paddingLeft: "0px",
                                  }}
                                >
                                  ?
                                </span>
                              </sup>{" "}
                            </span>
                            <span className="font-weight-light">
                              {toDecimal(tokenData[0].utilizationRate * 100, 2)}
                              %
                            </span>
                          </div>
                          <div className="calculation py-1">
                            <span className="">
                              Liquidity{" "}
                              <sup>
                                <span
                                  className="step"
                                  // mat-raised-button
                                  // matTooltip="The amount of USDO available in this vault"
                                  // matTooltipclassName="custom-tooltip"
                                  style={{
                                    paddingLeft: "0px",
                                  }}
                                >
                                  ?
                                </span>
                              </sup>{" "}
                            </span>
                            <span className="font-weight-light">
                              {localeString(
                                toDecimal(tokenData[0].availableBorrow, 2),
                                2
                              )}
                              {tokenData[0].symbol}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* MINT&LIMIT BELOW */}
              <div className="col-lg-6 col-md-6 py5 px0 bg-brand">
                <div className="py5 px15 d-block d-lg-none">
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="px15 py10 text-left">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="progress-bar--container">
                        <label className="mr-1" style={{ fontWeight: 400 }}>
                          Mint&nbsp;Limit&nbsp;
                        </label>
                        <div className="progress progress-sm">
                          <div
                            className="progress-bar progress-success"
                            role="progressbar"
                          ></div>
                          <label
                            className="progress-percent ml-1"
                            style={{ fontWeight: 400 }}
                          >
                            {toDecimal(setupData.sliderPercentage, 2)}%
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px15 py5 font-weight-light">
                    <div className="text-secondary-ctm font-weight-bold text-left my-3">
                      Your Position
                    </div>
                    <div className="calculation py-1">
                      <span className="text-left">
                        Tokens Deposited{" "}
                        <sup>
                          <span
                            className="step"
                            // mat-raised-button
                            // matTooltip="Number of collateral tokens deposited"
                            // matTooltipclassName="custom-tooltip"
                            style={{ paddingLeft: "0px" }}
                          >
                            ?
                          </span>
                        </sup>
                      </span>
                      <span className="text-right font-weight-light">
                        {localeString(
                          toDecimal(tokenData[1].cTokenSupplyBalance, 2),
                          2
                        )}
                        {tokenData[1].symbol}
                      </span>
                    </div>
                    <div className="calculation py-1">
                      <span className="">
                        Total Value
                        <sup>
                          <span
                            className="step"
                            // mat-raised-button
                            // matTooltip="Value of Collateral Supplied"
                            // matTooltipclassName="custom-tooltip"
                            style={{ paddingLeft: "0px" }}
                          >
                            ?
                          </span>
                        </sup>
                      </span>
                      <span className="font-weight-light">
                        $
                        {localeString(
                          toDecimal(tokenData[1].cTokenSupplyBalanceUSD, 2),
                          2
                        )}
                      </span>
                    </div>
                    <div className="calculation mt-3 py-1">
                      <span className="">
                        USDO Supplied{" "}
                        <sup>
                          <span
                            className="step"
                            // mat-raised-button
                            // matTooltip="USDO you have supplied"
                            // matTooltipclassName="custom-tooltip"
                            style={{ paddingLeft: "0px" }}
                          >
                            ?
                          </span>
                        </sup>
                      </span>
                      <span className="font-weight-light">
                        $
                        {localeString(
                          toDecimal(tokenData[0].cTokenSupplyBalanceUSD, 2),
                          2
                        )}
                      </span>
                    </div>
                    <div className="calculation py-1">
                      <span className="">
                        USDO Minted{" "}
                        <sup>
                          <span
                            className="step"
                            // mat-raised-button
                            // matTooltip="USDO you have minted from this vault"
                            // matTooltipclassName="custom-tooltip"
                            style={{ paddingLeft: "0px" }}
                          >
                            ?
                          </span>
                        </sup>
                      </span>
                      <span className="font-weight-light">
                        $
                        {localeString(
                          toDecimal(tokenData[0].tokenBorrowBalance, 2),
                          2
                        )}
                      </span>
                    </div>
                    <div className="calculation py-1">
                      <span className="">
                        Available to Mint{" "}
                        <sup>
                          <span
                            className="step"
                            // mat-raised-button
                            // matTooltip="Based upon supplied collateral, remaining you can mint"
                            // matTooltipclassName="custom-tooltip"
                            style={{ paddingLeft: "0px" }}
                          >
                            ?
                          </span>
                        </sup>
                      </span>
                      <span className="font-weight-light">
                        $
                        {localeString(
                          toDecimal(
                            setupData.availabletoBorrowUser /
                              tokenData[0].priceUsd,
                            2
                          ),
                          2
                        )}
                      </span>
                    </div>
                    {tokenData[1].symbol === "HOTCROSS" && (
                      <div className="calculation py-1">
                        <span className="">
                          Claim Rewards{" "}
                          <sup>
                            <span
                              className="step"
                              // mat-raised-button
                              // matTooltip="Rewards claimable from this lending market"
                              // matTooltipclassName="custom-tooltip"
                              style={{ paddingLeft: "0px" }}
                            >
                              ?
                            </span>
                          </sup>
                        </span>
                        <div>
                          <button
                            className="btn btn-subtab-darker-ctm btn-block active"
                            style={{
                              width: "auto",
                              marginLeft: "auto",
                            }}
                            // onClick={() => collectCompEarned()}
                            //   mat-raised-button
                            //   matTooltip="Claim your rewards"
                            //   matTooltipclassName="custom-tooltip"
                          >
                            Claim Rewards
                          </button>
                        </div>
                      </div>
                    )}

                    {tokenData[1].symbol && (
                      <div className="row py5 px15 text-left font-weight-light">
                        <div className="col-md-12">
                          <div className="text-secondary-ctm font-weight-bold text-left my-3">
                            Wallet Balances
                          </div>
                          <div
                            className="row py-1"
                            style={{ fontSize: "0.9em" }}
                          >
                            <div className="col-md-12">
                              <div className="balances">
                                <div className="row">
                                  <div className="col-md-6">
                                    <img
                                      className="token-logos"
                                      style={{
                                        maxHeight: "28px",
                                      }}
                                      src={`/assets/img/${tokenData[1].symbol}_logo.png`}
                                      // onError="this.onerror=null;this.src='assets/img/binance-coin-logo.png';"
                                      alt="BUSD logo"
                                    />
                                    {/* {{tokenData[1].symbol}} */}
                                  </div>
                                  <div className="col-md-6 text-right">
                                    {localeString(
                                      toDecimal(tokenData[1].tokenBalance, 2),
                                      2
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div
                            className="row py-1"
                            style={{ fontSize: "0.9em" }}
                          >
                            <div className="col-md-12">
                              <div className="balances">
                                <div className="row">
                                  <div className="col-md-6">
                                    <img
                                      className="token-logos"
                                      style={{
                                        maxHeight: "28px",
                                      }}
                                      src={`/assets/img/${tokenData[0].symbol}_logo.png`}
                                      // onError="this.onerror=null;this.src='assets/img/binance-coin-logo.png';"
                                      alt={`${tokenData[0].symbol} logo`}
                                    />
                                    {tokenData[0].symbol}
                                  </div>
                                  <div className="col-md-6 text-right">
                                    {localeString(
                                      toDecimal(tokenData[0].tokenBalance, 2),
                                      2
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* MINT&LIMIT ABOVE */}
            </div>
          )}
          {/*  */}
          {/*  */}
        </div>
      </div>
    </>
  );
};
