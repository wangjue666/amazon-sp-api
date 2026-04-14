import dataKiosk_2023_11_15 from './versions/data_kiosk/dataKiosk_2023-11-15';

export default {
  dataKiosk: {
    __versions: ['2023-11-15'],
    __operations: ['getQueries', 'createQuery', 'getQuery', 'cancelQuery', 'getDocument'],
    ...dataKiosk_2023_11_15
  }
};
