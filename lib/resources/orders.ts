import orders_v0 from './versions/orders/orders_v0';
import orders_2026_01_01 from './versions/orders/orders_2026-01-01';

export default {
  orders: {
    __versions: ['v0', '2026-01-01'],
    __operations: [
      'getOrders',
      'getOrder',
      'getOrderBuyerInfo',
      'getOrderAddress',
      'getOrderItems',
      'getOrderItemsBuyerInfo',
      'updateShipmentStatus',
      'getOrderRegulatedInfo',
      'updateVerificationStatus',
      'confirmShipment',
      'searchOrders'
    ],
    ...orders_v0,
    ...orders_2026_01_01
  }
};
