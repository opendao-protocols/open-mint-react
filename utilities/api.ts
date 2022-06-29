// import { IGetMarketsResponse } from 'clients/api/queries/getMarkets';
import { restService } from './restService';

export const fetchMarkets = async () =>
  restService({
    endpoint: '/markets/matic',
    method: 'GET',
  });
