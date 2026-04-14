import sellers_v1 from './versions/sellers/sellers_v1';

export default {
  sellers: {
    __versions: ['v1'],
    __operations: ['getMarketplaceParticipations', 'getAccount'],
    ...sellers_v1
  }
};
