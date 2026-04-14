import { checkAndEncodeParams, ReqParams } from '../../../utils';

export default {
  v0: {
    getEligibleShipmentServices: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'POST',
        api_path: '/mfn/v0/eligibleShippingServices',
        restore_rate: 0.167
      });
    },
    getShipment: (req_params: ReqParams): ReqParams => {
      req_params = checkAndEncodeParams(req_params, {
        path: {
          shipmentId: {
            type: 'string'
          }
        }
      });
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/mfn/v0/shipments/' + req_params.path!.shipmentId,
        restore_rate: 1
      });
    },
    cancelShipment: (req_params: ReqParams): ReqParams => {
      req_params = checkAndEncodeParams(req_params, {
        path: {
          shipmentId: {
            type: 'string'
          }
        }
      });
      return Object.assign(req_params, {
        method: 'DELETE',
        api_path: '/mfn/v0/shipments/' + req_params.path!.shipmentId,
        restore_rate: 1
      });
    },
    createShipment: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'POST',
        api_path: '/mfn/v0/shipments',
        restore_rate: 0.5
      });
    },
    getAdditionalSellerInputs: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'POST',
        api_path: '/mfn/v0/additionalSellerInputs',
        restore_rate: 1
      });
    }
  }
};
