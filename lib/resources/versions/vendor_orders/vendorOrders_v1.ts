import { checkAndEncodeParams, ReqParams } from '../../../utils';

export default {
  v1: {
    getPurchaseOrders: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/vendor/orders/v1/purchaseOrders',
        restore_rate: 0.1
      });
    },
    getPurchaseOrder: (req_params: ReqParams): ReqParams => {
      req_params = checkAndEncodeParams(req_params, {
        path: {
          purchaseOrderNumber: {
            type: 'string'
          }
        }
      });
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/vendor/orders/v1/purchaseOrders/' + req_params.path!.purchaseOrderNumber,
        restore_rate: 0.1
      });
    },
    submitAcknowledgement: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'POST',
        api_path: '/vendor/orders/v1/acknowledgements',
        restore_rate: 0.1
      });
    },
    getPurchaseOrdersStatus: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/vendor/orders/v1/purchaseOrdersStatus',
        restore_rate: 0.1
      });
    }
  }
};
