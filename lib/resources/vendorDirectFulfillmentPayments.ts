import vendorDirectFulfillmentPayments_v1 from './versions/vendor_direct_fulfillment_payments/vendorDirectFulfillmentPayments_v1';

export default {
  vendorDirectFulfillmentPayments: {
    __versions: ['v1'],
    __operations: ['submitInvoice'],
    ...vendorDirectFulfillmentPayments_v1
  }
};
