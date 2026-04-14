import transfers_2024_06_01 from './versions/transfers/transfers_2024-06-01';

export default {
  transfers: {
    __versions: ['2024-06-01'],
    __operations: ['initiatePayout', 'getPaymentMethods'],
    ...transfers_2024_06_01
  }
};
