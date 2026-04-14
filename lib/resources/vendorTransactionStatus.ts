import vendorTransactionStatus_v1 from './versions/vendor_transaction_status/vendorTransactionStatus_v1';

export default {
  vendorTransactionStatus: {
    __versions: ['v1'],
    __operations: ['getTransaction'],
    ...vendorTransactionStatus_v1
  }
};
