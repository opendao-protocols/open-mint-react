import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { useMemo } from "react";
import { useWeb3 } from "../web3";

import { getWeb3NoAccount } from "../web3";

// import Comptroller from "./../../public/assets/contracts/Comptroller.json";
import Comptroller from "./../public/assets/contracts/Comptroller.json";

import ERC20Detailed from "./../public/assets/contracts/ERC20Detailed.json";
import UniswapOracleTWAP from "./../public/assets/contracts/UniswapOracleTWAP.json";
import * as CErc20Immutable from "./../public/assets/contracts/CErc20Immutable.json";

import ComptrollerV3 from "./../public/assets/contracts/ComptrollerV3.json";
import Comp from "./../public/assets/contracts/Comp.json";

import CErc20Delegator from "./../public/assets/contracts/CErc20Delegator.json";
// import bep20Abi from "constants/contracts/abis/bep20.json";
// import comptrollerAbi from "constants/contracts/abis/comptroller.json";
// import interestModelAbi from "constants/contracts/abis/interestModel.json";
// import oracleAbi from "constants/contracts/abis/oracle.json";
// import vaiUnitrollerAbi from "constants/contracts/abis/vaiUnitroller.json";
// import vaiVaultAbi from "constants/contracts/abis/vaiVault.json";
// import xvsVaultStoreAbi from "constants/contracts/abis/xvsVaultStore.json";
// import xvsVaultAbi from "constants/contracts/abis/xvsVault.json";
// import vBep20Abi from "constants/contracts/abis/vBep20.json";
// import venusLensAbi from "constants/contracts/abis/venusLens.json";
// import governorBravoDelegateAbi from "constants/contracts/abis/governorBravoDelegate.json";
// import xvsVestingAbi from "constants/contracts/abis/xvsVesting.json";
// import vrtConverterAbi from "constants/contracts/abis/vrtConverter.json";
// import vrtVaultAbi from "constants/contracts/abis/vrtVault.json";

// import { getContractAddress, getToken, getVBepToken } from "utilities";
// import { TokenContract, VTokenContract } from "./types";

// const getContract = <T>(
//   abi: AbiItem | AbiItem[],
//   address: string,
//   web3Instance: Web3
// ) => {
//   const web3 = web3Instance ?? getWeb3NoAccount();
//   return new web3.eth.Contract(abi, address) as unknown as T;
// };

// export const getTokenContract = <T extends TokenId>(
//   tokenId: T,
//   web3: Web3
// ): TokenContract<T> => {
//   const tokenAddress = getToken(tokenId).address;

//   return getContract<TokenContract<T>>(
//     bep20Abi as AbiItem[],
//     tokenAddress,
//     web3
//   );
// };

// export const getVTokenContract = <T extends VTokenId>(
//     tokenId: T,
//     web3: Web3
//   ): VTokenContract<T> => {
//     const vBepTokenAddress = getVBepToken(tokenId).address;

//     return getContract(
//       vBep20Abi as AbiItem[],
//       vBepTokenAddress,
//       web3
//     ) as unknown as VTokenContract<T>;
//   };

// export const getTokenContractByAddress = (address: string, web3: Web3) =>
//   getContract(bep20Abi as AbiItem[], address, web3);

// export const getVaiUnitrollerContract = (web3: Web3) =>
//   getContract(
//     vaiUnitrollerAbi as AbiItem[],
//     getContractAddress("vaiUnitroller"),
//     web3
//   );

// export const getVaiVaultContract = (web3: Web3) =>
//   getContract(vaiVaultAbi as AbiItem[], getContractAddress("vaiVault"), web3);

// export const getXvsVaultContract = (web3: Web3) =>
//   getContract(xvsVaultAbi as AbiItem[], getContractAddress("xvsVault"), web3);

// export const getXvsVaultProxyContract = (web3: Web3) =>
//   getContract(
//     xvsVaultAbi as AbiItem[],
//     getContractAddress("xvsVaultProxy"),
//     web3
//   );

// export const getXvsVaultStoreContract = (web3: Web3) =>
//   getContract(
//     xvsVaultStoreAbi as AbiItem[],
//     getContractAddress("xvsVaultStore"),
//     web3
//   );

