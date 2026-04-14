import merchantFulfillment_v0 from './versions/merchant_fulfillment/merchantFulfillment_v0';

export default {
  merchantFulfillment: {
    __versions: ['v0'],
    __operations: [
      'getEligibleShipmentServices',
      'getShipment',
      'cancelShipment',
      'createShipment',
      'getAdditionalSellerInputs'
    ],
    ...merchantFulfillment_v0
  }
};
