import { ReqParams } from '../../../utils';

export default {
  v1: {
    submitInvoice: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'POST',
        api_path: '/vendor/directFulfillment/payments/v1/invoices',
        restore_rate: 0.1
      });
    }
  }
};
