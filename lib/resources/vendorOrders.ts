import vendorOrders_v1 from './versions/vendor_orders/vendorOrders_v1';

export default {
  vendorOrders: {
    __versions: ['v1'],
    __operations: ['getPurchaseOrders', 'getPurchaseOrder', 'submitAcknowledgement', 'getPurchaseOrdersStatus'],
    ...vendorOrders_v1
  }
};
