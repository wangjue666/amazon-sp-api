import finances_v0 from './versions/finances/finances_v0';
import finances_2024_06_19 from './versions/finances/finances_2024-06-19';

export default {
  finances: {
    __versions: ['v0', '2024-06-19'],
    __operations: [
      'listFinancialEventGroups',
      'listFinancialEventsByGroupId',
      'listFinancialEventsByOrderId',
      'listFinancialEvents',
      'listTransactions'
    ],
    ...finances_v0,
    ...finances_2024_06_19
  }
};
