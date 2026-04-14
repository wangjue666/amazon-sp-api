import solicitations_v1 from './versions/solicitations/solicitations_v1';

export default {
  solicitations: {
    __versions: ['v1'],
    __operations: ['getSolicitationActionsForOrder', 'createProductReviewAndSellerFeedbackSolicitation'],
    ...solicitations_v1
  }
};
