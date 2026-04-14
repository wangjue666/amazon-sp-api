import { checkAndEncodeParams, ReqParams } from '../../../utils';

export default {
  '2020-11-01': {
    createUploadDestinationForResource: (req_params: ReqParams): ReqParams => {
      req_params = checkAndEncodeParams(req_params, {
        path: {
          resource: {
            type: 'string'
          }
        }
      });
      return Object.assign(req_params, {
        method: 'POST',
        api_path: '/uploads/2020-11-01/uploadDestinations/' + req_params.path!.resource,
        restore_rate: 0.1
      });
    }
  }
};
