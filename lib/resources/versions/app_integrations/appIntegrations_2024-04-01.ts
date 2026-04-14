import { checkAndEncodeParams, ReqParams } from '../../../utils';

export default {
  '2024-04-01': {
    createNotification: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'POST',
        api_path: '/appIntegrations/2024-04-01/notifications',
        restore_rate: 1
      });
    },
    deleteNotifications: (req_params: ReqParams): ReqParams => {
      return Object.assign(req_params, {
        method: 'POST',
        api_path: '/appIntegrations/2024-04-01/notifications/deletion',
        restore_rate: 1
      });
    },
    recordActionFeedback: (req_params: ReqParams): ReqParams => {
      req_params = checkAndEncodeParams(req_params, {
        path: {
          notificationId: {
            type: 'string'
          }
        }
      });
      return Object.assign(req_params, {
        method: 'POST',
        api_path: '/appIntegrations/2024-04-01/notifications/' + req_params.path!.notificationId + '/feedback',
        restore_rate: 1
      });
    }
  }
};
