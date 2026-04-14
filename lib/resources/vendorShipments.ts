import vendorShipments_v1 from './versions/vendor_shipments/vendorShipments_v1';

export default {
  vendorShipments: {
    __versions: ['v1'],
    __operations: ['SubmitShipmentConfirmations', 'GetShipmentDetails', 'SubmitShipments', 'GetShipmentLabels'],
    ...vendorShipments_v1
  }
};
