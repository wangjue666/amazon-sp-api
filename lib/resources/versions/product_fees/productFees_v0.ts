import { checkAndEncodeParams, ReqParams } from '../../../utils';

export default {
  v0: {
    getMyFeesEstimateForSKU: (req_params: ReqParams): ReqParams => {
      req_params = checkAndEncodeParams(req_params, {
        path: {
          SellerSKU: {
            type: 'string'
          }
        }
      });
      return Object.assign(req_params, {
        method: 'POST',
        api_path: '/products/fees/v0/listings/' + req_params.path!.SellerSKU + '/feesEstimate',
        restore_rate: 1
      });
    },
    getMyFeesEstimateForASIN: (req_params: ReqParams): ReqParams => {
      req_params = checkAndEncodeParams(req_params, {
        path: {
          Asin: {
            type: 'string'
          }
        }
      });
      return Object.assign(req_params, {
        method: 'POST',
        api_path: '/products/fees/v0/items/' + req_params.path!.Asin + '/feesEstimate',
        restore_rate: 1
      });
    },
    getMyFeesEstimates: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'POST',
        api_path: '/products/fees/v0/feesEstimate',
        restore_rate: 2
      });
    }
  }
};