// export const getComptrollerContract = (web3: Web3) =>
//   getContract(
//     comptrollerAbi as AbiItem[],
//     getContractAddress("comptroller"),
//     web3
//   );

// export const getPriceOracleContract = (web3: Web3) =>
//   getContract(oracleAbi as AbiItem[], getContractAddress("oracle"), web3);

// export const getInterestModelContract = (address: string, web3: Web3) =>
//   getContract(interestModelAbi as AbiItem[], address, web3);

// const getContract = <T>(
//   abi: AbiItem | AbiItem[],
//   address: string,
//   web3Instance: Web3
// ) => {
//   const web3 = web3Instance ?? null; //getWeb3NoAccount();
//   return new web3.eth.Contract(abi, address) as unknown as T;
// };

// export const getMyContract = (address: string, abi: any, web3: Web3) => {
//   getContract(abi as AbiItem[], address, web3);
// };

const getContract = <T>(
  abi: AbiItem | AbiItem[],
  address: string,
  web3Instance: Web3
) => {
  const web3 = web3Instance ?? getWeb3NoAccount();
  return new web3.eth.Contract(abi, address) as unknown as T;
};

export const getComptrollerContract = (web3: Web3, address: string) => {
  let myComptroller: any = Comptroller;
  return getContract(
    myComptroller.abi as AbiItem[],
    address,
    web3
  ) as unknown as any;
};

export const useComptrollerContract = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getComptrollerContract(web3, address), [web3, address]);
};

export const getTokenContract = (web3: Web3, address: string) => {
  let myERC20Detailed: any = ERC20Detailed;
  return getContract(
    myERC20Detailed.abi as AbiItem[],
    address,
    web3
  ) as unknown as any;
};

export const useTokenContract = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getTokenContract(web3, address), [web3, address]);
};

export const getPriceOracleProxyContract = (web3: Web3, address: string) => {
  let myUniswapOracleTWAP: any = UniswapOracleTWAP;
  return getContract(
    myUniswapOracleTWAP.abi as AbiItem[],
    address,
    web3
  ) as unknown as any;
};

export const usePriceOracleProxyContract = (address: string) => {
  const web3 = useWeb3();
  return useMemo(
    () => getPriceOracleProxyContract(web3, address),
    [web3, address]
  );
};

export const getCTokenContract = (web3: Web3, address: string) => {
  let myCErc20Immutable: any = CErc20Immutable;
  return getContract(
    myCErc20Immutable.abi as AbiItem[],
    address,
    web3
  ) as unknown as any;
};

export const useCTokenContract = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getCTokenContract(web3, address), [web3, address]);
};

export const getWeb3Contract = (web3: Web3, address: string) => {
  let myComptrollerV3: any = ComptrollerV3;
  return getContract(
    myComptrollerV3.abi as AbiItem[],
    address,
    web3
  ) as unknown as any;
};

export const useWeb3Contract = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getWeb3Contract(web3, address), [web3, address]);
};

export const getTokenContractWithAbiIVTDemoABI = (
  web3: Web3,
  address: string
) => {
  let myERC20Detailed: any = ERC20Detailed;
  return getContract(
    myERC20Detailed.abi as AbiItem[],
    address,
    web3
  ) as unknown as any;
};

export const useTokenContractWithAbiIVTDemoABI = (address: string) => {
  const web3 = useWeb3();
  return useMemo(
    () => getTokenContractWithAbiIVTDemoABI(web3, address),
    [web3, address]
  );
};

export const getCompContract = (web3: Web3, address: string) => {
  let myComp: any = Comp;
  return getContract(myComp.abi as AbiItem[], address, web3) as unknown as any;
};

export const useCompContract = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getCompContract(web3, address), [web3, address]);
};

export const getCTokenContractWithAbiCErc20Delegator = (
  web3: Web3,
  address: string
) => {
  let myCErc20Delegator: any = CErc20Delegator;
  return getContract(
    myCErc20Delegator.abi as AbiItem[],
    address,
    web3
  ) as unknown as any;
};

export const useCTokenContractWithAbiCErc20Delegator = (address: string) => {
  const web3 = useWeb3();
  return useMemo(
    () => getCTokenContractWithAbiCErc20Delegator(web3, address),
    [web3, address]
  );
};
