import { ReqParams } from '../../../utils';

export default {
  v1: {
    SubmitShipmentConfirmations: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'POST',
        api_path: '/vendor/shipping/v1/shipmentConfirmations',
        restore_rate: 0.1
      });
    },
    GetShipmentDetails: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/vendor/shipping/v1/shipments',
        restore_rate: 0.1
      });
    },
    SubmitShipments: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'POST',
        api_path: '/vendor/shipping/v1/shipments',
        restore_rate: 0.1
      });
    },
    GetShipmentLabels: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/vendor/shipping/v1/transportLabels',
        restore_rate: 0.1
      });
    }
  }
};
