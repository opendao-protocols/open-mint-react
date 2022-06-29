import React, { useState, useEffect } from "react";
import BigNumber from "bignumber.js";

import { COMP_LENS_ADDRESS } from "../../config/index";
import { useWeb3, useWeb3Account } from "../../web3";
import { fetchMarkets } from "../../utilities/api";
import { indexBy, notNull } from "../../utilities/common";
import useRefresh from "../../lib/hooks/useRefresh";
import { blockchainConstants } from "../../lib/constants/blockchain-constants";

import {
  useComptrollerContract,
  useVenusLensContract,
} from "../../contracts/getters";

const MarketContext = React.createContext({
  markets: [] as any[],
  dailyVenus: 0,
  treasuryTotalUSDBalance: new BigNumber(0),
  userMarketInfo: [],
  userTotalBorrowLimit: new BigNumber(0),
  userTotalBorrowBalance: new BigNumber(0),
  userXvsBalance: new BigNumber(0),
});

// This context provide a way for all the components to share the market data, thus avoid
// duplicated requests

const MarketContextProvider = ({ children }: any) => {
  const [markets, setMarkets] = useState([]);
  const [dailyVenus, setDailyVenus] = useState(0);
  const [userMarketInfo, setUserMarketInfo] = useState([]);
  const [userTotalBorrowLimit, setUserTotalBorrowLimit] = useState(
    new BigNumber(0)
  );
  const [userTotalBorrowBalance, setUserTotalBorrowBalance] = useState(
    new BigNumber(0)
  );
  const [userXvsBalance, setUserXvsBalance] = useState(new BigNumber(0));
  const [treasuryTotalUSDBalance, setTreasuryTotalUSDBalance] = useState(
    new BigNumber(0)
  );
  // const comptrollerContract = useComptrollerContract();
  const lens = useVenusLensContract(COMP_LENS_ADDRESS);
  const { account } = useWeb3Account();
  const web3 = useWeb3();
  // const { userVaiMinted } = useVaiUser();

  const { fastRefresh } = useRefresh();

  useEffect(() => {
    let isMounted = true;
    const getMarkets = async () => {
      const res = await fetchMarkets();
      if (!res.data || !res.data.status) {
        return;
      }
      // const data = Object.keys(VBEP_TOKENS)
      //   .map(item => {
      //     if (res && res.data && res.data.data) {
      //       return res.data.data.markets.find(
      //         (market: Market) => market.underlyingSymbol.toLowerCase() === item.toLowerCase(),
      //       );
      //     }
      //     return undefined;
      //   })
      //   .filter(item => !!item);

      if (!isMounted) {
        return;
      }
      if (res && res.data && res.data.data) {
        setMarkets(res.data["data"]["markets"]);
      }
    };
    getMarkets();
    return () => {
      isMounted = false;
    };
  }, [fastRefresh]);

  useEffect(() => {
    let isMounted = true;

    // const getXvsBalance = (balances: any) => {
    //   const vxvs = getVBepToken('xvs').address.toLowerCase();
    //   const xvsDecimals = getToken('xvs').decimals;
    //   return new BigNumber(balances[vxvs].tokenBalance).shiftedBy(-xvsDecimals);
    // };

    const updateMarketUserInfo = async () => {
      if (!markets) {
        return;
      }

      // try {
      // let xvsBalance = new BigNumber(0);
      // const assetsIn = account
      //   ? await comptrollerContract.methods.getAssetsIn(account).call()
      //   : [];

      const vtAddresses = markets
        .filter((item) => item.address)
        .map((item) => item.address);

      let balances = {};
      //  let a =  await lens.methods.cTokenBalancesAll(vtAddresses, account).call()
      if (account) {
        balances = indexBy(
          (item: any) => item.cToken.toLowerCase(), // index by vToken address
          await lens.methods.cTokenBalancesAll(vtAddresses, account).call()
        );

        // xvsBalance = getXvsBalance(balances);
      }

      // Fetch treasury balances
      // const treasuryBalances = indexBy(
      //   (item: any) => item.vToken.toLowerCase(), // index by vToken address
      //   await lens.methods.cTokenBalancesAll(vtAddresses, TREASURY_ADDRESS).call(),
      // );

      const marketsMap = indexBy(
        (item: any) => item.underlyingSymbol.toLowerCase(),
        markets
      );

      const assetAndNullList = Object.values(marketsMap).map(
        (market, index) => {
          // const toDecimalAmount = (mantissa: string) =>
          // new BigNumber(mantissa).shiftedBy(-market.decimals);

          // if no corresponding vassets, skip
          // if (!getVBepToken(item.id)) {
          //   return null;
          // }

          // let market = marketsMap[item.symbol.toLowerCase()];
          // if (!market) {
          //   market = {};
          // }

          const vtokenAddress = market.address.toLowerCase();

          // const collateral = assetsIn
          //   .map((address: any) => address.toLowerCase())
          //   .includes(vtokenAddress);

          // const treasuryBalance = toDecimalAmount(
          //   (treasuryBalances[vtokenAddress] as any).tokenBalance,
          // );
          // const treasuryBalance = toDecimalAmount("0");

          let walletBalance = new BigNumber(0);
          let supplyBalance = new BigNumber(0);
          let borrowBalance = new BigNumber(0);
          // let walletBalanceUSD = new BigNumber(0);
          // let supplyBalanceUSD = new BigNumber(0);
          // let borrowBalanceUSD = new BigNumber(0);
          let isEnabled = false;
          const percentOfLimit = "0";

          if (account) {
            const wallet = balances[vtokenAddress];
            walletBalance = new BigNumber(wallet.tokenBalance);
            supplyBalance = new BigNumber(wallet.balanceOfUnderlying);
            borrowBalance = new BigNumber(wallet.borrowBalanceCurrent);
            // walletBalanceUSD = new BigNumber(walletBalance).div(market.underlyingDecimal)
            // supplyBalanceUSD = new BigNumber(supplyBalance).div(market.underlyingDecimal);
            // borrowBalanceUSD =  new BigNumber(borrowBalance).div(market.underlyingDecimal);
            if (market.id === "bnb") {
              isEnabled = true;
            } else {
              isEnabled = new BigNumber(wallet.tokenAllowance).isGreaterThan(
                walletBalance
              );
            }
          }

          return {
            key: index,
            // id: item.id,
            // img: item.asset,
            // vimg: market.vasset,
            // symbol: market.underlyingSymbol || "",
            decimals: 8, // need to change from constant file
            tokenAddress: market.underlyingAddress,
            availableLiquidity: new BigNumber(market.availableLiquidity).div(new BigNumber(10).pow(market.underlyingDecimal)),
            address: vtokenAddress,
            compAddress: market.compAddress,
            supplyApy: new BigNumber(market.supplyApy || 0),
            borrowApy: new BigNumber(market.borrowApy || 0),
            // xvsSupplyApy: new BigNumber(market.supplyVenusApy || 0),
            // xvsBorrowApy: new BigNumber(market.borrowVenusApy || 0),
            collateralFactor: new BigNumber(market.collateralFactor).div(1e18),
            tokenPrice: new BigNumber(market.tokenPrice || 0),
            liquidity: new BigNumber(market.liquidity || 0),
            borrowCaps: new BigNumber(market.borrowCaps || 0),
            totalBorrows: new BigNumber(market.totalBorrows2 || 0),
            // treasuryBalance,
            utilizationRatio: new BigNumber(market.utilizationRatio),
            walletBalance,
            walletBalanceUSD:
              new BigNumber(walletBalance).div(
                new BigNumber(10).pow(market.underlyingDecimal)
              ) || new BigNumber(0),
            supplyBalance,
            supplyBalanceUSD:
              new BigNumber(supplyBalance).div(
                new BigNumber(10).pow(market.underlyingDecimal)
              ) || new BigNumber(0),
            borrowBalance,
            borrowBalanceUSD:
              new BigNumber(borrowBalance).div(
                new BigNumber(10).pow(market.underlyingDecimal)
              ) || new BigNumber(0),
            isEnabled,
            // collateral,
            percentOfLimit,
            hypotheticalLiquidity: ["0", "0", "0"] as [string, string, string],
            borrowerPBFnr:
              new BigNumber(market.borrowerPBFnr).div(
                new BigNumber(10).pow(18)
              ) || new BigNumber(0),
            supplierPBFnr:
              new BigNumber(market.supplierPBFnr).div(
                new BigNumber(10).pow(18)
              ) || new BigNumber(0),
            borrowerPBFnrPerYear:
              new BigNumber(market.borrowerPBFnrPerYear) || new BigNumber(0),
            supplierPBFnrPerYear:
              new BigNumber(market.supplierPBFnrPerYear) || new BigNumber(0),
          };
        }
      );

      let assetList = assetAndNullList.filter(notNull);

      // We use "hypothetical liquidity upon exiting a market" to disable the "exit market"
      // toggle. Sadly, the current VenusLens contract does not provide this info, so we
      // still have to query each market.
      // assetList = await Promise.all(
      //   assetList.map(async (asset) => {
      //     // const hypotheticalLiquidity: [string, string, string] = (
      //     //   account
      //     //     ? await comptrollerContract.methods
      //     //         .getHypotheticalAccountLiquidity(
      //     //           account,
      //     //           asset.vtokenAddress,
      //     //           // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      //     //           balances[asset.vtokenAddress.toLowerCase()].balanceOf,
      //     //           0
      //     //         )
      //     //         .call()
      //     //     : ["0", "0", "0"]
      //     // ) as [string, string, string];

      //     return {
      //       ...asset,
      //       hypotheticalLiquidity,
      //     };
      //   })
      // );

      const totalBorrowBalance = assetList
        .reduce((acc, asset) => {
          const borrowBalanceUSD = asset.borrowBalance.times(asset.tokenPrice);
          return acc.plus(borrowBalanceUSD);
        }, new BigNumber(0))

      const totalBorrowLimit = assetList.reduce((acc, asset) => {
        // if (isEnabled) {
          const supplyBalanceUSD = asset.supplyBalance.times(asset.tokenPrice);
          return acc.plus(supplyBalanceUSD.times(asset.collateralFactor));
        // }
        return acc;
      }, new BigNumber(0));

      // percent of limit
      assetList = assetList.map((item: any) => ({
        ...item,
        percentOfLimit: new BigNumber(totalBorrowLimit).isZero()
          ? "0"
          : item.borrowBalanceUSD
              .times(item.tokenPrice)
              .div((totalBorrowLimit).div(1e18))
              .times(100)
              .dp(0, 1)
              .toString(10),
      }));
      if (!isMounted) {
        return;
      }

      // Calculate total treasury balance in USD
      // const updatedTreasuryTotalUSDBalance = assetList.reduce(
      //   (accumulator, asset) => {
      //     const treasuryUSDBalance = asset.treasuryBalance.multipliedBy(
      //       asset.tokenPrice
      //     );
      //     return accumulator.plus(treasuryUSDBalance);
      //   },
      //   new BigNumber(0)
      // );

      // setTreasuryTotalUSDBalance(updatedTreasuryTotalUSDBalance);
      setUserMarketInfo(assetList);
      setUserTotalBorrowLimit(totalBorrowLimit);
      setUserTotalBorrowBalance(totalBorrowBalance);
      // setUserXvsBalance(new BigNumber(0));
      // } catch (error) {
      // console.log('error when get market data', error);
      // }
    };
    updateMarketUserInfo();
    return () => {
      isMounted = false;
    };
  }, [markets, account, web3, fastRefresh]);

  return (
    <MarketContext.Provider
      value={{
        markets,
        dailyVenus,
        treasuryTotalUSDBalance,
        userMarketInfo,
        userTotalBorrowLimit,
        userTotalBorrowBalance,
        userXvsBalance,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export { MarketContext, MarketContextProvider };
