import { checkAndEncodeParams, ReqParams } from '../../../utils';

export default {
  v0: {
    getPrepInstructions: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/fba/inbound/v0/prepInstructions',
        restore_rate: 0.5
      });
    },
    getLabels: (req_params: ReqParams): ReqParams => {
      req_params = checkAndEncodeParams(req_params, {
        path: {
          shipmentId: {
            type: 'string'
          }
        }
      });
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/fba/inbound/v0/shipments/' + req_params.path!.shipmentId + '/labels',
        restore_rate: 0.5
      });
    },
    getBillOfLading: (req_params: ReqParams): ReqParams => {
      req_params = checkAndEncodeParams(req_params, {
        path: {
          shipmentId: {
            type: 'string'
          }
        }
      });
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/fba/inbound/v0/shipments/' + req_params.path!.shipmentId + '/billOfLading',
        restore_rate: 0.5
      });
    },
    getShipments: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/fba/inbound/v0/shipments',
        restore_rate: 0.5
      });
    },
    getShipmentItemsByShipmentId: (req_params: ReqParams): ReqParams => {
      req_params = checkAndEncodeParams(req_params, {
        path: {
          shipmentId: {
            type: 'string'
          }
        }
      });
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/fba/inbound/v0/shipments/' + req_params.path!.shipmentId + '/items',
        restore_rate: 0.5
      });
    },
    getShipmentItems: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/fba/inbound/v0/shipmentItems',
        restore_rate: 0.5
      });
    }
  }
};
