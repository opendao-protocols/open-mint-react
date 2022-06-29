import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import Web3ReactManager from './Web3ReactManager';
interface Props {
  children: React.ReactNode;
}

const Web3Wrapper: React.FC<Props> = ({ children }) => (
  <Web3ReactProvider getLibrary={provider => provider}>
    <Web3ReactManager>{children}</Web3ReactManager>
  </Web3ReactProvider>
);

export default Web3Wrapper;
