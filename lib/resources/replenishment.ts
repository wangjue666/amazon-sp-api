import replenishment_2022_11_07 from './versions/replenishment/replenishment_2022-11-07';

export default {
  replenishment: {
    __versions: ['2022-11-07'],
    __operations: ['getSellingPartnerMetrics', 'listOfferMetrics', 'listOffers'],
    ...replenishment_2022_11_07
  }
};
