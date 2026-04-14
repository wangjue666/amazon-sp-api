import productFees_v0 from './versions/product_fees/productFees_v0';

export default {
  productFees: {
    __versions: ['v0'],
    __operations: ['getMyFeesEstimateForSKU', 'getMyFeesEstimateForASIN', 'getMyFeesEstimates'],
    ...productFees_v0
  }
};
