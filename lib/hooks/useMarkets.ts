import { useContext } from 'react';
import { MarketContext } from '../../components/utils/MarketContext';

export const useMarkets = () => {
  const { markets, dailyVenus, treasuryTotalUSDBalance } = useContext(MarketContext);
  return { markets, dailyVenus, treasuryTotalUSDBalance };
};
