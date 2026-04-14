import { checkAndEncodeParams, ReqParams } from '../../../utils';

export default {
  '2022-04-01': {
    searchCatalogItems: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/catalog/2022-04-01/items',
        restore_rate: 0.5
      });
    },
    getCatalogItem: (req_params: ReqParams): ReqParams => {
      req_params = checkAndEncodeParams(req_params, {
        path: {
          asin: {
            type: 'string'
          }
        }
      });
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/catalog/2022-04-01/items/' + req_params.path!.asin,
        restore_rate: 0.5
      });
    }
  }
};
