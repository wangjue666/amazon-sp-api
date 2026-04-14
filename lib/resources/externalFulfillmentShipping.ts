import externalFulfillmentShipping_2024_09_11 from './versions/external_fulfillment_shipping/externalFulfillmentShipping_2024-09-11';

export default {
  externalFulfillmentShipping: {
    __versions: ['2024-09-11'],
    __operations: [
      'getShipments',
      'getShipment',
      'processShipment',
      'createPackages',
      'updatePackage',
      'updatePackageStatus',
      'retrieveShippingOptions',
      'generateInvoice',
      'retrieveInvoice',
      'generateShipLabels'
    ],
    ...externalFulfillmentShipping_2024_09_11
  }
};
