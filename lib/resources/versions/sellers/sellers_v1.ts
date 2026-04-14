import { ReqParams } from '../../../utils';

export default {
  v1: {
    getMarketplaceParticipations: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/sellers/v1/marketplaceParticipations',
        restore_rate: 60
      });
    },
    getAccount: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/sellers/v1/account',
        restore_rate: 2,
        sandbox_only: true
      });
    }
  }
};
