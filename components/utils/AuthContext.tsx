import React from "react";
import noop from "noop-ts";
import copyToClipboard from "copy-to-clipboard";

import { Connector, useAuth } from "./../../web3";
import { AuthModal } from "../AuthModal";
import toast from "../Common/Toast";

export interface IAccount {
  address: string;
  connector?: Connector;
}

export interface IAuthContextValue {
  login: (connector: Connector) => Promise<void>;
  logOut: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  account?: IAccount;
  // accountAddress: any;
}

export const AuthContext = React.createContext<IAuthContextValue>({
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
});

interface Props {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<Props> = ({children}) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  const { login, accountAddress, logOut, connectedConnector } = useAuth();

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const handleLogin = (connector: Connector) => {
    login(connector);
    closeAuthModal();
  };

  const handleCopyAccountAddress = (accountAddressToCopy: string) => {
    copyToClipboard(accountAddressToCopy);

    toast.success({
      title: "Wallet address copied to clipboard",
    });
  };

  const account = accountAddress
    ? {
        address: accountAddress,
        connector: connectedConnector,
      }
    : undefined;

  return (
    <AuthContext.Provider
      value={{
        account,
        login,
        logOut,
        openAuthModal,
        closeAuthModal,
      }}
    >
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        account={account}
        onLogOut={logOut}
        onLogin={handleLogin}
        onCopyAccountAddress={handleCopyAccountAddress}
      />

      {children}
    </AuthContext.Provider>
  );
};
