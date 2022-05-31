import React, { useContext, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalBody,
  Box,
  Text,
} from "@chakra-ui/react";
import AppContext from "../utils/AppContext";
import { blockchainConstants } from "../../lib/constants/blockchain-constants";
declare var window: any;

interface Props {
  isOpen: boolean;
}

export const ConnectWalletModal: React.FC<Props> = ({ isOpen }) => {
  const {
    currentAccount,
    setCurrentAccount,
    networkString,
    setNetworkString,
    setContractAddresses,
  } = useContext(AppContext);

  const connect = (walletName: string) => {
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
    } catch (error) {
      console.log("initializeMetaMask() error", error);
    }
  };

  const checkIfWalletIsConnected = async () => {
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

    function handleChainChanged(_chainId: string) {
      window.location.reload();
    }
  };

  // ------
  // UseEffects below
  // ------

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <Modal onClose={() => {}} isOpen={isOpen} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent alignSelf="center" w="400px" h="325px" mx="auto">
        <ModalBody>
          <Box bg="white" borderRadius={20} py="20">
            <Text fontSize="30px" textAlign="center" color="black" pt="30">
              Connect with:
            </Text>
            <a
              className="asset btn wallet-connect-btns"
              onClick={() => {
                connect("metamask");
              }}
            >
              <img
                src={`/assets/img/metamask-logo.png`}
                className="wallet-btn-logo"
                alt="Metamask logo"
              />
              &nbsp;&nbsp;Metamask
            </a>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
