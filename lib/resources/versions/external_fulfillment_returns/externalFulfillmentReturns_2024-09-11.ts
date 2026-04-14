import { checkAndEncodeParams, ReqParams } from '../../../utils';

export default {
  '2024-09-11': {
    listReturns: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/externalFulfillment/2024-09-11/returns',
        restore_rate: 0.1
      });
    },
    getReturn: (req_params: ReqParams): ReqParams => {
      req_params = checkAndEncodeParams(req_params, {
        path: {
          returnId: {
            type: 'string'
          }
        }
      });
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/externalFulfillment/2024-09-11/returns/' + req_params.path!.returnId,
        restore_rate: 0.1
      });
    }
  }
};
