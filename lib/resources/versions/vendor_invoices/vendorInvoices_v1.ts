import { ReqParams } from '../../../utils';

export default {
  v1: {
    submitInvoices: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'POST',
        api_path: '/vendor/payments/v1/invoices',
        restore_rate: 0.1
      });
    }
  }
};
