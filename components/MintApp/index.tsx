import React, { useState, useContext, useEffect } from "react";
import { Footer } from "../Common/Footer";
import { Header } from "../Common/Header";
import AppContext from "../utils/AppContext";
import { MinterPartners } from "./MinterPartners";
import { TxnSection } from "./TxnSection";
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalBody,
  Box,
  Text,
} from "@chakra-ui/react";
import { blockchainConstants } from "../../lib/constants/blockchain-constants";
import { ConnectWalletModal } from "./ConnectWalletModal";
import { SelectNetworkModal } from "./SelectNetworkModal";
import { InfoAndTvl } from "./InfoAndTvl";
declare var window: any;

interface Props {}

export const MintApp: React.FC<Props> = ({}) => {
  const {
    currentAccount,
    setCurrentAccount,
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
