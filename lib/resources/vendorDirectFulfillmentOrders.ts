import vendorDirectFulfillmentOrders_v1 from './versions/vendor_direct_fulfillment_orders/vendorDirectFulfillmentOrders_v1';
import vendorDirectFulfillmentOrders_2021_12_28 from './versions/vendor_direct_fulfillment_orders/vendorDirectFulfillmentOrders_2021-12-28';

export default {
  vendorDirectFulfillmentOrders: {
    __versions: ['v1', '2021-12-28'],
    __operations: ['getOrders', 'getOrder', 'submitAcknowledgement'],
    ...vendorDirectFulfillmentOrders_v1,
    ...vendorDirectFulfillmentOrders_2021_12_28
  }
};
