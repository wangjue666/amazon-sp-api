import messaging_v1 from './versions/messaging/messaging_v1';

export default {
  messaging: {
    __versions: ['v1'],
    __operations: [
      'getMessagingActionsForOrder',
      'confirmCustomizationDetails',
      'createConfirmDeliveryDetails',
      'createLegalDisclosure',
      'createNegativeFeedbackRemoval',
      'createConfirmOrderDetails',
      'createConfirmServiceDetails',
      'CreateAmazonMotors',
      'CreateWarranty',
      'GetAttributes',
      'createDigitalAccessKey',
      'createUnexpectedProblem',
      'sendInvoice'
    ],
    ...messaging_v1
  }
};
