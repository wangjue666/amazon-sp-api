import { checkAndEncodeParams, ReqParams } from '../../../utils';

export default {
  v0: {
    listFinancialEventGroups: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/finances/v0/financialEventGroups',
        restore_rate: 2
      });
    },
    listFinancialEventsByGroupId: (req_params: ReqParams): ReqParams => {
      req_params = checkAndEncodeParams(req_params, {
        path: {
          eventGroupId: {
            type: 'string'
          }
        }
      });
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/finances/v0/financialEventGroups/' + req_params.path!.eventGroupId + '/financialEvents',
        restore_rate: 2
      });
    },
    listFinancialEventsByOrderId: (req_params: ReqParams): ReqParams => {
      req_params = checkAndEncodeParams(req_params, {
        path: {
          orderId: {
            type: 'string'
          }
        }
      });
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/finances/v0/orders/' + req_params.path!.orderId + '/financialEvents',
        restore_rate: 2
      });
    },
    listFinancialEvents: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/finances/v0/financialEvents',
        restore_rate: 2
      });
    }
  }
};
