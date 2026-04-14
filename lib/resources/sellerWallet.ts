import sellerWallet_2024_03_01.js from './versions/seller_wallet/sellerWallet_2024-03-01.js';

export default {
  sellerWallet: {
    __versions: ['2024-03-01'],
    __operations: [
      'listAccounts',
      'getAccount',
      'listAccountBalances',
      'getTransferPreview',
      'listAccountTransactions',
      'createTransaction',
      'getTransaction',
      'listTransferSchedules',
      'createTransferSchedule',
      'updateTransferSchedule',
      'getTransferSchedule',
      'deleteScheduleTransaction'
    ],
    ...sellerWallet_2024_03_01.js
  }
};
