import { ReqParams } from '../../../utils';

export default {
  '2022-05-01': {
    getFeaturedOfferExpectedPriceBatch: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'POST',
        api_path: '/batches/products/pricing/2022-05-01/offer/featuredOfferExpectedPrice',
        restore_rate: 30
      });
    },
    getCompetitiveSummary: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'POST',
        api_path: '/batches/products/pricing/2022-05-01/items/competitiveSummary',
        restore_rate: 30
      });
    }
  }
};
