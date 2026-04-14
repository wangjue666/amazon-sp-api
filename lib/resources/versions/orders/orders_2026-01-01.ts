import { checkAndEncodeParams, ReqParams } from '../../../utils';

export default {
  '2026-01-01': {
    searchOrders: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/orders/2026-01-01/orders',
        restore_rate: 180
      });
    },
    getOrder: (req_params: ReqParams): ReqParams => {
      req_params = checkAndEncodeParams(req_params, {
        path: {
          orderId: {
            type: 'string'
          }
        }
      });
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/orders/2026-01-01/orders/' + req_params.path!.orderId,
        restore_rate: 2
      });
    }
  }
};
