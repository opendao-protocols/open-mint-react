import React, { useContext } from "react";
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalBody,
  Box,
  Text,
} from "@chakra-ui/react";
import AppContext from "../utils/AppContext";
import { ethers } from "ethers";
declare var window: any;
import { params as chainParams } from "./../../lib/constants/chain-params";

interface Props {
  isOpen: boolean;
}

export const SelectNetworkModal: React.FC<Props> = ({ isOpen }) => {
  const {
    currentAccount,
    setCurrentAccount,
    networkString,
    setNetworkString,
    setContractAddresses,
    web3,
    setWeb3,
  } = useContext(AppContext);

  const addNetworkToWallet = async (chainId: string) => {
    // const web3 = new ethers.providers.Web3Provider(window["ethereum"]);
    const myNetwork = await web3.getNetwork();
    if (myNetwork.chainId == 56) {
      setNetworkString("BSC");
    }
    const chainParam = { ...chainParams[chainId] };
    if (!!web3 && !!web3.provider && !!web3.provider.request) {
      await web3.provider.request({
        method: "wallet_addEthereumChain",
        params: [chainParam],
      });
    }
  };

  return (
    <Modal onClose={() => {}} isOpen={isOpen} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent alignSelf="center" w="400px" h="325px" mx="auto">
        <ModalBody>
          <Box bg="white" borderRadius={20} py="20">
            <Text fontSize="30px" textAlign="center" color="black" pt="30">
              Switch Network to:
            </Text>
            <a
              className="asset btn wallet-connect-btns"
              onClick={() => {
                addNetworkToWallet("56");
              }}
            >
              BSC
            </a>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
