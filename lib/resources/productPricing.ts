import productPricing_v0 from './versions/product_pricing/productPricing_v0';
import productPricing_2022_05_01 from './versions/product_pricing/productPricing_2022-05-01';

export default {
  productPricing: {
    __versions: ['v0', '2022-05-01'],
    __operations: [
      'getPricing',
      'getCompetitivePricing',
      'getListingOffers',
      'getItemOffers',
      'getItemOffersBatch',
      'getListingOffersBatch',
      'getFeaturedOfferExpectedPriceBatch',
      'getCompetitiveSummary'
    ],
    ...productPricing_v0,
    ...productPricing_2022_05_01
  }
};
