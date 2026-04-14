import listingsItems_2020_09_01 from './versions/listings_items/listingsItems_2020-09-01';
import listingsItems_2021_08_01 from './versions/listings_items/listingsItems_2021-08-01';

export default {
  listingsItems: {
    __versions: ['2020-09-01', '2021-08-01'],
    __operations: [
      'getListingsItem',
      'putListingsItem',
      'deleteListingsItem',
      'patchListingsItem',
      'searchListingsItems'
    ],
    ...listingsItems_2020_09_01,
    ...listingsItems_2021_08_01
  }
};
