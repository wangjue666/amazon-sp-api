import { ReqParams } from '../../../utils';

export default {
  '2022-11-07': {
    getSellingPartnerMetrics: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'POST',
        api_path: '/replenishment/2022-11-07/sellingPartners/metrics/search',
        restore_rate: 1
      });
    },
    listOfferMetrics: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'POST',
        api_path: '/replenishment/2022-11-07/offers/metrics/search',
        restore_rate: 1
      });
    },
    listOffers: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'POST',
        api_path: '/replenishment/2022-11-07/offers/search',
        restore_rate: 1
      });
    }
  }
};
