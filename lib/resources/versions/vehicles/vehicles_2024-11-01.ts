import { ReqParams } from '../../../utils';

export default {
  '2024-11-01': {
    getVehicles: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/catalog/2024-11-01/automotive/vehicles',
        // No restore rate defined in docs!
        restore_rate: 1
      });
    }
  }
};
