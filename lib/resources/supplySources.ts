import supplySources_2020_07_01 from './versions/supply_sources/supplySources_2020-07-01';

export default {
  supplySources: {
    __versions: ['2020-07-01'],
    __operations: [
      'getSupplySources',
      'createSupplySource',
      'getSupplySource',
      'updateSupplySource',
      'archiveSupplySource',
      'updateSupplySourceStatus'
    ],
    ...supplySources_2020_07_01
  }
};
