import React, { useContext, useEffect, useState } from "react";
import { truncateAddress } from "../../lib/utils";
import AppContext from "../utils/AppContext";
import { blockchainConstants } from "../../lib/constants/blockchain-constants";
import { ethers } from "ethers";
// import {
//   useCookies,
//   withCookies,
//   Cookies as cookies,
//   cookie,
// } from "react-cookie";
// import Cookies from "universal-cookie";
// cookies
// cookies
// import Cookies from "js-cookie";

declare var window: any;

interface Props {
  // currentAccount: string;
  // networkString: string;
  // disconnectWallet: () => void;
}

export const Header: React.FC<Props> = (
  {
    // currentAccount,
    // networkString,
    // disconnectWallet,
  }
) => {
  const {
    currentAccount,
    setCurrentAccount,
    networkString,
    setContractAddresses,
    setNetworkString,
    web3,
    setWeb3,
  } = useContext(AppContext);

  // const [cookies, setCookie, removeCookie] = useCookies([
  //   "connected_wallet_name",
  // ]);

  // const cookies = new Cookies();

  const disconnectWallet = async () => {
    setCurrentAccount("");
    setWeb3(null);
    window.location.reload();
    localStorage.removeItem("connected_wallet_name");
    localStorage.setItem("disconnected", "true");
    document.cookie = "" + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    // cookies.remove("Token");
    // browser.cookies.remove("loginToken");
    // cookies.remove("connected_wallet_name", { path: "/" });
    // removeCookies();
  };

  const connect = (walletName: string) => {
    if (!!localStorage.getItem("disconnected")) {
      localStorage.removeItem("disconnected");
      window.location.reload();
    }
    switch (walletName) {
      case "metamask": {
        initializeMetaMask();
        break;
      }
      default:
        break;
    }
  };

  const initializeMetaMask = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      const myWeb3 = new ethers.providers.Web3Provider(window["ethereum"]);
      setWeb3(myWeb3);
    } catch (error) {
      console.log("initializeMetaMask() error", error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    function handleChainChanged(_chainId: string) {
      window.location.reload();
    }
    if (!localStorage.getItem("disconnected")) {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        const myWeb3 = new ethers.providers.Web3Provider(window["ethereum"]);
        setWeb3(myWeb3);
      } else {
        console.log("No authorized account found");
      }

      const chainId = await ethereum.request({ method: "eth_chainId" });

      // console.log("MY chainId", chainId);

      if (
        chainId == "0x38" // 56
      ) {
        setNetworkString("BSC");
        setContractAddresses(blockchainConstants["bsc"]);
      } else {
        setNetworkString("");
        setContractAddresses({});
      }

      ethereum.on("chainChanged", handleChainChanged);
    }
  };

  // ------
  // UseEffects below
  // ------

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // console.log("MY currentAccount", currentAccount);

  return (
    <header style={{ paddingTop: "2.5em", paddingBottom: "3.5em" }}>
      <div className="toolbar" role="banner">
        <div className="dropdown">
          <a href="https://opendao.io/" target="_blank">
            <img
              src={`/assets/img/open-logo-sm.png`}
              style={{ marginLeft: "2em", maxHeight: "50px" }}
            />
          </a>
        </div>
        <div className="spacer"></div>
        {!!networkString && (
          <div className="asset btn btn-grey-box">
            <span className="dot"></span>
            <span
              onClick={() => {
                //setShowNetworkSelectModal(true)
              }}
            >
              {networkString.toUpperCase()}
            </span>
          </div>
        )}
        {!!currentAccount ? (
          <a className="d-none d-sm-block asset btn btn-grey-box" id="account">
            {truncateAddress(currentAccount)}
          </a>
        ) : (
          <a
            className="d-none d-sm-block asset btn btn-grey-box"
            id="account"
            onClick={() => {
              connect("metamask");
            }}
          >
            Connect Wallet
          </a>
        )}
        {!!currentAccount && (
          <a
            className="asset btn text-right btn-grey-box"
            style={{ marginRight: "0px" }}
            onClick={() => {
              disconnectWallet();
            }}
          >
            Disconnect
          </a>
        )}
      </div>
    </header>
  );
};
