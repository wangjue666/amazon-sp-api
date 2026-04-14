import sellers_v1.js from './versions/sellers/sellers_v1.js';

export default {
  sellers: {
    __versions: ['v1'],
    __operations: ['getMarketplaceParticipations', 'getAccount'],
    ...sellers_v1.js
  }
};
