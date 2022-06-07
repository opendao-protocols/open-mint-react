import React, { useState, useContext, useEffect } from "react";
import { Footer } from "../Common/Footer";
// import { Header } from "../Common/Header1";
import AppContext from "../utils/AppContext";
import { MinterPartners } from "./MinterPartners";
import { TxnSection } from "./TxnSection";
import { SelectNetworkModal } from "./SelectNetworkModal";
import { InfoAndTvl } from "./InfoAndTvl";
import { Header } from "../Common/Header";
declare var window: any;

interface Props {}

export const MintApp: React.FC<Props> = ({}) => {
  const {
    currentAccount,
    networkString,
    setNetworkString,
    setContractAddresses,
    tokenData,
  } = useContext(AppContext);

  // ------
  // Return JSX below
  // ------

  // if (!currentAccount) {
  //   return (
  //     <>
  //       <Header />
  //       <ConnectWalletModal isOpen={!currentAccount} />
  //     </>
  //   );
  // }

  if (!!currentAccount && networkString !== "BSC") {
    return (
      <>
        <Header />
        <SelectNetworkModal isOpen={networkString !== "BSC"} />
      </>
    );
  }

  return (
    <>
      <Header />
      {typeof tokenData.length === "number" && tokenData.length > 0 && (
        <>
          <InfoAndTvl />
          <MinterPartners />
          <TxnSection />
          <Footer />
        </>
      )}
    </>
  );
};
