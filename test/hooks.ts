import config from './config';
import SellingPartner from '../lib/SellingPartner';

// Augment Mocha's Context interface to include our custom properties
declare module 'mocha' {
  interface Context {
    config: typeof config;
    sellingPartner: InstanceType<typeof SellingPartner>;
  }
}

export const mochaHooks = {
  beforeAll: async function (this: Mocha.Context) {
    const sellingPartner = new SellingPartner({
      region: config.region as 'eu' | 'na' | 'fe',
      refresh_token: config.refresh_token,
      options: {
        auto_request_tokens: false
      }
    });
    await sellingPartner.refreshAccessToken();
    config.access_token = sellingPartner.access_token;
    this.config = config;
  },

  beforeEach: function (this: Mocha.Context, done: Mocha.Done) {
    const skip_hook_titles = ['configErrors', 'authorization', 'notifications'];
    if (!skip_hook_titles.includes(this.currentTest!.parent!.title)) {
      this.sellingPartner = new SellingPartner({
        region: config.region as 'eu' | 'na' | 'fe',
        refresh_token: config.refresh_token,
        access_token: config.access_token,
        options: {
          auto_request_tokens: false
        },
        endpoints_versions: {
          reports: '2021-06-30'
        }
      });
    }
    done();
  }
};
