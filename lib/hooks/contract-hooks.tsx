import { useContext, useMemo } from "react";
import AppContext from "../../components/utils/AppContext";
import { getMyContract } from "../../contracts/getters";

// import { useWeb3 } from "clients/web3";

// export const useTokenContract = <T extends TokenId>(name: T) => {
//   const web3 = useWeb3();
//   return useMemo(() => getTokenContract<T>(name, web3), [web3, name]);
// };

// export const useTokenContractByAddress = (address: string) => {
//   const web3 = useWeb3();
//   return useMemo(
//     () => getTokenContractByAddress(address, web3),
//     [web3, address]
//   );
// };

// export const useVTokenContract = <T extends VTokenId>(name: T) => {
//   const web3 = useWeb3();
//   return useMemo(() => getVTokenContract<T>(name, web3), [web3, name]);
// };

// export const useVaiUnitrollerContract = () => {
//   const web3 = useWeb3();
//   return useMemo(() => getVaiUnitrollerContract(web3), [web3]);
// };

export const useContractByAddress = (address: string, abi: any) => {
  const { web3 } = useContext(AppContext);
  return useMemo(() => getMyContract(address, abi, web3), [web3, address]);
};
