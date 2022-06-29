import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import NumberFormat from "react-number-format";
import PuffLoader from "react-spinners/PuffLoader";
import React, { useEffect, useState, useCallback, CSSProperties } from "react";
import { useMarkets } from "../../lib/hooks/useMarkets";
import { useMarketsUser } from "../../lib/hooks/useMarketsUser";
import { Asset } from "../../lib/types";
import { DEFAULT_GAS_PRICE } from "../../config";

import Switch from "react-switch";
import { Button, Input } from "@chakra-ui/react";
import { Progress } from 'react-sweet-progress';

import {
  getAbsoluteValueWithDecimals,
  localeString,
  toBN,
  toDecimal,
  weiToNum,
  tokenToDecimals,
} from "../../lib/utils";

import {
  useComptrollerContract,
  useCTokenContract,
  usePriceOracleProxyContract,
  useTokenContract,
} from "../../contracts/getters";
import { AuthContext } from "../utils/AuthContext";

interface Props {
  data: string;
}

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export const TxnSection: React.FC<Props> = (props: Props) => {

  const [stakingInput, setStakingInput] = useState<string>("");
  const [withdrawStakingInput, setWithdrawStakingInput] = useState<string>("");
  const [mintInput, setMintInput] = useState<string>("");
  const [repayInput, setRepayInput] = useState<string>("");
  const [lendInput, setLendInput] = useState<string>("");
  const [userBorrowLimit, setUserBorrowLimit] = useState<any>();
  const [userBorrowPercent, setBorrowPercent] = useState<any>();


  const [withdrawLendingInput, setWithdraLendingInput] = useState<string>("");

  const { account } = React.useContext(AuthContext);
  const { markets } = useMarkets();
  const { userMarketInfo, userTotalBorrowLimit, userTotalBorrowBalance } = useMarketsUser();

  const [lendingMarketData, setLendingMarketData] = useState<any>({});
  const [stakingMarketData, setStakingMarketData] = useState<any>({});
  const [lendingUserMarketData, setLendingUserMarketData] = useState<any>({});
  const [stakingUserMarketData, setStakingUserMarketData] = useState<any>({});
  const [marketData, setMarketData] = useState<any>({});
  const [isEnableCollateral, setIsEnableCollateral] = useState<any>();

  const [showPuffCakeVaultContent, setShowPuffCakeVaultContent] =
    useState<boolean>(true);

  // let web3Contract = useWeb3Contract(selectedComp);

  const [oracleAddress, setOracleAddress] = useState<string>("");
  let priceOracleProxyContract = usePriceOracleProxyContract(oracleAddress);

  let lendingTokenContract = useTokenContract(
    lendingMarketData.underlyingAddress
  );
  let stakingTokenContract = useTokenContract(
    stakingMarketData.underlyingAddress
  );
  let lendingCTokenContract = useCTokenContract(lendingMarketData.address);
  let stakingCTokenContract = useCTokenContract(stakingMarketData.address);

  const [dataObj, setDataObj] = useState({
    subtabType: "stake",
    viewFarmType: "stake",
  });
  const [formData, setFormData] = useState<any>({});
  const [isEnabledStake, setIsEnabledStake] = useState<any>(false);
  const [isEnabledLend, setIsEnabledLend] = useState<any>(false);
  let comptrollerContract = useComptrollerContract(props.data);

  useEffect(() => {
    // const currentComp = localStorage.getItem("currentComp");
    // if (currentComp && markets.length) {
    // const compAdd = JSON.parse(currentComp);
    let marketData = markets.filter(
      (element) =>
        element.compAddress.toLowerCase() === props.data.toLowerCase()
    );
    if (marketData.length) {
      setMarketData(marketData[0]);
      setLendingMarketData(marketData[0]);
      setStakingMarketData(marketData[1]);
    }
    // }
  }, [props.data, userMarketInfo, account]);

  useEffect(() => {
    (async () => {
      let marketData = userMarketInfo.filter(
        (element) =>
          element.compAddress.toLowerCase() === props.data.toLowerCase()
      );
      if (marketData.length) {
        setLendingUserMarketData(marketData[0]);
        setStakingUserMarketData(marketData[1]);
      }
      setIsEnabledStake(stakingUserMarketData.isEnabled);
      setIsEnabledLend(lendingUserMarketData.isEnabled);
      let borrowLimit = new BigNumber(userTotalBorrowLimit).div((new BigNumber(10).pow(lendingMarketData.underlyingDecimal)));
      let a= (new BigNumber(userTotalBorrowLimit).div(1e18)).div(new BigNumber(userTotalBorrowBalance).div(lendingMarketData.underlyingDecimal))
      setUserBorrowLimit(a)
      setBorrowPercent(new BigNumber(userTotalBorrowBalance).div(userTotalBorrowLimit).times(100));
      if (account && marketData.length) {
        const assetsIn = account
          ? await comptrollerContract.methods
              .getAssetsIn(account?.address)
              .call()
          : [];

        const collateral = assetsIn
          .map((address: any) => address.toLowerCase())
          .includes(marketData[1].address.toLowerCase());
        setIsEnableCollateral(collateral);
      }
    })();
  }, [userMarketInfo, account, props.data]);

  const supplyMax = (i: number, p: number) => {
    let amount = new BigNumber(stakingUserMarketData.walletBalance).div(
      new BigNumber(10).pow(stakingMarketData.underlyingDecimal)
    );
    let inp = amount.multipliedBy(new BigNumber(p)).toFixed(2, 1);
    setStakingInput(inp);
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
      let amount = new BigNumber(stakingUserMarketData.supplyBalanceUSD);
      let liquidity = new BigNumber(stakingUserMarketData.availableLiquidity);
      if (liquidity.isGreaterThanOrEqualTo(amount)) {
        let inp = amount
          .times(new BigNumber(p))
        setWithdrawStakingInput(inp.toFixed())
      } else {
        let inp = liquidity
          .times(new BigNumber(p))
        setWithdrawStakingInput(inp.toFixed())
      }
  };

  const borrowMax = (i: number, p: number) => {
    //   let amount = new BigNumber(availabletoBorrowUser / markets[i].priceUsd);
    //   let liquidity = new BigNumber(markets[i].availableBorrow);
    //   let obj = { ...farmDataObj };
    //   if (liquidity.isGreaterThanOrEqualTo(amount)) {
    //     obj["mintInputAmt"] = amount.multipliedBy(toBN(p)).toFixed(2);
    //   } else {
    //     obj["mintInputAmt"] = liquidity.multipliedBy(toBN(p)).toFixed(2);
    //   }
    //   setFarmDataObj(obj);
  };

  const lendMax = (i: number, p: number) => {
    let amount = new BigNumber(lendingUserMarketData.walletBalance).div(
      new BigNumber(10).pow(lendingMarketData.underlyingDecimal)
    );
    let inp = amount.multipliedBy(new BigNumber(p)).toFixed(2, 1);
    setLendInput(inp);
  };

  const repayMax = (i: any | number, p: string | number | BigNumber) => {
    //   let userBalanceBN = new BigNumber(markets[i].tokenBalanceBN);
    //   let decimals = markets[i].erc20Decimals;
    //   let userBalance = new BigNumber(userBalanceBN.div(10 ** decimals));
    //   let maxRepayBalance = markets[i].tokenBorrowBalance;
    //   let amount;
    //   if (maxRepayBalance < userBalance) {
    //     amount = new BigNumber(maxRepayBalance).multipliedBy(toBN(p));
    //     setRepayMaxAmount(true);
    //   } else {
    //     amount = new BigNumber(userBalance).multipliedBy(toBN(p));
    //     setRepayMaxAmount(false);
    //   }
    //   let obj = { ...farmDataObj };
    //   obj["repayInputAmt"] = amount.toFixed(decimals);
    //   setFarmDataObj(obj);
  };

  const lendWithdrawMax = (i: number, p: number) => {
    let amount = new BigNumber(lendingUserMarketData.supplyBalanceUSD);
    let liquidity = new BigNumber(lendingUserMarketData.availableLiquidity);
    if (liquidity.isGreaterThanOrEqualTo(amount)) {
      let inp = amount
        .times(new BigNumber(p))
      setWithdraLendingInput(inp.toFixed())
    } else {
      let inp = liquidity
        .times(new BigNumber(p))
      setWithdraLendingInput(inp.toFixed())
    }
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

  const getUserBalanceUSD = (amount: any, price) => {
    return new BigNumber(amount).times(price);
  };


  /**
   * Supply
   */
  const handleSupply = async () => {
    // setIsLoading(true);
    try {
      const overrides = {
        gasPrice: ethers.utils.parseUnits(DEFAULT_GAS_PRICE.toString(), "gwei"),
        gasLimit: 5000000,
      };
      await stakingCTokenContract.methods
        .mint(
          new BigNumber(stakingInput)
            .times(new BigNumber(10).pow(stakingMarketData.underlyingDecimal))
            .toString(10)
        )
        .send({ from: account?.address || undefined, ...overrides });
    } catch (error) {
      console.log("supply error :>> ", error);
    }
    setStakingInput("");

  };

  /**
   * withdraw
   */
  const handleWithdraw = async () => {
    // setIsLoading(true);
    try {
      // const vTokenBalance = await stakingCTokenContract.methods.balanceOf(account?.address).call();
      // await stakingCTokenContract.methods.redeem(vTokenBalance).send({ from: account?.address });
      await stakingCTokenContract.methods
        .redeemUnderlying(
          new BigNumber(withdrawStakingInput)
            .times(new BigNumber(10).pow(stakingMarketData.underlyingDecimal))
            .integerValue()
            .toString(10)
        )
        .send({ from: account?.address || undefined, gas: 3000000 });
      setWithdrawStakingInput("");
      // onCancel();
    } catch (error) {
      console.log("supply error :>> ", error);
    }
  };

  /**
   * Borrow
   */
  const handleMint = async () => {
    // setIsLoading(true);
    try {
      const overrides = {
        gasPrice: ethers.utils.parseUnits(DEFAULT_GAS_PRICE.toString(), "gwei"),
        gasLimit: 3000000,
      };

      await lendingCTokenContract.methods
        .borrow(
          new BigNumber(mintInput)
            .times(new BigNumber(10).pow(lendingMarketData.underlyingDecimal))
            .toString(10)
        )
        .send({ from: account?.address || undefined, ...overrides });
      setMintInput("");
      // onCancel();
    } catch (error) {
      console.log("supply error :>> ", error);
    }
  };

  /**
   * withdraw
   */
  const handleRepay = async () => {
    // setIsLoading(true);
    try {
      await lendingCTokenContract.methods
        .repayBorrow(
          new BigNumber(repayInput)
            .times(new BigNumber(10).pow(lendingMarketData.underlyingDecimal))
            .toString(10)
        )
        .send({ from: account?.address || undefined });
      setRepayInput("");
      // onCancel();
    } catch (error) {
      console.log("supply error :>> ", error);
    }
  };

  /**
   * withdraw
   */
  const handleLend = async () => {
    // setIsLoading(true);
    try {
      await lendingCTokenContract.methods
        .mint(
          new BigNumber(lendInput)
            .times(new BigNumber(10).pow(lendingMarketData.underlyingDecimal))
            .toString(10)
        )
        .send({ from: account?.address || undefined });
      setLendInput("");
      // onCancel();
    } catch (error) {
      console.log("supply error :>> ", error);
    }
  };

  /**
   * withdraw
   */
  const handleWithdrawLend = async () => {
    // setIsLoading(true);
    try {
      await lendingCTokenContract.methods
        .redeemUnderlying(
          new BigNumber(withdrawLendingInput)
            .times(new BigNumber(10).pow(lendingMarketData.underlyingDecimal))
            .integerValue()
            .toString(10)
        )
        .send({ from: account?.address || undefined, gas: 3000000 });
      setWithdraLendingInput("");
      // onCancel();
    } catch (error) {
      console.log("supply error :>> ", error);
    }
  };

  const enterExitMarket = async (value: any) => {
    try {
      if (isEnableCollateral) {
        await comptrollerContract.methods
          .exitMarket(stakingUserMarketData.address)
          .send({ from: account?.address || undefined });
        setIsEnableCollateral(value);
      } else {
        await comptrollerContract.methods
          .enterMarkets([stakingUserMarketData.address])
          .send({ from: account?.address || undefined });
        setIsEnableCollateral(value);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Approve underlying token
   */
  const onApprove = useCallback(
    async (type) => {
      try {
        if (type == "stake") {
          await stakingTokenContract.methods
            .approve(
              stakingMarketData.address,
              new BigNumber(2).pow(256).minus(1).toString(10)
            )
            .send({ from: account?.address || undefined });
          setIsEnabledStake(true);
        } else {
          await lendingTokenContract.methods
            .approve(
              lendingMarketData.address,
              new BigNumber(2).pow(256).minus(1).toString(10)
            )
            .send({ from: account?.address || undefined });
          setIsEnabledLend(true);
        }
      } catch (error) {
        console.log("approve error :>> ", error);
      }
    },
    [account]
  );

  const enableSupplyCollateral = () => {
    onApprove("stake");
  };

  const enableBorrowCollateral = () => {
    onApprove("lend");
  };
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
         {/* <PuffLoader color={'#BB76D8'} loading={true} cssOverride={override} size={150} /> */}

          <div
            className="row bg-white vault__subhead"
            data-toggle="collapse"
            onClick={() => {
              setShowPuffCakeVaultContent(!showPuffCakeVaultContent);
            }}
            style={{ cursor: "pointer" }}
            aria-expanded="true"
          >
            <div className="col-md-3 my-auto">
              <div className="vault__subhead-label">
                {markets.length && (
                  <img
                    style={{
                      maxHeight: "25px",
                      marginTop: "-4.5px",
                    }}
                    src={`/assets/img/${stakingMarketData.underlyingSymbol}_logo.png`}
                    alt={`${stakingMarketData.underlyingSymbol} logo`}
                  />
                )}  {stakingMarketData.underlyingSymbol}
              </div>
            </div>
            <div className="col-md-3 my-auto">
              <div className="vault__subhead-label">
                {localeString(
                  toDecimal(stakingUserMarketData.walletBalanceUSD, 2),
                  2
                )}  {stakingMarketData.underlyingSymbol}
              </div>
              <div className="vault__subhead-text">Wallet</div>
              <div className="vault__subhead-label">
                {
                  localeString(
                    toDecimal(stakingUserMarketData.supplyBalanceUSD, 2),
                    2
                  ) //markets[1].cTokenSupplyBalance
                }  {stakingMarketData.underlyingSymbol}
              </div>
              <div className="vault__subhead-text">Deposited</div>
            </div>
            <div className="col-md-3 my-auto">
              <div className="vault__subhead-label" style={{ color: "black" }}>
                <i className="fa fa-minus"></i>
                {getAbsoluteValueWithDecimals(lendingMarketData.borrowApy, 2)}%
              </div>
            </div>
            <div className="col-md-3 my-auto">
              <div
                className="vault__subhead-label"
                style={{ color: "#BB76D8" }}
              >
                <i className="fa fa-plus"></i>
                {getAbsoluteValueWithDecimals(lendingMarketData.supplyApy, 2)}%
              </div>
            </div>
          </div>
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
                      {stakingMarketData.underlyingSymbol && (
                        <div className="row">
                          <div className="col-4 p-0">
                            <div className="px-3 py-2">
                              <button
                                className={`btn btn-lg btn-tab btn-dark-ctm btn-block ${
                                  dataObj.subtabType === "stake" ? "active" : ""
                                }`}
                                onClick={() => viewStakeTab()}
                              >
                                Stake {stakingMarketData.underlyingSymbol}
                              </button>
                            </div>
                          </div>
                          <div className="col-4 p-0">
                            <div className="px-3 py-2">
                              <Button
                                className={`btn btn-lg btn-tab btn-dark-ctm btn-block ${
                                  dataObj.subtabType === "mint" ? "active" : ""
                                }`}
                                onClick={() => viewMintTab()}
                              >
                                Mint {lendingMarketData.underlyingSymbol}
                              </Button>
                            </div>
                          </div>
                          <div className="col-4 p-0">
                            <div className="px-3 py-2">
                              <Button
                                className={`btn btn-lg btn-tab btn-dark-ctm btn-block ${
                                  dataObj.subtabType === "lend" ? "active" : ""
                                }`}
                                onClick={() => viewLendTab()}
                              >
                                Lend {lendingMarketData.underlyingSymbol}
                              </Button>
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
                                ${
                                  dataObj.viewFarmType == "stake"
                                    ? "active"
                                    : ""
                                }`}
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
                                // disabled={
                                //   true //markets[0].tokenBorrowBalance > 0
                                // }
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
                                <Input
                                  className="form-control form-control-lg text-center"
                                  placeholder="0"
                                  value={stakingInput}
                                  onChange={(e) =>
                                    setStakingInput(e.target.value)
                                  }
                                />
                                <Button
                                  className="max-btn"
                                  isDisabled={false}
                                  onClick={() => supplyMax(1, 1)}
                                >
                                  MAX
                                </Button>
                                <Button
                                  className="max-btn"
                                  isDisabled={false}
                                  onClick={() => supplyMax(1, 0.75)}
                                >
                                  75%
                                </Button>
                                <Button
                                  className="max-btn"
                                  isDisabled={false}
                                  onClick={() => supplyMax(1, 0.5)}
                                >
                                  50%
                                </Button>
                                <Button
                                  className="max-btn"
                                  isDisabled={false}
                                  onClick={() => supplyMax(1, 0.25)}
                                >
                                  25%
                                </Button>
                              </div>
                            )}
                            {dataObj.viewFarmType === "withdraw" && (
                              <div className="tab-spacer">
                                <Input
                                  // type="text"
                                  className="form-control form-control-lg text-center"
                                  // placeholder="0"
                                  value={withdrawStakingInput}
                                  onChange={(e) =>
                                    setWithdrawStakingInput(e.target.value)
                                  }
                                ></Input>
                                <Button
                                  onClick={() => withdrawMax(1, 1)}
                                  className="max-btn"
                                >
                                  MAX
                                </Button>
                                <Button
                                  onClick={() => withdrawMax(1, 0.75)}
                                  className="max-btn"
                                >
                                  75%
                                </Button>
                                <Button
                                  onClick={() => withdrawMax(1, 0.5)}
                                  className="max-btn"
                                >
                                  50%
                                </Button>
                                <Button
                                  onClick={() => withdrawMax(1, 0.25)}
                                  className="max-btn"
                                >
                                  25%
                                </Button>
                              </div>
                            )}
                            {dataObj.viewFarmType === "mint" && (
                              <div className="tab-spacer">
                                <Input
                                  type="text"
                                  className="form-control form-control-lg text-center"
                                  placeholder="0"
                                  value={mintInput}
                                  onChange={(e) => setMintInput(e.target.value)}
                                ></Input>
                                <Button
                                  onClick={() => borrowMax(0, 0.9)}
                                  className="max-btn"
                                >
                                  MAX
                                </Button>
                                <Button
                                  onClick={() => borrowMax(0, 0.75)}
                                  className="max-btn"
                                >
                                  75%
                                </Button>
                                <Button
                                  onClick={() => borrowMax(0, 0.5)}
                                  className="max-btn"
                                >
                                  50%
                                </Button>
                                <Button
                                  onClick={() => borrowMax(0, 0.25)}
                                  className="max-btn"
                                >
                                  25%
                                </Button>
                              </div>
                            )}
                            {dataObj.viewFarmType === "repay" && (
                              <div className="tab-spacer">
                                <Input
                                  type="text"
                                  className="form-control form-control-lg text-center"
                                  placeholder="0"
                                  value={repayInput}
                                  onChange={(e) =>
                                    setRepayInput(e.target.value)
                                  }
                                ></Input>
                                <Button
                                  onClick={() => repayMax(0, 1)}
                                  className="max-btn"
                                >
                                  MAX
                                </Button>
                                <Button
                                  onClick={() => repayMax(0, 0.75)}
                                  className="max-btn"
                                >
                                  75%
                                </Button>
                                <Button
                                  onClick={() => repayMax(0, 0.5)}
                                  className="max-btn"
                                >
                                  50%
                                </Button>
                                <Button
                                  onClick={() => repayMax(0, 0.25)}
                                  className="max-btn"
                                >
                                  25%
                                </Button>
                              </div>
                            )}
                            {dataObj.viewFarmType === "lend" && (
                              <div className="tab-spacer">
                                <Input
                                  type="text"
                                  className="form-control form-control-lg text-center"
                                  placeholder="0"
                                  value={lendInput}
                                  onChange={(e) => setLendInput(e.target.value)}
                                />
                                <Button
                                  onClick={() => lendMax(0, 1)}
                                  className="max-btn"
                                >
                                  MAX
                                </Button>
                                <Button
                                  onClick={() => lendMax(0, 0.75)}
                                  className="max-btn"
                                >
                                  75%
                                </Button>
                                <Button
                                  onClick={() => lendMax(0, 0.5)}
                                  className="max-btn"
                                >
                                  50%
                                </Button>
                                <Button
                                  onClick={() => lendMax(0, 0.25)}
                                  className="max-btn"
                                >
                                  25%
                                </Button>
                              </div>
                            )}
                            {dataObj.viewFarmType === "lendWithdraw" && (
                              <div className="tab-spacer">
                                <Input
                                  type="text"
                                  className="form-control form-control-lg text-center"
                                  placeholder="0"
                                  value={withdrawLendingInput}
                                  onChange={(e) =>
                                    setWithdraLendingInput(e.target.value)
                                  }
                                  isRequired={true}
                                />
                                <Button
                                  onClick={() => lendWithdrawMax(0, 1)}
                                  className="max-btn"
                                >
                                  MAX
                                </Button>
                                <Button
                                  onClick={() => lendWithdrawMax(0, 0.75)}
                                  className="max-btn"
                                >
                                  75%
                                </Button>
                                <Button
                                  onClick={() => lendWithdrawMax(0, 0.5)}
                                  className="max-btn"
                                >
                                  50%
                                </Button>
                                <Button
                                  onClick={() => lendWithdrawMax(0, 0.25)}
                                  className="max-btn"
                                >
                                  25%
                                </Button>
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
                          {
                            <div>
                              <Switch
                                onChange={(e) => enterExitMarket(e)}
                                height={22}
                                width={45}
                                checked={isEnableCollateral}
                              />
                            </div>
                          }
                        </div>
                      </div>
                    )}

                    {dataObj.subtabType === "mint" && (
                      <div className="row">
                        <div className="col-md-12">
                          <div className="calculation">
                            <div className="col-md-6">
                              <span className="description">
                                {lendingMarketData.underlyingSymbol} BORROWED/MINTED + INTEREST ACCRUED
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
                                  lendingUserMarketData.borrowBalanceUSD,
                                  4 // markets[0].erc20Decimals
                                )}  {lendingMarketData.underlyingSymbol}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="px-1 mt-3">
                      {dataObj.viewFarmType === "stake" && isEnabledStake && (
                        <div>
                          <Button
                            className="btn btn-subtab-darker-ctm btn-block active"
                            onClick={() => handleSupply()}
                            //   mat-raised-button
                            //   matTooltip="Supply collateral"
                            //   matTooltipclassName="custom-tooltip"
                          >
                            SUBMIT
                          </Button>
                        </div>
                      )}
                      {dataObj.viewFarmType === "stake" && !isEnabledStake && (
                        <div>
                          <Button
                            className="btn btn-subtab-darker-ctm btn-block active"
                            onClick={() => enableSupplyCollateral()}
                            //   mat-raised-button
                            //   matTooltip="Enable for Collateral Supply"
                            //   matTooltipclassName="custom-tooltip"
                          >
                            APPROVE
                          </Button>
                        </div>
                      )}

                      {dataObj.viewFarmType === "withdraw" && isEnabledStake && (
                        <div>
                          <Button
                            className="btn btn-subtab-darker-ctm btn-block active"
                            onClick={() => handleWithdraw()}
                          >
                            SUBMIT
                          </Button>
                        </div>
                      )}
                      {dataObj.viewFarmType === "withdraw" && !isEnabledStake && (
                        <div>
                          <Button
                            className="btn btn-subtab-darker-ctm btn-block active"
                            onClick={() => enableSupplyCollateral()}
                            //   mat-raised-Button
                            //   matTooltip="Enable for Supply collateral"
                            //   matTooltipclassName="custom-tooltip"
                          >
                            APPROVE
                          </Button>
                        </div>
                      )}

                      {dataObj.viewFarmType === "mint" && isEnabledLend && (
                        <div>
                          <Button
                            className="btn btn-subtab-darker-ctm btn-block activebtn-brand"
                            onClick={() => handleMint()}
                          >
                            SUBMIT
                          </Button>
                        </div>
                      )}

                      {dataObj.viewFarmType === "mint" && !isEnabledLend && (
                        <div>
                          <Button
                            className="btn btn-subtab-darker-ctm btn-block active"
                            onClick={() => enableBorrowCollateral()}
                            //   mat-raised-Button
                            //   matTooltip="Enable"
                            //   matTooltipclassName="custom-tooltip"
                          >
                            APPROVE
                          </Button>
                        </div>
                      )}
                      {dataObj.viewFarmType === "repay" && isEnabledLend && (
                        <div>
                          <Button
                            className="btn btn-subtab-darker-ctm btn-block active"
                            onClick={() => handleRepay()}
                            //   mat-raised-Button
                            //   matTooltipclassName="custom-tooltip"
                          >
                            SUBMIT
                          </Button>
                        </div>
                      )}

                      {dataObj.viewFarmType === "repay" && !isEnabledLend && (
                        <div>
                          <Button
                            className="btn btn-subtab-darker-ctm btn-block active"
                            onClick={() => enableBorrowCollateral()}
                            //   mat-raised-Button
                            //   matTooltip="Enable"
                            //   matTooltipclassName="custom-tooltip"
                          >
                            APPROVE
                          </Button>
                        </div>
                      )}

                      {dataObj.viewFarmType === "lend" && isEnabledLend && (
                        <div>
                          <Button
                            style={{ marginTop: "1rem" }}
                            className="btn btn-subtab-darker-ctm btn-block active"
                            disabled={markets[0].tokenBorrowBalance > 0}
                            onClick={() => handleLend()}
                            //   mat-raised-Button
                            //   matTooltipclassName="custom-tooltip"
                          >
                            SUBMIT
                          </Button>
                        </div>
                      )}

                      {dataObj.viewFarmType === "lend" && !isEnabledLend && (
                        <div>
                          <Button
                            style={{ marginTop: "1rem" }}
                            className="btn btn-subtab-darker-ctm btn-block active"
                            onClick={() => enableBorrowCollateral()}
                            //   mat-raised-Button
                            //   matTooltip="Enable"
                            //   matTooltipclassName="custom-tooltip"
                          >
                            APPROVE
                          </Button>
                        </div>
                      )}

                      {dataObj.viewFarmType === "lendWithdraw" &&
                        isEnabledLend && (
                          <div>
                            <Button
                              style={{ marginTop: "1rem" }}
                              className="btn btn-subtab-darker-ctm btn-block active"
                              onClick={() => handleWithdrawLend()}
                            >
                              SUBMIT
                            </Button>
                          </div>
                        )}
                      {dataObj.viewFarmType === "lendWithdraw" &&
                        !isEnabledLend && (
                          <div>
                            <Button
                              style={{ marginTop: "1rem" }}
                              className="btn btn-subtab-darker-ctm btn-block active"
                              onClick={() => enableBorrowCollateral()}
                            >
                              APPROVE
                            </Button>
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
                                  style={{
                                    paddingLeft: "0px",
                                  }}
                                >
                                  ?
                                </span>
                              </sup>{" "}
                            </span>
                            <span className="font-weight-light">
                              {toDecimal(
                                new BigNumber(stakingUserMarketData.collateralFactor).times(100),
                                0
                              )}
                              %
                            </span>
                          </div>
                          <div className="calculation py-1">
                            <span className="">
                              Collateral Price
                              <sup>
                                <span
                                  className="step"
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
                                toDecimal(stakingMarketData.tokenPrice, 2),
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
                                toDecimal(stakingMarketData.liquidity, 2),
                                4
                              )}
                            </span>
                          </div>
                        </div>
                      )}

                      {dataObj.subtabType === "mint" && (
                        <div className="mt20 font-weight-light">
                          {/* {marketData.underlyingSymbol !== "puffLINA" &&
                            marketData.underlyingSymbol !== "puffCake" && 
                            (
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
                                {marketData.underlyingSymbol !== "GFX" &&
                                  marketData.underlyingSymbol !== "HOTCROSS" &&
                                  marketData.underlyingSymbol !== "bwJUP" &&
                                  marketData.underlyingSymbol !== "HYVE" && (
                                    <span className="font-weight-light">
                                      0.5%
                                    </span>
                                  )}
                                {marketData.underlyingSymbol === "GFX" ||
                                  marketData.underlyingSymbol === "HOTCROSS" ||
                                  marketData.underlyingSymbol === "bwJUP" ||
                                  (marketData.underlyingSymbol === "HYVE" && (
                                    <span>1%</span>
                                  ))}
                              </div>
                            )} */}
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
                              {toDecimal(((lendingUserMarketData.borrowBalance).div(lendingUserMarketData.supplyBalance).times(lendingUserMarketData.tokenPrice)).times(100), 2) }%
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
                              {
                                toDecimal(
                                  new BigNumber(lendingMarketData.availableLiquidity).div(new BigNumber(10).pow(lendingMarketData.underlyingDecimal)), //markets[0].availableBorrow,
                                  2
                                )}  {lendingMarketData.underlyingSymbol}
                            </span>
                          </div>
                          {/* <div className="calculation py-1">
                            <span className="">{lendingMarketData.underlyingSymbol} borrowed by all users</span>
                            <span className="font-weight-light">
                              {localeString(
                                toDecimal(
                                  lendingUserMarketData.borrowBalanceUSD, //markets[0].totalErc20Borrows,
                                  2
                                ),
                                2
                              )}{" "}
                              {marketData.underlyingSymbol}
                            </span>
                          </div> */}

                          <div className="calculation">
                            <div>
                              {marketData.underlyingSymbol === "LIME" && (
                                <a
                                  className="description asset"
                                  href="https://limerekt.opendao.io/"
                                  target="_blank"
                                >
                                  All Positions
                                </a>
                              )}
                              {marketData.underlyingSymbol === "OCP" && (
                                <a
                                  className="description asset"
                                  href="https://ocprekt.opendao.io/"
                                  target="_blank"
                                >
                                  All Positions
                                </a>
                              )}
                              {marketData.underlyingSymbol === "pOPEN" && (
                                <a
                                  className="description asset"
                                  href="https://popenrekt.opendao.io/"
                                  target="_blank"
                                >
                                  All Positions
                                </a>
                              )}
                              {marketData.underlyingSymbol === "LAND" && (
                                <a
                                  className="description asset"
                                  href="https://landrekt.opendao.io/"
                                  target="_blank"
                                >
                                  All Positions
                                </a>
                              )}
                              {marketData.underlyingSymbol === "ROSN" && (
                                <a
                                  className="description asset"
                                  href="https://rosnrekt.opendao.io/"
                                  target="_blank"
                                >
                                  All Positions
                                </a>
                              )}
                              {marketData.underlyingSymbol === "GFX" && (
                                <a
                                  className="description asset"
                                  href="https://gfxrekt.opendao.io/"
                                  target="_blank"
                                >
                                  All Positions
                                </a>
                              )}
                              {marketData.underlyingSymbol === "HOTCROSS" && (
                                <a
                                  className="description asset"
                                  href="https://hotcrossrekt.opendao.io/"
                                  target="_blank"
                                >
                                  All Positions
                                </a>
                              )}
                              {marketData.underlyingSymbol === "puffCake" && (
                                <a
                                  className="description asset"
                                  href="https://cakerekt.ocp.finance/"
                                  target="_blank"
                                >
                                  All Positions
                                </a>
                              )}
                              {marketData.underlyingSymbol === "puffLINA" && (
                                <a
                                  className="description asset"
                                  href="https://linarekt.ocp.finance/"
                                  target="_blank"
                                >
                                  All Positions
                                </a>
                              )}
                              {marketData.underlyingSymbol === "bwJUP" && (
                                <a
                                  className="description asset"
                                  href="https://juprekt.opendao.io/"
                                  target="_blank"
                                >
                                  All Positions
                                </a>
                              )}
                              {marketData.underlyingSymbol === "HYVE" && (
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
                              {marketData.underlyingSymbol === "LIME" && (
                                <a
                                  className="description asset"
                                  href="https://mint.opendao.io/#/admin/0x2240e2A6805b31Bd1BC03bd5190f644334F53b9A"
                                  target="_blank"
                                >
                                  Unitroller
                                </a>
                              )}
                              {marketData.underlyingSymbol === "OCP" && (
                                <a
                                  className="description asset"
                                  href="https://mint.opendao.io/#/admin/0xA21d5c762E13FcfC8541558dAce9BA54f1F6176F"
                                  target="_blank"
                                >
                                  Unitroller
                                </a>
                              )}
                              {marketData.underlyingSymbol === "pOPEN" && (
                                <a
                                  className="description asset"
                                  href="https://mint.opendao.io/#/admin/0x5AcEc8328f41145562548Dd335556c12559f2913"
                                  target="_blank"
                                >
                                  Unitroller
                                </a>
                              )}
                              {marketData.underlyingSymbol === "LAND" && (
                                <a
                                  className="description asset"
                                  href="https://mint.opendao.io/#/admin/0xdaD9b52fE5ffd4331aaA02321f1ffa400C827EC8"
                                  target="_blank"
                                >
                                  Unitroller
                                </a>
                              )}
                              {marketData.underlyingSymbol === "ROSN" && (
                                <a
                                  className="description asset"
                                  href="https://mint.opendao.io/#/admin/0x52CA265749527d86C4666788116b0CDF6012bD5F"
                                  target="_blank"
                                >
                                  Unitroller
                                </a>
                              )}
                              {marketData.underlyingSymbol === "GFX" && (
                                <a
                                  className="description asset"
                                  href="https://mint.opendao.io/#/admin/0x2388E81Ba9f4360e359D88A4513055c5D12a96bA"
                                  target="_blank"
                                >
                                  Unitroller
                                </a>
                              )}
                              {marketData.underlyingSymbol === "HOTCROSS" && (
                                <a
                                  className="description asset"
                                  href="https://mint.opendao.io/#/admin/0x8ee2C57434cECfE9501efdB112CfE73adb3c6E68"
                                  target="_blank"
                                >
                                  Unitroller
                                </a>
                              )}
                              {marketData.underlyingSymbol === "puffCake" && (
                                <a
                                  className="description asset"
                                  href="https://mint.opendao.io/#/admin/0x35912c80AfeD3BC925bdA3B4Ee5B0085FB36891e"
                                  target="_blank"
                                >
                                  Unitroller
                                </a>
                              )}

                              {marketData.underlyingSymbol === "puffLINA" && (
                                <a
                                  className="description asset"
                                  href="https://mint.opendao.io/#/admin/0x118122C7de0Fa0DE3e4017fD9eA6C422438A46C6"
                                  target="_blank"
                                >
                                  Unitroller
                                </a>
                              )}
                              {marketData.underlyingSymbol === "bwJUP" && (
                                <a
                                  className="description asset"
                                  href="https://mint.opendao.io/#/admin/0x88826F399CB7a843fF84f24c0b7662cfF17F45C0"
                                  target="_blank"
                                >
                                  Unitroller
                                </a>
                              )}
                              {marketData.underlyingSymbol === "HYVE" && (
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
                              {toDecimal(new BigNumber(lendingMarketData.utilizationRatio).times(100), 2)}%
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
                              {
                                toDecimal((new BigNumber(lendingMarketData.availableLiquidity).div(new BigNumber(10).pow(lendingMarketData.underlyingDecimal))),
                                2)
                              }  {lendingMarketData.underlyingSymbol}
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
                        
                        <Progress percent={lendingUserMarketData.percentOfLimit} status="success" />
                        {
                         new BigNumber(lendingUserMarketData.percentOfLimit).dp(2,1).toString(10) //  setupData.sliderPercentage
                        }
                         %
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
                          toDecimal(
                            lendingUserMarketData.supplyBalanceUSD, //markets[1].cTokenSupplyBalance,
                            2
                          ),
                          2
                        )}  {marketData.underlyingSymbol}
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
                          toDecimal(
                            (new BigNumber(lendingUserMarketData.supplyBalanceUSD).times(lendingMarketData.tokenPrice)),
                            2
                          ),
                          2
                        )}
                      </span>
                    </div>
                    {/* <div className="calculation mt-3 py-1">
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
                          toDecimal(
                            0, //markets[0].cTokenSupplyBalanceUSD,
                            2
                          ),
                          2
                        )}
                      </span>
                    </div> */}
                    <div className="calculation py-1">
                      <span className="">
                        {lendingMarketData.underlyingSymbol} Minted{" "}
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
                          toDecimal(
                            new BigNumber(lendingUserMarketData.borrowBalanceUSD).times(lendingUserMarketData.tokenPrice), //markets[0].tokenBorrowBalance,
                            2
                          ),
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
                        {/* {(new BigNumber(userTotalBorrowLimit).div(1e18)).minus(userTotalBorrowBalance)} */}
                      </span>
                    </div>
                    {marketData.underlyingSymbol === "HOTCROSS" && (
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

                    {lendingMarketData.underlyingSymbol && (
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
                                      src={`/assets/img/${lendingMarketData.underlyingSymbol}_logo.png`}
                                      // onError="this.onerror=null;this.src='assets/img/binance-coin-logo.png';"
                                      alt="BUSD logo"
                                    />
                                    {lendingMarketData.underlyingSymbol}
                                  </div>
                                  <div className="col-md-6 text-right">
                                    {localeString(
                                      toDecimal(
                                        lendingUserMarketData.walletBalanceUSD, //markets[1].tokenBalance,
                                        2
                                      ),
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
                                      src={`/assets/img/${stakingMarketData.underlyingSymbol}_logo.png`}
                                      // onError="this.onerror=null;this.src='assets/img/binance-coin-logo.png';"
                                      alt={`${stakingMarketData.underlyingSymbol} logo`}
                                    />
                                    {stakingMarketData.underlyingSymbol}
                                  </div>
                                  <div className="col-md-6 text-right">
                                    {localeString(
                                      toDecimal(
                                        stakingUserMarketData.walletBalanceUSD,
                                        2
                                      ),
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
