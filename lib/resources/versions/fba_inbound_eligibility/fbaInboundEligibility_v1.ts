import { ReqParams } from '../../../utils';

export default {
  v1: {
    getItemEligibilityPreview: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/fba/inbound/v1/eligibility/itemPreview',
        restore_rate: 1
      });
    }
  }
};
