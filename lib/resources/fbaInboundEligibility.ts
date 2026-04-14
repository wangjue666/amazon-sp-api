import fbaInboundEligibility_v1 from './versions/fba_inbound_eligibility/fbaInboundEligibility_v1';

export default {
  fbaInboundEligibility: {
    __versions: ['v1'],
    __operations: ['getItemEligibilityPreview'],
    ...fbaInboundEligibility_v1
  }
};
