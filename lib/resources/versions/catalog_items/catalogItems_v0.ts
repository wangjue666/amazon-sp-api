import { ReqParams } from '../../../utils';

export default {
  v0: {
    listCatalogCategories: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/catalog/v0/categories',
        restore_rate: 1
      });
    }
  }
};
