import shipping_v1 from './versions/shipping/shipping_v1';
import shipping_v2 from './versions/shipping/shipping_v2';

export default {
  shipping: {
    __versions: ['v1', 'v2'],
    __operations: [
      'createShipment',
      'getShipment',
      'cancelShipment',
      'purchaseLabels',
      'retrieveShippingLabel',
      'purchaseShipment',
      'oneClickShipment',
      'getRates',
      'getAccount',
      'getTrackingInformation',
      'getTracking',
      'getShipmentDocuments',
      'getAccessPoints',
      'submitNdrFeedback',
      'getAdditionalInputs',
      'directPurchaseShipment'
    ],
    ...shipping_v1,
    ...shipping_v2
  }
};
