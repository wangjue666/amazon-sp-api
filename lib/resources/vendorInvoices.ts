import vendorInvoices_v1 from './versions/vendor_invoices/vendorInvoices_v1';

export default {
  vendorInvoices: {
    __versions: ['v1'],
    __operations: ['submitInvoices'],
    ...vendorInvoices_v1
  }
};
