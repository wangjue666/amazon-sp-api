import { checkAndEncodeParams, ReqParams } from '../../../utils';

export default {
  v1: {
    getSolicitationActionsForOrder: (req_params: ReqParams): ReqParams => {
      req_params = checkAndEncodeParams(req_params, {
        path: {
          amazonOrderId: {
            type: 'string'
          }
        }
      });
      return Object.assign(req_params, {
        method: 'GET',
        api_path: '/solicitations/v1/orders/' + req_params.path!.amazonOrderId,
        restore_rate: 1
      });
    },
    createProductReviewAndSellerFeedbackSolicitation: (req_params: ReqParams): ReqParams => {
      req_params = checkAndEncodeParams(req_params, {
        path: {
          amazonOrderId: {
            type: 'string'
          }
        }
      });
      return Object.assign(req_params, {
        method: 'POST',
        api_path:
          '/solicitations/v1/orders/' + req_params.path!.amazonOrderId + '/solicitations/productReviewAndSellerFeedback',
        restore_rate: 1
      });
    }
  }
};
