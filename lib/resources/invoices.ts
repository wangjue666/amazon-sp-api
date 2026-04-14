import invoices_2024_06_19 from './versions/invoices/invoices_2024-06-19';

export default {
  invoices: {
    __versions: ['2024-06-19'],
    __operations: [
      'getInvoicesAttributes',
      'getInvoicesDocument',
      'getInvoicesExports',
      'createInvoicesExport',
      'getInvoicesExport',
      'getInvoices',
      'getInvoice',
      'createGovernmentInvoice',
      'getGovernmentInvoiceStatus',
      'getGovernmentInvoiceDocument'
    ],
    ...invoices_2024_06_19
  }
};
