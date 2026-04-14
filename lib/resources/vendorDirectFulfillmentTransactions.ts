import vendorDirectFulfillmentTransactions_v1 from './versions/vendor_direct_fulfillment_transactions/vendorDirectFulfillmentTransactions_v1';
import vendorDirectFulfillmentTransactions_2021_12_28 from './versions/vendor_direct_fulfillment_transactions/vendorDirectFulfillmentTransactions_2021-12-28';

export default {
  vendorDirectFulfillmentTransactions: {
    __versions: ['v1', '2021-12-28'],
    __operations: ['getTransactionStatus'],
    ...vendorDirectFulfillmentTransactions_v1,
    ...vendorDirectFulfillmentTransactions_2021_12_28
  }
};
