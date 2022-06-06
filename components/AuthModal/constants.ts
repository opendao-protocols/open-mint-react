import MetaMaskLogo from "./../../public/assets/wallets/metaMaskLogo.svg";
import TrustWalletLogo from "./../../public/assets/wallets/trustWalletLogo.svg";
import WalletConnectLogo from "./../../public/assets/wallets/walletConnectLogo.svg";
import BinanceChainWalletLogo from "./../../public/assets/wallets/binanceChainWalletLogo.svg";
import LedgerLogo from "./../../public/assets/wallets/ledgerLogo.svg";
import SafePalLogo from "./../../public/assets/wallets/safePalLogo.svg";
import CoinbaseWalletLogo from "./../../public/assets/wallets/coinbaseWalletLogo.svg";
import { Connector } from "../../web3";
import { BaseWallet, Wallet } from "./types";

export const WALLETS: Wallet[] = [
  {
    name: "MetaMask",
    Logo: MetaMaskLogo,
    connector: Connector.MetaMask,
    svgName: "metaMaskLogo",
  },
  {
    name: "Coinbase Wallet",
    Logo: CoinbaseWalletLogo,
    connector: Connector.CoinbaseWallet,
    mainnetOnly: true,
    svgName: "coinbaseWalletLogo",
  },
  {
    name: "Trust Wallet",
    Logo: TrustWalletLogo,
    connector: Connector.TrustWallet,
    svgName: "trustWalletLogo",
  },
  {
    name: "WalletConnect",
    Logo: WalletConnectLogo,
    connector: Connector.WalletConnect,
    mainnetOnly: true,
    svgName: "walletConnectLogo",
  },
  {
    name: "Binance Chain Wallet",
    Logo: BinanceChainWalletLogo,
    connector: Connector.BinanceChainWallet,
    svgName: "binanceChainWalletLogo",
  },
];

export const UPCOMING_WALLETS: BaseWallet[] = [
  {
    name: "Ledger",
    Logo: LedgerLogo,
  },
  {
    name: "SafePal",
    Logo: SafePalLogo,
  },
];
