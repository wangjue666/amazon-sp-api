import shipmentInvoicing_v0 from './versions/shipment_invoicing/shipmentInvoicing_v0';

export default {
  // shipmentInvoicing endpoint is available only for the Brazil marketplace!
  shipmentInvoicing: {
    __versions: ['v0'],
    __operations: ['getShipmentDetails', 'submitInvoice', 'getInvoiceStatus'],
    ...shipmentInvoicing_v0
  }
};
