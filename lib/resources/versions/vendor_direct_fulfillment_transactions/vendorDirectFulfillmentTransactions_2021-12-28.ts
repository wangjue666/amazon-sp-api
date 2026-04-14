import { checkAndEncodeParams, ReqParams } from '../../../utils';

export default {
  '2021-12-28': {
    getTransactionStatus: (req_params: ReqParams): ReqParams => {
      req_params = checkAndEncodeParams(req_params, {
        path: {
          transactionId: {
            type: 'string'
          }
        }
      });
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/vendor/directFulfillment/transactions/2021-12-28/transactions/' + req_params.path!.transactionId,
        restore_rate: 0.1
      });
    }
  }
};
