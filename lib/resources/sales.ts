import sales_v1 from './versions/sales/sales_v1';

export default {
  sales: {
    __versions: ['v1'],
    __operations: ['getOrderMetrics'],
    ...sales_v1
  }
};
