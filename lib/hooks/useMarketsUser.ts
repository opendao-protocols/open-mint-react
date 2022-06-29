import { useContext } from 'react';
import { MarketContext } from '../../components/utils/MarketContext';


export const useMarketsUser = () => {
  const { userMarketInfo, userTotalBorrowLimit, userTotalBorrowBalance } =
    useContext(MarketContext);
  return {
    userMarketInfo,
    userTotalBorrowLimit,
    userTotalBorrowBalance
  };
};
