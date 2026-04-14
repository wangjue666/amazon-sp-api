import amazonWarehousingAndDistribution_2024_05_09 from './versions/amazon_warehousing_and_distribution/amazonWarehousingAndDistribution_2024-05-09';

export default {
  amazonWarehousingAndDistribution: {
    __versions: ['2024-05-09'],
    __operations: [
      'createInbound',
      'getInbound',
      'updateInbound',
      'cancelInbound',
      'confirmInbound',
      'getInboundShipment',
      'getInboundShipmentLabels',
      'updateInboundShipmentTransportDetails',
      'checkInboundEligibility',
      'listInboundShipments',
      'listInventory'
    ],
    ...amazonWarehousingAndDistribution_2024_05_09
  }
};
