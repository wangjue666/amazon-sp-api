import appIntegrations_2024_04_01 from './versions/app_integrations/appIntegrations_2024-04-01';

export default {
  appIntegrations: {
    __versions: ['2024-04-01'],
    __operations: ['createNotification', 'deleteNotifications', 'recordActionFeedback'],
    ...appIntegrations_2024_04_01
  }
};
