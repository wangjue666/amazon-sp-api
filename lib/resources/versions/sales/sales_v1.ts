import { ReqParams } from '../../../utils';

export default {
  v1: {
    getOrderMetrics: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/sales/v1/orderMetrics',
        restore_rate: 2
      });
    }
  }
};
