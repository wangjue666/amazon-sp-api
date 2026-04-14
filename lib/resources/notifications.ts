import notifications_v1 from './versions/notifications/notifications_v1';

export default {
  notifications: {
    __versions: ['v1'],
    __operations: [
      'getSubscription',
      'createSubscription',
      'getSubscriptionById',
      'deleteSubscriptionById',
      'getDestinations',
      'createDestination',
      'getDestination',
      'deleteDestination'
    ],
    ...notifications_v1
  }
};
